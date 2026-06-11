<template>
  <div class="stat-card card card-shadow card-hover relative overflow-hidden cursor-default group">
    <!-- Background accent -->
    <div class="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 rounded-bl-full opacity-[0.07] transition-all duration-300 group-hover:scale-110" :style="{ background: accent }"></div>

    <div class="relative z-10">
      <!-- Icon Container -->
      <div class="stat-icon w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110" :style="{ background: bgLight }">
        <component :is="icon" class="stat-icon-svg w-4 h-4 md:w-5 md:h-5" :style="{ color: accent }" />
      </div>
      
      <!-- Value -->
      <p class="stat-value text-2xl md:text-3xl font-extrabold text-gray-900 leading-none mb-1 md:mb-1.5">
        {{ value }}
      </p>
      
      <!-- Label -->
      <p class="stat-label text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3">
        {{ label }}
      </p>
      
      <!-- Trend Indicator -->
      <p class="stat-trend text-[10px] md:text-xs font-semibold flex items-center gap-1" :class="trendUp ? 'text-green-600' : 'text-red-500'">
        <span class="trend-arrow transition-transform duration-300 group-hover:translate-x-0.5">
          {{ trendUp ? '↑' : '↓' }}
        </span>
        {{ trend }}
      </p>
    </div>
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

<style scoped>
.stat-card {
  background-color: white;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem;
}

@media (min-width: 768px) {
  .stat-card {
    padding: 1.5rem;
  }
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
}

.card-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  transition: all 0.3s ease;
}

.group:hover .stat-icon {
  transform: scale(1.05);
}

.stat-icon-svg {
  transition: all 0.2s ease;
}

.group:hover .stat-icon-svg {
  transform: scale(1.1);
}

.stat-value {
  letter-spacing: -0.02em;
}

.stat-label {
  font-weight: 500;
  line-height: 1.4;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
}

.trend-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 1.1em;
}

.group:hover .trend-arrow {
  transform: translateX(2px);
}

/* Optional: Add a subtle border on hover for better definition */
.stat-card:hover {
  border-color: transparent;
  box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.15);
}

/* Responsive text adjustments */
@media (max-width: 480px) {
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .stat-icon-svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>