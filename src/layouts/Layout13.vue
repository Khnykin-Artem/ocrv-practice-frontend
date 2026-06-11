<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const notify = ref(false)
</script>

<template>
  <Card class="layout13 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <TabView class="anim-fade anim-delay-1">
        <TabPanel header="Фото">
          <Image
            v-if="news.imageUrl"
            :src="news.imageUrl"
            alt="tab"
            class="w-full"
            preview
            style="max-height:300px; object-fit:cover"
          />
        </TabPanel>
        <TabPanel header="Текст">
          <ScrollPanel style="max-height:200px">
            <p class="line-height-3 m-0">{{ news.text }}</p>
          </ScrollPanel>
        </TabPanel>
        <TabPanel v-if="news.videoUrl" header="Видео">
          <video :src="news.videoUrl" controls class="w-full" style="max-height:300px" />
        </TabPanel>
        <TabPanel v-if="news.quote" header="Цитата">
          <blockquote class="text-xl font-italic line-height-3 m-0 p-3 surface-50 border-round">
            "{{ news.quote }}"
          </blockquote>
        </TabPanel>
      </TabView>

      <Divider />
      <div class="flex justify-content-center gap-2 flex-wrap anim-slide anim-delay-3">
        <Chip :label="news.date" icon="pi pi-calendar" />
        <Button label="Сохранить" icon="pi pi-download" size="small" outlined severity="secondary" />
        <InputSwitch v-model="notify" disabled />
        <span class="text-xs text-color-secondary align-self-center">Уведомления</span>
      </div>
      </div>
    </template>
  </Card>
</template>
