<script setup>
defineProps({
  news: { type: Object, required: true }
})
const half = (s) => Math.round((s || '').length / 2)
</script>

<template>
  <Card class="layout11 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <div class="flex align-items-center gap-2 mb-2 anim-left anim-delay-1">
        <Avatar icon="pi pi-pencil" shape="circle" size="large" style="background:var(--purple-500); color:white" />
        <h2 class="text-xl font-bold m-0 flex-1">{{ news.title }}</h2>
        <Tag value="Репортаж" severity="info" rounded class="anim-fade anim-delay-2" />
      </div>
      <Message severity="warn" :closable="false" class="mb-3 text-sm anim-slide anim-delay-3">{{ news.date }} — место событий</Message>
      <p class="line-height-3 m-0 anim-fade anim-delay-4">{{ news.text.slice(0, half(news.text)) }}</p>
      <Panel class="my-3 border-none anim-scale anim-delay-5" style="background:var(--surface-50)">
        <blockquote class="text-xl font-italic m-0 p-2 line-height-3" style="color:var(--primary-color); border-left:4px solid var(--primary-color)">
          "{{ news.text.slice(half(news.text)) }}"
        </blockquote>
      </Panel>
      <video
        v-if="news.videoUrl"
        :src="news.videoUrl"
        controls
        class="w-full border-round-lg mb-2 anim-scale"
        style="max-height:240px"
      />
      <div class="flex align-items-center gap-2 mt-2 anim-fade anim-delay-4">
        <Button label="Читать полностью" icon="pi pi-arrow-right" severity="help" />
        <Button icon="pi pi-tag" rounded text severity="secondary" />
        <Button icon="pi pi-print" rounded text severity="secondary" class="ml-auto" />
      </div>
      </div>
    </template>
  </Card>
</template>
