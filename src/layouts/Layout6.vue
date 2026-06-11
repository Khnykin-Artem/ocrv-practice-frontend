<script setup>
defineProps({
  news: { type: Object, required: true }
})
</script>

<template>
  <Card class="layout6 mb-4 border-none shadow-4 anim-slide card-hover card-border">
    <template #content>
      <div class="p-4">
      <div class="flex align-items-center gap-2 mb-2 flex-wrap anim-fade anim-delay-1">
        <Tag value="Здоровье" severity="success" rounded />
        <Tag :value="news.date" severity="info" rounded />
        <Chip label="Советы экспертов" icon="pi pi-star" class="ml-auto" />
      </div>
      <h2 class="text-2xl font-bold m-0 mb-3 line-height-2 anim-left anim-delay-2">{{ news.title }}</h2>

      <Knob v-if="news.tips" :model-value="news.tips.length * 20" :max="100" :value-color="'var(--green-500)'" size="80" class="float-right ml-2 anim-scale anim-delay-3" />

      <div v-if="news.tips && news.tips.length" class="mb-3 anim-slide anim-delay-4">
        <div v-for="(tip, i) in news.tips" :key="i" class="flex align-items-start gap-2 p-2 border-bottom-1 surface-border">
          <Badge :value="i + 1" severity="success" />
          <p class="m-0 line-height-3 flex-1">{{ tip }}</p>
          <Checkbox :binary="true" disabled />
        </div>
      </div>

      <div v-else>
        <ScrollPanel style="max-height:180px" class="surface-50 p-3 border-round mb-3">
          <p class="m-0 line-height-3">{{ news.text }}</p>
        </ScrollPanel>
      </div>

      <Divider />
      <Toolbar class="border-none p-0 anim-fade anim-delay-5" style="background:transparent">
        <template #start>
          <div class="flex gap-1">
            <Button icon="pi pi-thumbs-up" rounded text severity="secondary" />
            <Button icon="pi pi-comment" rounded text severity="secondary" />
            <Button icon="pi pi-share-alt" rounded text severity="secondary" />
          </div>
        </template>
        <template #end>
          <SelectButton :model-value="'ru'" :options="['ru', 'en', 'de']" disabled />
        </template>
      </Toolbar>
      </div>
    </template>
  </Card>
</template>
