<template>
  <div class="space-y-4 md:space-y-5">
    <!-- HEADER - Responsive -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          GPA Analytics
        </h2>
        <p class="text-xs md:text-sm text-gray-500 mt-0.5">
          Academic performance insights and trends
        </p>
      </div>

      <button
        @click="fetchAnalytics"
        :disabled="loading"
        class="px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 text-sm md:text-base"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </span>
        <span v-else>Refresh Analytics</span>
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm md:text-base">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Loading analytics...
      </div>
    </div>

    <!-- KPI CARDS - Responsive Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
      <StatCard
        :icon="ArrowTrendingUpIcon"
        :value="schoolAverage"
        label="School Avg GPA"
        trend="Connected from backend"
        accent="#2563eb"
        bgLight="#eff6ff"
      />
      <StatCard
        :icon="CheckCircleIcon"
        :value="passRate + '%'"
        label="Pass Rate"
        trend="Student pass performance"
        accent="#16a34a"
        bgLight="#f0fdf4"
      />
      <StatCard
        :icon="ClockIcon"
        value="94.2%"
        label="Attendance Rate"
        trend="School attendance"
        accent="#d97706"
        bgLight="#fffbeb"
      />
      <StatCard
        :icon="StarIcon"
        :value="honorStudents"
        label="Honor Students"
        trend="Students above 90%"
        accent="#7c3aed"
        bgLight="#faf5ff"
      />
    </div>

    <!-- CHARTS - Responsive -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
      <!-- BAR CHART -->
      <div class="card card-shadow p-4 md:p-0">
        <div class="px-4 md:px-6 pt-4 md:pt-5 mb-3 md:mb-4">
          <h3 class="text-sm font-bold text-gray-900">GPA Distribution by Class</h3>
          <p class="text-xs text-gray-500 mt-0.5">Average class GPA from backend</p>
        </div>
        <div class="px-3 md:px-4 pb-4 md:pb-5">
          <div v-if="classLabels.length === 0" class="h-[200px] md:h-[240px] flex items-center justify-center bg-gray-50 rounded-xl">
            <p class="text-gray-400 text-sm">No data available</p>
          </div>
          <div v-else class="h-[200px] md:h-[240px]">
            <Bar
              :data="barData"
              :options="barOpts"
            />
          </div>
        </div>
      </div>

      <!-- RADAR CHART -->
      <div class="card card-shadow p-4 md:p-0">
        <div class="px-4 md:px-6 pt-4 md:pt-5 mb-3 md:mb-4">
          <h3 class="text-sm font-bold text-gray-900">Subject Performance Radar</h3>
          <p class="text-xs text-gray-500 mt-0.5">Subject analytics from backend</p>
        </div>
        <div class="px-3 md:px-4 pb-4 md:pb-5 flex justify-center">
          <div class="h-[200px] md:h-[240px] w-full">
            <Radar
              :data="radarData"
              :options="radarOpts"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- TREND CHART -->
    <div class="card card-shadow p-4 md:p-0">
      <div class="px-4 md:px-6 pt-4 md:pt-5 mb-3 md:mb-4">
        <h3 class="text-sm font-bold text-gray-900">GPA Trend</h3>
        <p class="text-xs text-gray-500 mt-0.5">GPA trend by classes</p>
      </div>
      <div class="px-3 md:px-4 pb-4 md:pb-5">
        <div v-if="classLabels.length === 0" class="h-[180px] md:h-[220px] flex items-center justify-center bg-gray-50 rounded-xl">
          <p class="text-gray-400 text-sm">No data available</p>
        </div>
        <div v-else class="h-[180px] md:h-[220px]">
          <Line
            :data="trendData"
            :options="trendOpts"
          />
        </div>
      </div>
    </div>

    <!-- SUBJECT TABLE - Responsive -->
    <div class="card card-shadow overflow-hidden">
      <div class="px-4 md:px-6 pt-4 md:pt-5 pb-3 md:pb-4 border-b border-gray-100">
        <h3 class="text-sm font-bold text-gray-900">Subject Performance Breakdown</h3>
      </div>
      
      <!-- Mobile Card View (visible on small screens) -->
      <div class="block md:hidden divide-y divide-gray-100">
        <div v-for="s in subjectStats" :key="s.name" class="p-4 space-y-2 hover:bg-gray-50 transition">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-800 text-base">{{ s.name }}</span>
            <span class="text-xs font-bold" :class="s.up ? 'text-green-600' : 'text-red-500'">
              {{ s.up ? '↑' : '↓' }} {{ s.trendVal }}
            </span>
          </div>
          <div>
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Avg Score</span>
              <span class="font-bold text-gray-800">{{ s.avg }}%</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{ width: s.avg + '%', background: avgColor(s.avg) }"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <div>
              <p class="text-[10px] text-gray-400">Top Score</p>
              <p class="text-sm font-bold text-gray-700">{{ s.top }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-400">Students</p>
              <p class="text-sm font-bold text-gray-700">{{ s.enrolled }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View (hidden on mobile) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th class="px-5 py-4 text-left">Subject</th>
              <th class="px-5 py-4 text-left">Avg Score</th>
              <th class="px-5 py-4 text-left">Top Score</th>
              <th class="px-5 py-4 text-left">Students</th>
              <th class="px-5 py-4 text-left">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in subjectStats"
              :key="s.name"
              class="border-t border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-5 py-4 font-semibold text-gray-800">{{ s.name }}</td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :style="{ width: s.avg + '%', background: avgColor(s.avg) }"
                    />
                  </div>
                  <span class="font-bold text-gray-800">{{ s.avg }}%</span>
                </div>
              </td>
              <td class="px-5 py-4 font-bold text-gray-700">{{ s.top }}</td>
              <td class="px-5 py-4">{{ s.enrolled }}</td>
              <td class="px-5 py-4">
                <span class="font-bold" :class="s.up ? 'text-green-600' : 'text-red-500'">
                  {{ s.up ? '↑' : '↓' }} {{ s.trendVal }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State for No Data -->
    <div v-if="scores.length === 0 && !loading" class="text-center py-8 md:py-12">
      <div class="text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-lg font-semibold">No data available</p>
        <p class="text-sm">Add scores to see analytics</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
} from 'vue'
import axios from 'axios'
import {
  Bar,
  Line,
  Radar,
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/vue/24/outline'
import StatCard from '../components/StatCard.vue'

// ======================
// REGISTER CHART COMPONENTS
// ======================
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
)

// ======================
// STATE
// ======================
const loading = ref(false)
const scores = ref([])

// ======================
// FETCH BACKEND DATA
// ======================
const fetchAnalytics = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3000/scores')
    scores.value = response.data || []
  } catch (error) {
    console.error('Analytics Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})

// ======================
// KPI COMPUTED
// ======================
const schoolAverage = computed(() => {
  if (!scores.value.length) return '0.00'
  const total = scores.value.reduce((sum, s) => sum + Number(s.average || 0), 0)
  return (total / scores.value.length).toFixed(2)
})

const passRate = computed(() => {
  if (!scores.value.length) return 0
  const passed = scores.value.filter(s => Number(s.average || 0) >= 50).length
  return ((passed / scores.value.length) * 100).toFixed(1)
})

const honorStudents = computed(() => {
  return scores.value.filter(s => Number(s.average || 0) >= 90).length
})

// ======================
// CLASS GPA GROUPING
// ======================
const classGroups = computed(() => {
  const map = {}
  scores.value.forEach((s) => {
    const className = s.class_name || 'Unknown'
    if (!map[className]) {
      map[className] = []
    }
    map[className].push(Number(s.average) || 0)
  })
  return map
})

const classLabels = computed(() => Object.keys(classGroups.value))

const classAverages = computed(() =>
  Object.values(classGroups.value).map((arr) => {
    const total = arr.reduce((a, b) => a + b, 0)
    return (total / arr.length).toFixed(1)
  })
)

// ======================
// BAR CHART
// ======================
const barData = computed(() => ({
  labels: classLabels.value,
  datasets: [{
    label: 'Class GPA',
    data: classAverages.value,
    backgroundColor: 'rgba(99,102,241,0.75)',
    borderRadius: 8,
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  }]
}))

const barOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 11 } }
    },
    tooltip: {
      callbacks: {
        label: (context) => `GPA: ${context.raw}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: '#e5e7eb' },
      title: { display: true, text: 'GPA (%)', font: { size: 10 } }
    },
    x: {
      ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 35 }
    }
  },
  layout: {
    padding: { top: 5, bottom: 5, left: 5, right: 5 }
  }
}

// ======================
// SUBJECT ANALYTICS
// ======================
const avgSubject = (subject) => {
  if (!scores.value.length) return 0
  const total = scores.value.reduce((sum, s) => sum + Number(s[subject] || 0), 0)
  return (total / scores.value.length).toFixed(1)
}

// ======================
// RADAR CHART
// ======================
const radarData = computed(() => ({
  labels: ['Math', 'Khmer', 'Physics', 'Chemistry', 'Biology', 'English'],
  datasets: [{
    label: 'School Average',
    data: [
      avgSubject('math'),
      avgSubject('khmer'),
      avgSubject('physics'),
      avgSubject('chemistry'),
      avgSubject('biology'),
      avgSubject('english'),
    ],
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderWidth: 2,
    pointBackgroundColor: '#6366f1',
    pointBorderColor: '#fff',
    pointRadius: 3,
    pointHoverRadius: 5,
  }]
}))

const radarOpts = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 10 } }
    },
    tooltip: {
      callbacks: {
        label: (context) => `Average: ${context.raw}%`
      }
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, font: { size: 9 } },
      grid: { color: '#e5e7eb' },
      pointLabels: { font: { size: 10 } }
    }
  }
}

// ======================
// TREND CHART
// ======================
const trendData = computed(() => ({
  labels: classLabels.value,
  datasets: [{
    label: 'Average GPA',
    data: classAverages.value,
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59,130,246,0.05)',
    tension: 0.4,
    borderWidth: 3,
    fill: true,
    pointBackgroundColor: '#3b82f6',
    pointBorderColor: '#fff',
    pointRadius: 4,
    pointHoverRadius: 6,
  }]
}))

const trendOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 11 } }
    },
    tooltip: {
      callbacks: {
        label: (context) => `GPA: ${context.raw}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: '#e5e7eb' },
      title: { display: true, text: 'GPA (%)', font: { size: 10 } }
    },
    x: {
      ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 35 }
    }
  },
  layout: {
    padding: { top: 5, bottom: 5, left: 5, right: 5 }
  }
}

