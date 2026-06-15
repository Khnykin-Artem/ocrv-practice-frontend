<script setup>
import { ref, nextTick, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import VoiceInput from './VoiceInput.vue'

const messages = ref([])
const scrollRef = ref(null)

function addMessage(role, text) {
  messages.value.push({
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.$el?.scrollTo?.({ top: scrollRef.value.$el.scrollHeight, behavior: 'smooth' })
    }
  })
}

function handleSubmit(text) {
  addMessage('user', text)
  addMessage('assistant', '…')

  setTimeout(() => {
    const last = messages.value[messages.value.length - 1]
    if (last && last.text === '…') {
      last.text = `Нашёл 3 новости по запросу «${text}». Бекенд пока не готов 🤖`
    }
    scrollToBottom()
  }, 1200)
}

addMessage('assistant', 'Привет! Я AI-помощник по новостям. Скажи или напиши, что тебя интересует.')
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

    <ScrollPanel ref="scrollRef" class="flex-1" style="min-height:0">
      <div class="pr-2">
        <ChatMessage v-for="msg in messages" :key="msg.id" :message="msg" />
      </div>
    </ScrollPanel>

    <div class="pt-3" style="border-top:1px solid var(--surface-border)">
      <VoiceInput @submit="handleSubmit" />
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  height: 100%;
  min-height: 500px;
}
</style>
