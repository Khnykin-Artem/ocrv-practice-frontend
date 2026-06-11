<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const sidebarVisible = ref(false)
</script>

<template>
  <Card class="layout8 mb-4 border-none shadow-4 overflow-hidden anim-slide card-hover card-border">
    <template #header>
      <div v-if="news.videoUrl" class="relative">
        <video :src="news.videoUrl" controls class="w-full block anim-scale anim-delay-1" style="max-height:420px; object-fit:cover" />
        <div class="absolute top-2 left-2 flex gap-1 anim-fade anim-delay-2">
          <Tag value="Прямой эфир" severity="danger" rounded>
            <template #icon><i class="pi pi-circle-fill mr-1" style="font-size:8px" /></template>
          </Tag>
          <Tag value="Эксклюзив" severity="warn" rounded />
        </div>
      </div>
      <div v-else-if="news.imageUrl" class="relative">
        <Image :src="news.imageUrl" alt="cover" width="100%" style="max-height:420px; object-fit:cover" preview />
      </div>
    </template>
    <template #content>
      <div class="flex align-items-start gap-3 p-4">
        <Avatar icon="pi pi-video" shape="circle" size="xlarge" style="background:var(--red-500); color:white" class="anim-left anim-delay-3" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold m-0 mb-2 anim-left anim-delay-4">{{ news.title }}</h2>
          <p class="line-height-3 text-color-secondary m-0 anim-slide anim-delay-5">{{ news.text }}</p>
        </div>
      </div>
      <Divider />
      <Toolbar class="border-none p-0 anim-fade anim-delay-4" style="background:transparent">
        <template #start>
          <div class="flex gap-2 flex-wrap">
            <Chip :label="news.date" icon="pi pi-calendar" />
            <Chip label="12:34" icon="pi pi-clock" />
          </div>
        </template>
        <template #end>
          <Button label="Смотреть" icon="pi pi-play" severity="danger" class="mr-1" />
          <Button icon="pi pi-bars" rounded text severity="secondary" @click="sidebarVisible = true" />
        </template>
      </Toolbar>
    </template>
  </Card>
  <Sidebar v-model:visible="sidebarVisible" header="Меню выпуска" position="right">
    <PanelMenu :model="[{ label: 'Главное', icon: 'pi pi-star-fill' }, { label: 'Видео', icon: 'pi pi-video' }, { label: 'Интервью', icon: 'pi pi-comment' }]" class="w-full border-none" />
  </Sidebar>
</template>
