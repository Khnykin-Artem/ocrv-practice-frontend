<script setup>
defineProps({
  news: { type: Object, required: true }
})
</script>

<template>
  <Card class="layout3 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <div class="text-center mb-3">
        <Badge value="Политика" severity="danger" size="xlarge" class="mb-2 anim-fade anim-delay-1" />
        <h2 class="text-3xl font-bold m-0 line-height-2 anim-left anim-delay-2">{{ news.title }}</h2>
      </div>
      <Divider />
      <div class="grid">
        <div class="col-12 md:col-7">
          <ScrollPanel style="max-height:200px" class="mb-3">
            <p class="line-height-3 m-0 text-lg anim-slide anim-delay-3">{{ news.text }}</p>
          </ScrollPanel>
          <InlineMessage v-if="news.quote" severity="info" class="w-full mb-3 anim-scale anim-delay-4">
            <blockquote class="m-0 font-italic text-sm">«{{ news.quote }}»</blockquote>
          </InlineMessage>
          <Rating :model-value="4" :stars="5" readonly class="mb-2" />
          <span class="text-sm text-color-secondary ml-2">Оценка редакции</span>
        </div>
        <div class="col-12 md:col-5">
          <Image
            v-if="news.imageUrl"
            :src="news.imageUrl"
            alt="featured"
            width="100%"
            preview
            class="border-round-lg mb-2 anim-right anim-delay-3"
          />
          <div class="flex align-items-center gap-2">
            <i class="pi pi-map-marker text-color-secondary" />
            <span class="text-sm">{{ news.location || 'Москва' }}</span>
          </div>
        </div>
      </div>
      <Divider />
      <Toolbar class="border-none p-0 anim-fade anim-delay-5" style="background:transparent">
        <template #start>
          <div class="flex gap-2">
            <Button label="Читать" icon="pi pi-arrow-right" severity="danger" />
            <Button icon="pi pi-comment" rounded text severity="secondary" />
          </div>
        </template>
        <template #end>
          <SelectButton :model-value="'rus'" :options="['rus', 'eng']" disabled />
        </template>
      </Toolbar>
      </div>
    </template>
  </Card>
</template>
