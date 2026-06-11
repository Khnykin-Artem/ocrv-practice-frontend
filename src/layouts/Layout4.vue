<script setup>
import { ref } from 'vue'
defineProps({
  news: { type: Object, required: true }
})
const liked = ref(false)
</script>

<template>
  <Card class="layout4 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="grid p-4">
        <div class="col-12 md:col-8">
          <Fieldset legend="Мнение эксперта" toggleable class="anim-left anim-delay-1">
            <blockquote class="text-2xl font-italic line-height-3 m-0 p-2" style="color:var(--primary-color); border-left:4px solid var(--primary-color)">
              "{{ news.quote || news.text }}"
            </blockquote>
          </Fieldset>
          <div class="flex align-items-center gap-2 mt-3 anim-fade anim-delay-3">
            <ToggleButton v-model="liked" on-label="Нравится" off-label="Нравится" on-icon="pi pi-heart-fill" off-icon="pi pi-heart" class="mr-2" />
            <Button label="Поделиться" icon="pi pi-share-alt" size="small" text />
          </div>
        </div>
        <div class="col-12 md:col-4 flex flex-column align-items-center justify-content-start pt-3">
          <Image
            v-if="news.imageUrl"
            :src="news.imageUrl"
            alt="expert"
            width="130"
            height="130"
            preview
            class="border-circle mb-2 anim-scale anim-delay-2"
            style="border-radius:50%"
          />
          <h3 class="text-lg font-bold mb-1 text-center anim-fade anim-delay-3">{{ news.title }}</h3>
          <Tag value="Эксперт" severity="info" rounded class="anim-fade anim-delay-4" />
          <Skeleton v-if="!news.quote" width="80%" height="12px" class="mt-2" />
          <small v-if="news.source" class="mt-2 text-color-secondary">{{ news.source }}</small>
        </div>
      </div>
    </template>
  </Card>
</template>
