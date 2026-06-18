<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'

const props = defineProps({
  block: { type: Object, required: true }
})

const chartData = computed(() => {
  const d = props.block.data
  if (props.block.type !== 'chart' || !d) return null
  return {
    labels: d.labels || [],
    datasets: [{
      label: d.title || '',
      data: d.values || [],
      backgroundColor: [
        'rgba(99,102,241,0.7)', 'rgba(59,130,246,0.7)',
        'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)',
        'rgba(239,68,68,0.7)', 'rgba(168,85,247,0.7)',
      ],
      borderColor: [
        '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7',
      ],
      borderWidth: 1,
    }]
  }
})

const chartOptions = computed(() => {
  const d = props.block.data
  if (!d) return {}
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }
})
</script>

<template>
  <div class="response-block mb-2">
    <template v-if="block.type === 'header'">
      <div class="font-bold text-lg mb-1">{{ block.data.text }}</div>
    </template>

    <template v-else-if="block.type === 'text'">
      <div class="font-semibold text-base">{{ block.data.title }}</div>
      <div class="text-sm text-color-secondary mt-1">{{ block.data.content }}</div>
      <Chip v-if="block.data.source" :label="block.data.source" class="mt-2" />
    </template>

    <template v-else-if="block.type === 'chart'">
      <div class="font-semibold text-sm mb-2">{{ block.data.title || '' }}</div>
      <div style="height:200px">
        <Chart v-if="chartData" type="bar" :data="chartData" :options="chartOptions" />
      </div>
    </template>

    <template v-else-if="block.type === 'facts'">
      <div class="grid">
        <div v-for="(item, i) in block.data.items" :key="i" class="col-6 md:col-4 mb-2">
          <div class="surface-200 border-round p-2 text-center">
            <div class="font-bold text-primary text-xl">{{ item.value }}</div>
            <div class="text-xs text-color-secondary">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="block.type === 'sources'">
      <div class="flex flex-wrap gap-1">
        <Chip v-for="(src, i) in block.data.items" :key="i" :label="src" />
      </div>
    </template>
  </div>
</template>
