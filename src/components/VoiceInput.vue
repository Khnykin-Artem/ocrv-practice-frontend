<script setup>
import { ref, watch } from 'vue'
import { useSpeechRecognition } from '../composables/useSpeechRecognition'

const emit = defineEmits(['submit'])

const { isSupported, isListening, interimText, finalText, error, diagnosticInfo, start, stop, retry, diagnose, clearError } = useSpeechRecognition()

const inputText = ref('')
const diagnosing = ref(false)

watch(finalText, (val) => {
  if (val) {
    inputText.value = val
  }
})

watch(interimText, (val) => {
  if (isListening.value && val) {
    inputText.value = val
  }
})

function toggleMic() {
  if (isListening.value) {
    stop()
  } else {
    inputText.value = ''
    clearError()
    start()
  }
}

function send() {
  const text = (finalText.value || inputText.value).trim()
  if (!text) return
  if (isListening.value) stop()
  emit('submit', text)
  inputText.value = ''
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function runDiagnostics() {
  diagnosing.value = true
  await diagnose()
  diagnosing.value = false
}
</script>

<template>
  <div class="voice-input flex align-items-center gap-2">
    <Button
      :icon="isListening ? 'pi pi-stop-circle' : 'pi pi-microphone'"
      :class="['mic-btn', { 'p-button-danger p-button-outlined': isListening }]"
      :severity="isListening ? 'danger' : 'secondary'"
      :disabled="!isSupported"
      @click="toggleMic"
      v-tooltip.top="isListening ? 'Остановить запись' : 'Голосовой ввод'"
    />
    <InputText
      v-model="inputText"
      class="flex-1"
      :placeholder="isListening ? 'Говорите...' : 'Введите запрос...'"
      @keydown="onKeydown"
    />
    <Button
      icon="pi pi-send"
      severity="primary"
      :disabled="!inputText.trim()"
      @click="send"
    />
  </div>

  <div v-if="error" class="flex flex-wrap align-items-center gap-2 mt-1">
    <small class="p-error">{{ error }}</small>
    <Button icon="pi pi-refresh" label="Повторить" size="small" severity="danger" text @click="retry" />
    <Button icon="pi pi-wrench" label="Диагностика" size="small" severity="secondary" text :loading="diagnosing" @click="runDiagnostics" />
    <a href="chrome://speech-internals" target="_blank" class="text-xs ml-2" style="color:var(--text-color-secondary)">
      chrome://speech-internals
    </a>
  </div>

  <div v-if="diagnosticInfo" class="mt-2 surface-200 border-round p-2 text-xs" style="white-space:pre-line">
    <div v-for="(line, i) in diagnosticInfo" :key="i" class="py-1">{{ line }}</div>
  </div>

  <small v-if="!isSupported" class="text-color-secondary block mt-1">
    Голосовой ввод не поддерживается в этом браузере
  </small>
</template>

<style scoped>
.voice-input {
  width: 100%;
}
.mic-btn {
  flex-shrink: 0;
}
a:hover {
  text-decoration: underline;
}
</style>
