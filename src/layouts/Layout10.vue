<script setup>
defineProps({
  news: { type: Object, required: true }
})
</script>

<template>
  <Card class="layout10 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="grid p-4 m-0">
      <div class="col-12 md:col-4 p-4 flex align-items-center">
        <div>
          <Tag value="Мнение" severity="info" rounded class="mb-2 anim-fade anim-delay-1" />
          <h2 class="text-4xl font-bold line-height-2 m-0 anim-left anim-delay-2" style="color:var(--primary-color)">
            {{ news.title }}
          </h2>
          <Divider class="my-3" />
          <div class="flex align-items-center gap-2 mb-2 anim-fade anim-delay-3">
            <Avatar v-if="news.author" :label="news.author[0]" shape="circle" size="large" style="background:var(--purple-700); color:white" />
            <Avatar v-else icon="pi pi-user" shape="circle" size="large" style="background:var(--purple-700); color:white" />
            <div>
              <span class="text-sm font-semibold">{{ news.author || 'Колумнист' }}</span>
              <div class="text-xs text-color-secondary">{{ news.date }}</div>
            </div>
          </div>
          <Button label="Подписаться" icon="pi pi-bell" size="small" severity="secondary" outlined class="anim-right anim-delay-4" />
        </div>
      </div>
      <div class="col-12 md:col-8 p-0">
        <Image
          v-if="news.imageUrl"
          :src="news.imageUrl"
          alt="column"
          class="w-full block anim-scale anim-delay-2"
          style="max-height:380px; object-fit:cover; border-radius:0 12px 12px 0"
          preview
        />
      </div>
      <div class="col-12 p-4 pt-0">
        <ScrollPanel style="max-height:140px" class="mb-3">
          <p class="line-height-3 m-0 text-lg anim-slide anim-delay-4">{{ news.text }}</p>
        </ScrollPanel>

        <DataView v-if="news.specs" :value="Object.entries(news.specs).map(([k,v], i) => ({ id: i, key: k, value: v }))" :layout="'grid'">
          <template #grid="slotProps">
            <div class="grid p-0 m-0">
              <div v-for="item in slotProps.items" :key="item.id" class="col-6 md:col-3 p-2 text-center">
                <div class="p-3 surface-50 border-round">
                  <div class="text-xl font-bold" style="color:var(--primary-color)">{{ item.value }}</div>
                  <div class="text-xs text-color-secondary">{{ item.key }}</div>
                </div>
              </div>
            </div>
          </template>
        </DataView>

        <div v-if="news.chart" class="mt-3">
          <Chart :type="news.chart.type" :data="news.chart.data" :options="news.chart.options" class="w-full" style="max-height:280px" />
        </div>

        <Divider />
        <div class="flex gap-2 anim-fade anim-delay-5">
          <Button label="Обсудить" icon="pi pi-comments" size="small" outlined severity="secondary" />
          <Button label="Поделиться" icon="pi pi-share-alt" size="small" outlined severity="secondary" />
          <SelectButton :model-value="'12'" :options="['10', '12', '14']" disabled class="ml-auto" />
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>
