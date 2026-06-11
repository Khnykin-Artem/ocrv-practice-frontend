<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const activeAcc = ref('0')
</script>

<template>
  <Card class="layout2 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="grid p-4 m-0">
        <div v-if="news.videoUrl" class="col-12 md:col-7 p-0">
          <video
            :src="news.videoUrl"
            controls
            class="w-full block h-full anim-scale anim-delay-1"
            style="object-fit:cover; min-height:300px; border-radius:12px 0 0 12px"
          />
        </div>
        <div :class="news.videoUrl ? 'col-12 md:col-5' : 'col-12'" class="p-4 flex flex-column">
          <Tag value="Научное видео" severity="info" rounded class="mb-2 align-self-start anim-fade anim-delay-2" />
          <h2 class="text-xl font-bold m-0 mb-2 line-height-2 anim-left anim-delay-3">{{ news.title }}</h2>
          <p class="line-height-3 text-color-secondary m-0 mb-3 flex-1 anim-slide anim-delay-4">{{ news.text }}</p>
          <div class="flex align-items-center gap-2 mb-3">
            <Avatar icon="pi pi-user" shape="circle" size="large" style="background:var(--cyan-600); color:white" />
            <div>
              <span class="text-sm font-semibold">Научный редактор</span>
              <div class="flex align-items-center gap-1 text-xs text-color-secondary">
                <i class="pi pi-calendar" />
                {{ news.date }}
                <Chip :label="'5:23'" icon="pi pi-clock" class="text-xs" />
              </div>
            </div>
          </div>
          <Accordion v-model:value="activeAcc" class="mb-2 anim-fade anim-delay-5">
            <AccordionPanel value="0">
              <AccordionHeader>Транскрипт</AccordionHeader>
              <AccordionContent>
                <p class="text-sm line-height-3 m-0">{{ news.text }}</p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <Button label="Смотреть" icon="pi pi-play" severity="info" class="mt-auto anim-right" />
        </div>
      </div>
    </template>
  </Card>
</template>
