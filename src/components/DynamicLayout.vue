<script setup>
import ProgressSpinner from 'primevue/progressspinner'
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

const props = defineProps({
  news: { type: Object, required: true },
  bestIndex: { type: Number, default: null }
})

const layouts = [
  Layout1, Layout2, Layout3, Layout4, Layout5,
  Layout6, Layout7, Layout8, Layout9, Layout10,
  Layout11, Layout12, Layout13, Layout14, Layout15
]
</script>

<template>
  <div class="dynamic-layout">
    <div v-if="bestIndex === null" class="flex justify-content-center p-4">
      <ProgressSpinner />
      <p class="ml-2">AI загружает модель и подбирает макет...</p>
    </div>
    <div v-else class="relative anim-scale">
      <Tag :value="'Макет ' + (bestIndex + 1)" severity="info" rounded class="absolute top-0 right-0 z-5" style="margin:-8px -4px" />
      <component :is="layouts[bestIndex]" :news="news" />
    </div>
  </div>
</template>
