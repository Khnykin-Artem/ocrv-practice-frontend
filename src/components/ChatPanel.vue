<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ResponseBlock from './ResponseBlock.vue'
import { useVoiceCommands } from '../composables/useVoiceCommands'
import { voiceQuery } from '../utils/api'
import ProgressSpinner from 'primevue/progressspinner'

const emit = defineEmits(['command'])

const messages = ref([])
const scrollRef = ref(null)
const loading = ref(false)
const recordingError = ref('')
const isRecording = ref(false)
const recordingTime = ref('00:00')
const lastAudioBlob = ref(null)
const { matchCommand } = useVoiceCommands()

let stream = null
let mediaRecorder = null
let audioChunks = []
let timerInterval = null
let startTime = 0

function formatTime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

function startTimer() {
  startTime = Date.now()
  timerInterval = setInterval(() => {
    recordingTime.value = formatTime(Date.now() - startTime)
  }, 500)
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
  recordingTime.value = '00:00'
}

async function startRecording() {
  audioChunks = []
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } })
    const types = ['audio/ogg;codecs=opus', 'audio/webm;codecs=opus', 'audio/mp4', '']
    const mt = types.find(t => !t || MediaRecorder.isTypeSupported(t)) || ''
    mediaRecorder = new MediaRecorder(stream, mt ? { mimeType: mt } : {})
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data) }
    mediaRecorder.start()
    isRecording.value = true
    startTimer()
  } catch (err) {
    recordingError.value = 'Микрофон: ' + (err.message || 'ошибка')
  }
}

function finishRecording() {
  isRecording.value = false
  stopTimer()
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return
  mediaRecorder.onstop = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null }
    mediaRecorder = null
    sendAudio()
  }
  mediaRecorder.stop()
}

