<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const op = ref()
</script>

<template>
  <Card class="layout9 mb-4 border-none shadow-4 overflow-hidden anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <div v-if="news.imageUrl" class="relative" style="height:460px; overflow:hidden">
        <Image
          :src="news.imageUrl"
          alt="hero"
          width="100%"
          class="w-full h-full block anim-scale anim-delay-1"
          style="object-fit:cover; border-radius:0"
          preview
        />
        <div
          class="absolute bottom-0 left-0 right-0 p-5 flex flex-column justify-content-end"
          style="background: linear-gradient(transparent 10%, rgba(0,0,0,0.92) 80%); min-height:100%"
        >
          <div class="flex gap-1 mb-2 flex-wrap anim-fade anim-delay-2">
            <Tag value="История" severity="success" rounded />
            <Tag v-if="news.location" :value="news.location" severity="info" rounded />
          </div>
          <h2 class="text-white text-3xl font-bold m-0 mb-2 line-height-2 anim-left anim-delay-3">{{ news.title }}</h2>
          <p class="text-white-alpha-80 line-height-3 m-0 mb-3 anim-slide anim-delay-4" style="max-width:70%">
            {{ (news.text || '').slice(0, 180) }}...
          </p>
          <div class="flex gap-2 align-items-center anim-fade anim-delay-5">
            <Button label="Читать далее" icon="pi pi-arrow-right" severity="help" @click="op.toggle" />
            <Button icon="pi pi-heart-fill" rounded text class="text-white" />
            <span class="text-white-alpha-60 text-sm ml-auto">
              <i class="pi pi-calendar mr-1" />{{ news.date }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="p-5 text-center" style="background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); border-radius:12px">
        <Tag value="История" severity="success" rounded class="mb-3" />
        <h2 class="text-white text-3xl font-bold m-0 mb-2 line-height-2">{{ news.title }}</h2>
        <p class="text-white-alpha-80 line-height-3 m-0 mb-4" style="max-width:600px; margin:0 auto">
          {{ (news.text || '').slice(0, 250) }}
        </p>
        <div class="flex gap-2 justify-content-center align-items-center">
          <Button label="Читать далее" icon="pi pi-arrow-right" severity="help" />
          <span class="text-white-alpha-60 text-sm">
            <i class="pi pi-calendar mr-1" />{{ news.date }}
          </span>
        </div>
      </div>
      <OverlayPanel ref="op">
        <p class="m-0" style="max-width:300px">{{ news.text }}</p>
      </OverlayPanel>
      </div>
    </template>
  </Card>
</template>
