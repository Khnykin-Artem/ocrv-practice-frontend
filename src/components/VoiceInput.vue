<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['submit', 'error'])

const isRecording = ref(false)
const recordingTime = ref('00:00')

let stream = null
let audioCtx = null
let source = null
let processor = null
let samples = []
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
  const sec = s % 60
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0')
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
  samples = []

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } })

    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') await audioCtx.resume()

    source = audioCtx.createMediaStreamSource(stream)
    processor = audioCtx.createScriptProcessor(4096, 1, 1)

    processor.onaudioprocess = (e) => {
      const ch = e.inputBuffer.getChannelData(0)
      samples.push(new Float32Array(ch))
    }

    source.connect(processor)
    isRecording.value = true
    startTimer()
  } catch (err) {
    emit('error', 'Микрофон: ' + (err.message || 'ошибка'))
  }
}

function stopRecording() {
  if (!processor || !audioCtx || !source) {
    cleanup()
    return
  }

  isRecording.value = false
  stopTimer()

  processor.disconnect()
  source.disconnect()
  processor.onaudioprocess = null

  cleanup()

  processAudio()
}

function cleanup() {
  processor = null
  source = null

  if (stream) {
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }

  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}

function processAudio() {
  if (samples.length === 0) {
    emit('error', 'Не удалось захватить аудио. Попробуйте ещё раз.')
    samples = []
    return
  }

  const totalLen = samples.reduce((s, a) => s + a.length, 0)
  const merged = new Float32Array(totalLen)
  let offset = 0
  for (const a of samples) {
    merged.set(a, offset)
    offset += a.length
  }
  samples = []

  const srcRate = audioCtx ? audioCtx.sampleRate : 48000
  const resampled = resample(merged, srcRate, 16000)
  const wav = wavEncode(resampled, 16000)

  emit('submit', wav)
}

function toggleMic() {
  if (isRecording.value) stopRecording()
  else startRecording()
}

onUnmounted(() => {
  stopTimer()
  cleanup()
})
</script>

<template>
  <div class="flex flex-column align-items-center">
    <div class="flex align-items-center justify-content-center gap-3">
      <Button
        :icon="isRecording ? 'pi pi-stop-circle' : 'pi pi-microphone'"
        :class="['mic-btn', { 'pulsing': isRecording }]"
        :severity="isRecording ? 'danger' : 'primary'"
        :rounded="true"
        :size="isRecording ? 'large' : 'large'"
        @click="toggleMic"
        v-tooltip.top="isRecording ? 'Остановить запись' : 'Голосовой запрос'"
      />
      <span v-if="isRecording" class="text-sm font-mono text-color-secondary">{{ recordingTime }}</span>
    </div>
    <span v-if="!isRecording" class="text-xs text-color-secondary mt-2">Нажмите на микрофон и задайте вопрос голосом</span>
  </div>
</template>

<style scoped>
.mic-btn {
  transition: all 0.2s;
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
