<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const showDialog = ref(false)
</script>

<template>
  <Card class="layout12 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <div class="flex align-items-center gap-2 flex-wrap mb-2 anim-fade anim-delay-1">
        <Chip :label="news.date" icon="pi pi-calendar" />
        <Tag value="Срочно" severity="danger" rounded />
        <Rating v-if="news.rating" :model-value="news.rating" :stars="5" readonly class="ml-auto" />
      </div>
      <h2 class="text-2xl font-bold m-0 mb-3 line-height-2 anim-left anim-delay-2">{{ news.title }}</h2>
      <div class="grid">
        <div class="col-12 md:col-5 mb-3 md:mb-0">
          <Image
            v-if="news.imageUrl"
            :src="news.imageUrl"
            alt="news"
            width="100%"
            preview
            class="border-round-lg anim-scale anim-delay-3"
          />
        </div>
        <div class="col-12 md:col-7 flex flex-column">
          <ScrollPanel style="max-height:180px" class="flex-1 mb-2">
            <p class="m-0 line-height-3 anim-slide anim-delay-4">{{ news.text }}</p>
          </ScrollPanel>
          <Divider class="my-2" />
          <div v-if="news.chart" class="mb-2">
            <Chart :type="news.chart.type" :data="news.chart.data" :options="news.chart.options" style="max-height:200px" />
          </div>
          <div class="flex align-items-center gap-2 flex-wrap anim-fade anim-delay-5">
            <Avatar icon="pi pi-user" shape="circle" size="large" style="background:var(--red-500); color:white" />
            <div class="flex flex-column">
              <span class="text-sm font-semibold">Корреспондент</span>
              <div class="text-xs text-color-secondary">{{ news.date }}</div>
            </div>
            <Button label="Подробнее" icon="pi pi-arrow-right" severity="info" class="ml-auto" rounded @click="showDialog = true" />
          </div>
        </div>
      </div>
      </div>
    </template>
  </Card>
  <Dialog v-model:visible="showDialog" header="Полный текст" :modal="true" :style="{ width: '40rem' }">
    <p class="line-height-3 m-0">{{ news.text }}</p>
    <p class="line-height-3 mt-2 text-color-secondary">Париж. Организаторы заявили, что это крупнейшая выставка за последние 50 лет. Мероприятие продлится до 30 августа.</p>
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="showDialog = false" text />
      <Button label="Читать" icon="pi pi-arrow-right" @click="showDialog = false" />
    </template>
  </Dialog>
</template>
