<script setup>
import { ref, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import VoiceInput from './VoiceInput.vue'
import ResponseBlock from './ResponseBlock.vue'
import { useVoiceCommands } from '../composables/useVoiceCommands'
import { voiceQuery } from '../utils/api'
import ProgressSpinner from 'primevue/progressspinner'

const emit = defineEmits(['command'])

const messages = ref([])
const scrollRef = ref(null)
const loading = ref(false)
const recordingError = ref('')
const { matchCommand } = useVoiceCommands()

function addMessage(role, text, blocks) {
  messages.value = [...messages.value, {
    id: crypto.randomUUID(),
    role,
    text,
    blocks: blocks || null,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }]
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

async function handleVoiceSubmit(audio) {
  if (!audio) return
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
    addMessage('assistant', 'Не удалось обработать голосовой запрос. Бэкенд недоступен.')
  } finally {
    loading.value = false
  }
}

function handleError(msg) {
  recordingError.value = msg
}

addMessage('assistant', 'Привет! Я AI-помощник по новостям. Нажми на микрофон и задай вопрос голосом.')
</script>

<template>
  <div class="chat-panel flex flex-column h-full">
    <div class="flex align-items-center gap-2 pb-3 mb-3" style="border-bottom:1px solid var(--surface-border)">
      <Avatar icon="pi pi-comments" size="large" shape="circle" class="bg-primary text-white" />
      <div>
        <div class="font-semibold text-lg">AI News Assistant</div>
        <div class="text-xs text-color-secondary">Голосовой поиск новостей</div>
      </div>
    </div>

    <div ref="scrollRef" class="flex-1 overflow-y-auto" style="min-height:0">
      <div class="pr-2">
        <ChatMessage v-for="msg in messages" :key="msg.id" :message="msg" />
        <div v-for="msg in messages.filter(m => m.blocks)" :key="'blocks-' + msg.id">
          <ResponseBlock
            v-for="(block, i) in msg.blocks"
            :key="i"
            :block="block"
            class="ml-7 mb-2"
          />
        </div>
      </div>
    </div>

    <div class="pt-3" style="border-top:1px solid var(--surface-border)">
      <div v-if="loading" class="flex align-items-center gap-2 mb-2">
        <ProgressSpinner style="width:20px;height:20px" />
        <span class="text-sm text-color-secondary">Обработка голосового запроса...</span>
      </div>
      <VoiceInput @submit="handleVoiceSubmit" @error="handleError" />
      <small v-if="recordingError" class="p-error block mt-1">{{ recordingError }}</small>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  height: 100%;
  min-height: 500px;
}
</style>
