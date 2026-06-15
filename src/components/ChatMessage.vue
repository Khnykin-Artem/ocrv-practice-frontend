<script setup>
defineProps({
  message: { type: Object, required: true }
})
</script>

<template>
  <div :class="['chat-message flex', message.role === 'user' ? 'justify-content-end' : 'justify-content-start']">
    <div
      :class="[
        'message-bubble p-3 border-round-xl',
        message.role === 'user'
          ? 'bg-primary text-white'
          : 'surface-200 text-color'
      ]"
      style="max-width: 80%"
    >
      <div class="text-sm" v-if="message.role === 'assistant' && message.text === '…'">
        <ProgressSpinner style="width:20px;height:20px" />
        <span class="ml-2">Думаю...</span>
      </div>
      <div v-else class="text-sm">{{ message.text }}</div>
      <div v-if="message.role === 'user'" class="text-xs text-white-alpha-60 mt-1">
        {{ message.timestamp }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  margin-bottom: 0.75rem;
}
.message-bubble {
  line-height: 1.5;
  animation: fadeSlide 0.3s ease both;
}
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
