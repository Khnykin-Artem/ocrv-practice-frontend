<script setup>
defineProps({
  news: { type: Object, required: true }
})
</script>

<template>
  <Card class="layout15 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="grid p-4 m-0 align-items-stretch">
      <div class="col-12 md:col-4 p-0">
        <Image
          v-if="news.imageUrl"
          :src="news.imageUrl"
          alt="card"
          class="w-full block h-full anim-scale anim-delay-1"
          style="min-height:220px; object-fit:cover; border-radius:12px 0 0 12px"
          preview
        />
      </div>
      <div class="col-12 md:col-8 p-4 flex flex-column">
        <Tag value="Выбор шефа" severity="warn" rounded class="anim-fade anim-delay-1" />
        <Tag v-if="news.cookTime" :value="news.cookTime" severity="info" rounded class="ml-1 anim-fade anim-delay-1" />
        <h2 class="text-xl font-bold m-0 mb-2 mt-2 anim-left anim-delay-2">{{ news.title }}</h2>
        <p class="m-0 line-height-3 text-color-secondary text-sm mb-2 anim-slide anim-delay-3">{{ news.text.slice(0, 200) }}</p>
        <div v-if="news.ingredients && news.ingredients.length" class="mb-2 anim-fade anim-delay-4">
          <div class="flex gap-1 flex-wrap">
            <Chip v-for="(ing, i) in news.ingredients.slice(0, 6)" :key="i" :label="ing" class="text-xs" />
          </div>
        </div>
        <div v-if="news.nutrition" class="flex gap-3 text-xs text-color-secondary mb-2 anim-fade anim-delay-4">
          <span v-for="(val, key) in news.nutrition" :key="key">{{ key }}: {{ val }}</span>
        </div>
        <div v-if="news.chart" class="mb-2">
          <Chart :type="news.chart.type" :data="news.chart.data" :options="news.chart.options" style="max-height:180px" />
        </div>
        <div class="flex align-items-center gap-2 mt-auto pt-2 anim-right anim-delay-5">
          <Avatar icon="pi pi-star" shape="circle" size="large" style="background:var(--orange-700); color:white" />
          <span class="text-xs text-color-secondary">{{ news.date }}</span>
          <span class="flex-1" />
          <Button icon="pi pi-heart" rounded text severity="secondary" size="small" />
          <Button icon="pi pi-share-alt" rounded text severity="secondary" size="small" />
          <Button icon="pi pi-arrow-right" rounded severity="warn" size="small" />
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>
