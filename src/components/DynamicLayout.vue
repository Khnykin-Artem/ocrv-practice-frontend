<script setup>
import { ref, onMounted } from 'vue'
import { predictLayout } from '../utils/aiClassifier'
import layoutDescriptions from '../layouts/layoutDescriptions'
import Layout1 from '../layouts/Layout1.vue'
import Layout2 from '../layouts/Layout2.vue'
import Layout3 from '../layouts/Layout3.vue'
import Layout4 from '../layouts/Layout4.vue'
import Layout5 from '../layouts/Layout5.vue'
import Layout6 from '../layouts/Layout6.vue'
import Layout7 from '../layouts/Layout7.vue'
import Layout8 from '../layouts/Layout8.vue'
import Layout9 from '../layouts/Layout9.vue'
import Layout10 from '../layouts/Layout10.vue'
import Layout11 from '../layouts/Layout11.vue'
import Layout12 from '../layouts/Layout12.vue'
import Layout13 from '../layouts/Layout13.vue'
import Layout14 from '../layouts/Layout14.vue'
import Layout15 from '../layouts/Layout15.vue'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  news: { type: Object, required: true }
})

const layouts = [
  Layout1, Layout2, Layout3, Layout4, Layout5,
  Layout6, Layout7, Layout8, Layout9, Layout10,
  Layout11, Layout12, Layout13, Layout14, Layout15
]

const bestIndex = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const idx = await predictLayout(props.news, layoutDescriptions)
    bestIndex.value = idx
  } catch (e) {
    errorMsg.value = e.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dynamic-layout">
    <div v-if="loading" class="flex justify-content-center p-4">
      <ProgressSpinner />
      <p class="ml-2">AI загружает модель и подбирает макет...</p>
    </div>
    <div v-else-if="errorMsg" class="p-3 surface-200 border-round text-center">
      <p class="text-red-600 font-semibold">Ошибка AI:</p>
      <p class="text-sm text-color-secondary">{{ errorMsg }}</p>
    </div>
    <div v-else-if="bestIndex !== null" class="relative anim-scale">
      <Tag :value="'Макет ' + (bestIndex + 1)" severity="info" rounded class="absolute top-0 right-0 z-5" style="margin:-8px -4px" />
      <component :is="layouts[bestIndex]" :news="news" />
    </div>
  </div>
</template>
