<script setup>
import { ref } from 'vue'

const props = defineProps({
  news: { type: Object, required: true }
})

const images = ref(
  props.news.gallery && props.news.gallery.length
    ? props.news.gallery
    : props.news.imageUrl
      ? [props.news.imageUrl]
      : ['https://placehold.co/800x500/e91e63/f48fb1?text=Gallery']
)

const responsiveOptions = ref([
  { breakpoint: '1024px', numVisible: 2 },
  { breakpoint: '768px', numVisible: 1 }
])

const activeIndex = ref(0)
</script>

<template>
  <Card class="layout5 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <TabView :active-index="activeIndex" @update:active-index="activeIndex = $event" class="anim-scale anim-delay-1">
        <TabPanel header="Галерея">
          <Galleria
            :value="images"
            :responsive-options="responsiveOptions"
            :num-visible="Math.min(images.length, 3)"
            container-style="max-width:100%; border-radius:12px; overflow:hidden"
            :show-thumbnails="false"
            :show-indicators="images.length > 1"
            :auto-play="images.length > 1"
            :circular="images.length > 1"
          >
            <template #item="slotProps">
              <img :src="slotProps.item" style="width:100%; height:380px; object-fit:cover" />
            </template>
          </Galleria>
        </TabPanel>
        <TabPanel header="Карусель">
          <Carousel :value="images" :num-visible="1" :show-indicators="false" :circular="images.length > 1" :autoplay-interval="3000">
            <template #item="slotProps">
              <img :src="slotProps.item" style="width:100%; height:380px; object-fit:cover; border-radius:12px" />
            </template>
          </Carousel>
        </TabPanel>
      </TabView>

      <div class="mt-3 text-center">
        <Tag value="Фоторепортаж" severity="success" rounded class="mb-2 anim-fade anim-delay-2" />
        <h2 class="text-2xl font-bold m-0 anim-left anim-delay-3">{{ news.title }}</h2>
        <p class="line-height-3 text-color-secondary mt-2 anim-slide anim-delay-4">{{ news.text }}</p>
        <Rating v-if="news.rating" :model-value="news.rating" :stars="5" readonly class="mt-2 anim-fade anim-delay-5" />
        <div class="flex justify-content-center gap-2 mt-3">
          <Chip :label="images.length + ' фото'" icon="pi pi-images" />
          <Chip :label="news.date" icon="pi pi-calendar" />
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>