function audioBufferToWav(buf) {
  const numChannels = 1
  const sampleRate = buf.sampleRate
  const format = 1
  const bitsPerSample = 16
  const data = buf.getChannelData(0)
  const dataLen = data.length * (bitsPerSample / 8)
  const buffer = new ArrayBuffer(44 + dataLen)
  const view = new DataView(buffer)
  function writeString(offset, str) { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)) }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataLen, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true)
  view.setUint16(32, numChannels * (bitsPerSample / 8), true)
  view.setUint16(34, bitsPerSample, true)
  writeString(36, 'data')
  view.setUint32(40, dataLen, true)
  let offset = 44
  for (let i = 0; i < data.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, data[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
  return buffer
}

async function convertToWav(blob) {
  const ctx = new AudioContext({ sampleRate: 16000 })
  const arrayBuf = await blob.arrayBuffer()
  const audioBuf = await ctx.decodeAudioData(arrayBuf)
  const wavBuf = audioBufferToWav(audioBuf)
  ctx.close()
  return new Blob([wavBuf], { type: 'audio/wav' })
}

async function sendAudio() {
  if (audioChunks.length === 0) { recordingError.value = 'Не удалось захватить аудио'; return }
  const type = mediaRecorder ? mediaRecorder.mimeType : 'audio/webm'
  let blob = new Blob(audioChunks, { type })
  if (blob.type.includes('webm')) {
    try { blob = await convertToWav(blob) } catch (e) { console.warn('WAV conversion failed, sending original', e) }
  }
  if (lastAudioBlob.value) URL.revokeObjectURL(lastAudioBlob.value)
  lastAudioBlob.value = blob
  audioChunks = []
  handleVoiceSubmit(blob)
}

function downloadLastAudio() {
  if (!lastAudioBlob.value) return
  const url = URL.createObjectURL(lastAudioBlob.value)
  const mt = lastAudioBlob.value.type
  const ext = mt.includes('ogg') ? 'ogg' : mt.includes('wav') ? 'wav' : mt.includes('mp4') ? 'm4a' : mt.includes('mp3') ? 'mp3' : 'webm'
  const a = document.createElement('a')
  a.href = url
  a.download = `voice-${Date.now()}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleVoiceSubmit(audio) {
  loading.value = true
  recordingError.value = ''
  try {
    const result = await voiceQuery(audio)
    const userText = result.user_text || 'Голосовой запрос'
    addMessage('user', userText)
    if (result.blocks && result.blocks.length) {
      addMessage('assistant', '', result.blocks)
    } else {
      addMessage('assistant', 'Ничего не найдено по вашему запросу.')
    }
  } catch (err) {
    recordingError.value = 'Бэкенд недоступен: ' + (err.message || 'ошибка')
    addMessage('user', 'Голосовой запрос')
    addMessage('assistant', 'Не удалось обработать голосовой запрос.')
  } finally {
    loading.value = false
  }
}

function addMessage(role, text, blocks) {
  messages.value = [...messages.value, {
    id: crypto.randomUUID(),
    role,
    text,
    blocks: blocks || null,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }]
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
  })
}

function toggleMic() {
  if (isRecording.value) finishRecording()
  else startRecording()
}

onUnmounted(() => {
  stopTimer()
  if (stream) stream.getTracks().forEach(t => t.stop())
})

addMessage('assistant', 'Привет! Я AI-помощник по новостям. Нажми на микрофон и задай вопрос голосом.')
</script>

<template>
  <div class="chat-panel flex flex-column" style="height:100%">
    <div ref="scrollRef" class="chat-messages flex-1 overflow-y-auto">
      <div class="py-6 px-3" style="max-width:640px;margin:0 auto">
        <template v-for="msg in messages" :key="msg.id">
          <ChatMessage v-if="msg.role === 'user'" :message="msg" />
          <div v-else-if="msg.blocks" class="mb-3">
            <ResponseBlock v-for="(block, i) in msg.blocks" :key="i" :block="block" class="mb-2" />
          </div>
          <ChatMessage v-else :message="msg" />
        </template>
      </div>
    </div>

    <div class="chat-input-strip">
      <div v-if="loading" class="flex align-items-center justify-content-center gap-1 mb-2">
        <ProgressSpinner style="width:16px;height:16px" strokeWidth="4" />
        <span class="text-xs">Обработка запроса...</span>
      </div>

      <div class="flex flex-column align-items-center gap-2">
        <div class="mic-ring" :class="{ recording: isRecording }">
          <Button
            :icon="isRecording ? 'pi pi-stop' : 'pi pi-microphone'"
            :severity="isRecording ? 'danger' : 'primary'"
            rounded
            @click="toggleMic()"
            v-tooltip.top="isRecording ? 'Остановить запись' : 'Голосовой запрос'"
            style="width:90px;height:90px"
          />
        </div>
        <small v-if="isRecording" class="flex align-items-center gap-1 font-mono">
          <span class="rec-dot"></span>
          {{ recordingTime }}
        </small>
        <small v-else class="flex align-items-center gap-2 text-color-secondary">
          <span>Нажмите на микрофон и задайте вопрос голосом</span>
          <Button
            v-if="lastAudioBlob"
            icon="pi pi-download"
            text
            rounded
            severity="secondary"
            v-tooltip.top="'Скачать последнюю запись'"
            @click="downloadLastAudio"
            style="width:28px;height:28px"
          />
        </small>
      </div>

      <small v-if="recordingError" class="p-error block text-center mt-1">{{ recordingError }}</small>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  height: 100%;
}
.chat-messages {
  scroll-behavior: smooth;
  flex: 1;
  min-height: 0;
}
.chat-messages::-webkit-scrollbar { width: 5px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 3px; }
.chat-input-strip {
  padding: 12px 16px 16px;
}
.mic-ring {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.mic-ring.recording {
  animation: mic-pulse 2s infinite;
}
@keyframes mic-pulse {
  0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
  50% { box-shadow: 0 0 0 28px rgba(220,38,38,0); }
  100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
}
.rec-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc2626;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
</style>
