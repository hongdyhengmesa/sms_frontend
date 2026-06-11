<template>
  <div class="card card-shadow card-hover p-6 relative overflow-hidden cursor-default">
    <!-- Background accent -->
    <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.07]" :style="{ background: accent }"></div>

    <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4" :style="{ background: bgLight }">
      <component :is="icon" class="w-5 h-5" :style="{ color: accent }" />
    </div>
    <p class="text-3xl font-extrabold text-gray-900 leading-none mb-1">{{ value }}</p>
    <p class="text-sm text-gray-500 font-medium mb-3">{{ label }}</p>
    <p class="text-xs font-semibold flex items-center gap-1" :class="trendUp ? 'text-green-600' : 'text-red-500'">
      <span>{{ trendUp ? '↑' : '↓' }}</span>
      {{ trend }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  value: [String, Number],
  label: String,
  trend: String,
  trendUp: { type: Boolean, default: true },
  accent: { type: String, default: '#6366f1' },
  bgLight: { type: String, default: '#eef2ff' },
})
</script>
