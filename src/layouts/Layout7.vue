<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const liked = ref(false)
</script>

<template>
  <Card class="layout7 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="grid p-4 m-0">
      <div class="col-12 md:col-5 p-0">
        <Image
          v-if="news.imageUrl"
          :src="news.imageUrl"
          alt="preview"
          class="w-full block h-full anim-scale anim-delay-1"
          style="min-height:300px; object-fit:cover; border-radius:12px 0 0 12px"
          preview
        />
      </div>
      <div class="col-12 md:col-7 p-4 flex flex-column">
        <div class="flex gap-1 mb-2 flex-wrap anim-fade anim-delay-2">
          <Badge value="Технологии" severity="info" />
          <Tag :value="news.date" severity="secondary" rounded />
        </div>
        <h2 class="text-xl font-bold m-0 mb-2 line-height-2 anim-left anim-delay-3">{{ news.title }}</h2>
        <p class="line-height-3 text-color-secondary m-0 mb-3 anim-slide anim-delay-4">{{ news.text }}</p>

        <DataTable v-if="news.specs" :value="Object.entries(news.specs).map(([k,v]) => ({ key: k, value: v }))" class="mb-3 text-sm anim-fade anim-delay-5" striped-rows>
          <Column field="key" header="Параметр" />
          <Column field="value" header="Значение" />
        </DataTable>

        <Chart v-if="news.chart" :type="news.chart.type" :data="news.chart.data" :options="news.chart.options" class="mb-3" style="max-height:220px" />

        <Divider class="my-2" />
        <div class="flex align-items-center gap-2 mt-auto">
          <Avatar icon="pi pi-microchip" shape="circle" size="large" style="background:var(--indigo-600); color:white" />
          <div class="flex flex-column">
            <span class="text-sm font-semibold">Tech-редактор</span>
            <span class="text-xs text-color-secondary">{{ news.date }}</span>
          </div>
          <div class="ml-auto flex gap-1">
            <ToggleButton v-model="liked" on-label="" off-label="" on-icon="pi pi-heart-fill" off-icon="pi pi-heart" />
            <Button icon="pi pi-arrow-right" rounded severity="info" />
          </div>
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>