// ======================
// SUBJECT TABLE DATA
// ======================
const subjectStats = computed(() => {
  const maxMath = Math.max(...scores.value.map(s => s.math || 0), 0)
  const maxKhmer = Math.max(...scores.value.map(s => s.khmer || 0), 0)
  const maxPhysics = Math.max(...scores.value.map(s => s.physics || 0), 0)
  const maxChemistry = Math.max(...scores.value.map(s => s.chemistry || 0), 0)
  const maxBiology = Math.max(...scores.value.map(s => s.biology || 0), 0)
  const maxEnglish = Math.max(...scores.value.map(s => s.english || 0), 0)

  return [
    {
      name: 'Mathematics',
      avg: avgSubject('math'),
      top: maxMath,
      enrolled: scores.value.length,
      up: true,
      trendVal: '2.1%',
    },
    {
      name: 'Khmer',
      avg: avgSubject('khmer'),
      top: maxKhmer,
      enrolled: scores.value.length,
      up: true,
      trendVal: '1.5%',
    },
    {
      name: 'Physics',
      avg: avgSubject('physics'),
      top: maxPhysics,
      enrolled: scores.value.length,
      up: false,
      trendVal: '0.8%',
    },
    {
      name: 'Chemistry',
      avg: avgSubject('chemistry'),
      top: maxChemistry,
      enrolled: scores.value.length,
      up: true,
      trendVal: '1.2%',
    },
    {
      name: 'Biology',
      avg: avgSubject('biology'),
      top: maxBiology,
      enrolled: scores.value.length,
      up: false,
      trendVal: '0.5%',
    },
    {
      name: 'English',
      avg: avgSubject('english'),
      top: maxEnglish,
      enrolled: scores.value.length,
      up: true,
      trendVal: '1.8%',
    },
  ]
})

// ======================
// COLORS HELPER
// ======================
const avgColor = (v) => {
  const score = Number(v)
  if (score >= 80) return '#22c55e'
  if (score >= 65) return '#3b82f6'
  return '#f59e0b'
}
</script>

<style scoped>
/* Custom animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

/* Chart responsiveness */
canvas {
  max-width: 100%;
  height: auto !important;
}

/* Card styling */
.card {
  background-color: white;
  border-radius: 1rem;
}

.card-shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>