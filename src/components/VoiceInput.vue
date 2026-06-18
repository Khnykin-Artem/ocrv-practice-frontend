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

function wavEncode(samples, rate) {
  const len = samples.length
  const buf = new ArrayBuffer(44 + len * 2)
  const v = new DataView(buf)

  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  w(0, 'RIFF'); v.setUint32(4, 36 + len * 2, true); w(8, 'WAVE')
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true)
  v.setUint16(22, 1, true); v.setUint32(24, rate, true)
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  w(36, 'data'); v.setUint32(40, len * 2, true)

  let off = 44
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    off += 2
  }
  return new Blob([buf], { type: 'audio/wav' })
}

function resample(samples, fromRate, toRate) {
  if (fromRate === toRate) return samples
  const ratio = fromRate / toRate
  const outLen = Math.round(samples.length / ratio)
  const out = new Float32Array(outLen)
  for (let i = 0; i < outLen; i++) {
    const src = i * ratio
    const lo = Math.floor(src)
    const hi = Math.min(lo + 1, samples.length - 1)
    const frac = src - lo
    out[i] = samples[lo] + frac * (samples[hi] - samples[lo])
  }
  return out
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

function startTimer() {
  startTime = Date.now()
  timerInterval = setInterval(() => {
    recordingTime.value = formatTime(Date.now() - startTime)
  }, 200)
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

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : ''
    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    mediaRecorder.start()
    isRecording.value = true
    startTimer()
  } catch (err) {
    emit('error', 'Микрофон: ' + (err.message || 'ошибка'))
  }
}

async function finishRecording() {
  isRecording.value = false
  stopTimer()

  if (!mediaRecorder || mediaRecorder.state !== 'recording') return

  mediaRecorder.onstop = async () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      stream = null
    }
    mediaRecorder = null
    await convertAndSend()
  }
  mediaRecorder.stop()
}

async function convertAndSend() {
  if (audioChunks.length === 0) {
    emit('error', 'Не удалось захватить аудио')
    return
  }

  const raw = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
  audioChunks = []

  let ctx
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') await ctx.resume()

    const buf = await raw.arrayBuffer()
    const audioBuf = await ctx.decodeAudioData(buf)
    const srcRate = audioBuf.sampleRate
    const src = audioBuf.getChannelData(0)
    const resampled = resample(src, srcRate, 16000)
    const wav = wavEncode(resampled, 16000)

    emit('submit', wav)
  } catch {
    emit('submit', raw)
  } finally {
    if (ctx) ctx.close()
  }
}

function toggleMic() {
  if (isRecording.value) finishRecording()
  else startRecording()
}

onUnmounted(() => {
  stopTimer()
  if (stream) {
    stream.getTracks().forEach(t => t.stop())
  }
})
</script>

<template>
  <div>
    <div class="voice-input flex align-items-center gap-2">
      <Button
        :icon="isRecording ? 'pi pi-stop-circle' : 'pi pi-microphone'"
        :class="['mic-btn', { 'pulsing': isRecording }]"
        :severity="isRecording ? 'danger' : 'primary'"
        rounded
        @click="toggleMic"
        v-tooltip.top="isRecording ? 'Остановить запись' : 'Голосовой запрос'"
      />
      <span v-if="isRecording" class="text-sm font-mono text-color-secondary">{{ recordingTime }}</span>
    </div>
    <small v-if="!isRecording" class="text-xs text-color-secondary block mt-1">Нажмите на микрофон и задайте вопрос голосом</small>
  </div>
</template>

<style scoped>
.voice-input {
  width: 100%;
}
.mic-btn {
  transition: all 0.2s;
  flex-shrink: 0;
}
.mic-btn.pulsing {
  animation: pulse-ring 1.5s infinite;
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
</style>
