<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['submit', 'error'])

const isRecording = ref(false)
const recordingTime = ref('00:00')

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
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  recordingTime.value = '00:00'
}

async function startRecording() {
  audioChunks = []
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } })
    const preferredTypes = ['audio/ogg;codecs=opus', 'audio/webm;codecs=opus', 'audio/mp4', '']
    const mimeType = preferredTypes.find(t => !t || MediaRecorder.isTypeSupported(t)) || ''
    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data) }
    mediaRecorder.start()
    isRecording.value = true
    startTimer()
  } catch (err) {
    emit('error', 'Микрофон: ' + (err.message || 'ошибка'))
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

function sendAudio() {
  if (audioChunks.length === 0) { emit('error', 'Не удалось захватить аудио'); return }
  const type = mediaRecorder ? mediaRecorder.mimeType : 'audio/webm'
  const blob = new Blob(audioChunks, { type })
  audioChunks = []
  emit('submit', blob)
}

function toggleMic() {
  if (isRecording.value) finishRecording()
  else startRecording()
}

onUnmounted(() => {
  stopTimer()
  if (stream) stream.getTracks().forEach(t => t.stop())
})
</script>

<template>
  <div class="voice-root flex flex-column align-items-center gap-3">
    <Button
      :icon="isRecording ? 'pi pi-stop' : 'pi pi-microphone'"
      :severity="isRecording ? 'danger' : 'primary'"
      rounded
      @click="toggleMic"
      v-tooltip.top="isRecording ? 'Остановить запись' : 'Голосовой запрос'"
    />
    <small v-if="isRecording" class="text-color-secondary font-mono">{{ recordingTime }}</small>
    <small v-else class="text-color-secondary">Нажмите на микрофон</small>
  </div>
</template>
