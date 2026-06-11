<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const dummy = ref(false)
</script>

<template>
  <Card class="layout1 mb-4 overflow-hidden border-none shadow-4 anim-slide card-hover card-border">
    <template #header>
      <div class="relative">
        <Image
          v-if="news.imageUrl"
          :src="news.imageUrl"
          alt="hero"
          class="w-full block anim-scale anim-delay-1"
          style="max-height:460px; object-fit:cover; width:100%"
          preview
        />
        <div
          class="absolute bottom-0 left-0 right-0 p-4"
          style="background: linear-gradient(transparent 20%, rgba(0,0,0,0.9))"
        >
          <div class="flex gap-1 mb-2 flex-wrap anim-fade anim-delay-2">
            <Tag value="Спорт" severity="success" rounded />
            <Tag v-if="news.score" :value="'Счёт: ' + news.score" severity="warn" rounded />
            <Tag :value="news.date" severity="info" rounded />
          </div>
          <h2 class="text-white text-3xl font-bold m-0 line-height-2 anim-left anim-delay-3">{{ news.title }}</h2>
        </div>
      </div>
    </template>
    <template #content>
      <div class="p-4">
      <div class="flex align-items-center gap-2 mb-3 anim-slide anim-delay-4">
        <Avatar icon="pi pi-user" size="large" class="mr-1" style="background:var(--green-500); color:white" />
        <div>
          <span class="font-semibold text-sm">Александр Смирнов</span>
          <div class="flex align-items-center gap-1 text-xs text-color-secondary">
            <i class="pi pi-clock" />
            <span>{{ news.date }}</span>
            <Chip v-if="news.score" :label="news.score" class="text-xs" />
          </div>
        </div>
        <div class="ml-auto flex gap-1 anim-right anim-delay-5">
          <Button icon="pi pi-heart" rounded text severity="secondary" v-tooltip.top="'Сохранить'" />
          <Button icon="pi pi-share-alt" rounded text severity="secondary" v-tooltip.top="'Поделиться'" />
        </div>
      </div>

      <p class="line-height-3 m-0 mb-3 anim-fade anim-delay-2">{{ news.text }}</p>

      <Panel header="Статистика матча" toggleable collapsed class="anim-scale anim-delay-3">
        <div class="grid text-center">
          <div class="col-4">
            <span class="text-xs text-color-secondary block">Владение</span>
            <span class="text-xl font-bold">58%</span>
            <ProgressBar :value="58" class="mt-1" style="height:6px" />
          </div>
          <div class="col-4">
            <span class="text-xs text-color-secondary block">Удары</span>
            <span class="text-xl font-bold">14</span>
            <ProgressBar :value="70" class="mt-1" style="height:6px" />
          </div>
          <div class="col-4">
            <span class="text-xs text-color-secondary block">Фолы</span>
            <span class="text-xl font-bold">12</span>
            <ProgressBar :value="48" class="mt-1" style="height:6px" />
          </div>
        </div>
      </Panel>

      <Divider />
      <div class="flex gap-2 flex-wrap align-items-center">
        <Chip label="Чемпионат мира" icon="pi pi-globe" />
        <Chip label="Футбол" icon="pi pi-star-fill" />
        <ToggleSwitch v-model="dummy" disabled class="ml-auto" />
      </div>
      </div>
    </template>
  </Card>
</template>
