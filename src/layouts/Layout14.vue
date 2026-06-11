<script setup>
import Chart from 'primevue/chart'
defineProps({
  news: { type: Object, required: true }
})
</script>

<template>
  <Card class="layout14 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #title>
      <div class="flex align-items-center gap-2 anim-fade anim-delay-1">
        <Tag value="Чистый формат" severity="secondary" rounded />
        <Chip :label="news.date" icon="pi pi-calendar" class="ml-auto" />
      </div>
    </template>
    <template #content>
      <div class="p-4">
      <h2 class="text-3xl font-bold mb-3 line-height-2 anim-left anim-delay-2" style="color:var(--primary-color)">
        {{ news.title }}
      </h2>
      <Divider />
      <p class="text-xl line-height-3 m-0 text-color-secondary mb-3 anim-slide anim-delay-3">{{ news.text }}</p>
      <Chart v-if="news.chart" :type="news.chart.type" :data="news.chart.data" :options="news.chart.options" class="mb-3 anim-scale anim-delay-4" style="height:250px" />
      <div class="grid mb-3 anim-fade anim-delay-4">
        <div class="col-6">
          <Listbox :model-value="null" :options="['Быстрый просмотр', 'Без рекламы', 'Крупный шрифт']" class="border-none p-0" />
        </div>
        <div class="col-6">
          <Tree :model-value="null" :nodes="[{ key: '0', label: 'Режимы', children: [{ key: '0-0', label: 'Тёмная тема' }, { key: '0-1', label: 'Сепия' }] }]" class="border-none p-0" />
        </div>
      </div>
      <Divider />
      <div class="flex justify-content-between align-items-center anim-right anim-delay-5">
        <div class="flex gap-1">
          <Button icon="pi pi-heart" rounded text severity="secondary" />
          <Button icon="pi pi-bookmark" rounded text severity="secondary" />
          <Button icon="pi pi-flag" rounded text severity="secondary" />
        </div>
        <Button label="Читать" icon="pi pi-arrow-right" severity="secondary" />
      </div>
      </div>
    </template>
  </Card>
</template>
