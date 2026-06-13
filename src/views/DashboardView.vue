<template>
  <div class="space-y-4 md:space-y-6">
    <!-- HEADER - Responsive -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
      <div>
        <h1 class="text-2xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          School Dashboard
        </h1>
        <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
          Overview of students and academic performance
        </p>
      </div>

      <button
        @click="fetchDashboard"
        :disabled="loading"
        class="px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </span>
        <span v-else>Refresh Data</span>
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm md:text-base">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Loading dashboard data...
      </div>
    </div>

    <!-- STATS CARDS - Responsive Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
      <StatCard
        :icon="UserGroupIcon"
        :value="totalStudents"
        label="Students"
        trend="Registered students"
        accent="#2563eb"
        bgLight="#eff6ff"
      />
      <StatCard
        :icon="AcademicCapIcon"
        :value="totalTeachers"
        label="Teachers"
        trend="Teaching staff"
        accent="#4f46e5"
        bgLight="#eef2ff"
      />
      <StatCard
        :icon="TableCellsIcon"
        :value="totalClasses"
        label="Classes"
        trend="Available classes"
        accent="#16a34a"
        bgLight="#f0fdf4"
      />
      <StatCard
        :icon="ChartBarIcon"
        :value="averageScore + '%'"
        label="Average"
        trend="Academic performance"
        accent="#d97706"
        bgLight="#fffbeb"
      />
    </div>

    <!-- CHARTS SECTION - Responsive -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">
      <!-- LINE CHART - Performance Chart -->
      <div class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 xl:col-span-2">
        <h3 class="text-lg md:text-xl font-black mb-4 md:mb-6">Student Performance</h3>
        
        <!-- Mobile fallback when no data -->
        <div v-if="topStudents.length === 0" class="h-[250px] md:h-[350px] flex items-center justify-center bg-gray-50 rounded-xl">
          <p class="text-gray-400 text-sm">No performance data available</p>
        </div>
        
        <!-- Chart Container - Responsive -->
        <div v-else class="h-[250px] md:h-[350px] relative">
          <Line
            :data="lineData"
            :options="lineOpts"
            :key="lineChartKey"
          />
        </div>
      </div>

      <!-- DONUT CHART - Grade Distribution -->
      <div class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-black mb-4 md:mb-6">Grade Distribution</h3>
        
        <!-- Mobile fallback -->
        <div v-if="totalGradeCount === 0" class="h-[200px] md:h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
          <p class="text-gray-400 text-sm">No grade data available</p>
        </div>
        
        <!-- Chart Container -->
        <div v-else class="h-[200px] md:h-[300px] relative">
          <Doughnut
            :data="donutData"
            :options="donutOpts"
            :key="donutChartKey"
          />
        </div>

        <!-- LEGEND - Responsive -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3 mt-4 md:mt-5">
          <div
            v-for="l in donutLegend"
            :key="l.label"
            class="flex items-center justify-between sm:justify-start gap-1 md:gap-2"
          >
            <div class="flex items-center gap-1 md:gap-2">
              <span
                class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                :style="{ background: l.color }"
              />
              <span class="text-[10px] md:text-sm text-gray-700">
                {{ l.label }}
              </span>
            </div>
            <span class="font-bold text-gray-900 text-xs md:text-sm">
              {{ l.count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Stats Section - Responsive -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <!-- Top Students Card -->
      <div class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6">
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h3 class="text-lg md:text-xl font-black">🏆 Top Performing Students</h3>
          <span class="text-xs text-gray-400">by average score</span>
        </div>
        
        <div v-if="topStudents.length === 0" class="text-center py-6 md:py-8 text-gray-400">
          No student data available
        </div>
        
        <div v-else class="space-y-3 md:space-y-4">
          <div
            v-for="(student, idx) in topStudents"
            :key="student.id"
            class="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"
          >
            <div class="flex items-center gap-3 md:gap-4">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm">
                {{ idx + 1 }}
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm md:text-base">{{ student.name }}</p>
                <p class="text-[10px] md:text-xs text-gray-400">{{ student.class }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg md:text-xl font-bold text-green-600">{{ student.gpa }}</p>
              <p class="text-[10px] md:text-xs text-gray-400">Average</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities Card -->
      <div class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6">
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h3 class="text-lg md:text-xl font-black">📋 Recent Activities</h3>
          <span class="text-xs text-gray-400">latest updates</span>
        </div>
        
        <div v-if="activities.length === 0" class="text-center py-6 md:py-8 text-gray-400">
          No recent activities
        </div>
        
        <div v-else class="space-y-3 md:space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"
          >
            <div class="w-2 h-2 mt-2 rounded-full" :style="{ background: activity.color }"></div>
            <div class="flex-1">
              <p class="text-gray-800 text-sm md:text-base">{{ activity.text }}</p>
              <p class="text-[10px] md:text-xs text-gray-400 mt-0.5 md:mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  nextTick
} from 'vue'
import axios from 'axios'
import {
  Line,
  Doughnut,
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  UserGroupIcon,
  AcademicCapIcon,
  TableCellsIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import StatCard from '../components/StatCard.vue'

// ======================
// REGISTER CHART COMPONENTS
// ======================
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
)

// ======================
// STATE
// ======================
const loading = ref(false)
const scores = ref([])
const teachers = ref([])
const students = ref([])
const classes = ref([])

// Chart refresh keys
const lineChartKey = ref(0)
const donutChartKey = ref(0)

// ======================
// FETCH BACKEND DATA
// ======================
const fetchDashboard = async () => {
  try {
    loading.value = true
    
    const [
      scoreResponse,
      teacherResponse,
      studentResponse,
      classResponse,
    ] = await Promise.all([
      axios.get('/scores'),
      axios.get('/teachers'),
      axios.get('/students'),
      axios.get('/classes'),
    ])

    scores.value = scoreResponse.data || []
    teachers.value = teacherResponse.data || []
    students.value = studentResponse.data || []
    classes.value = classResponse.data || []

    // Refresh charts after data loads
    await nextTick()
    lineChartKey.value++
    donutChartKey.value++
    
  } catch (error) {
    console.error('Dashboard Error:', error)
    if(error.code === 'ERR_NETWORK'){
      console.error('Cannot connect to backend.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})

// ======================
// UNIQUE STUDENTS (by name to avoid duplicates)
// ======================
const uniqueStudents = computed(() => {
  const map = new Map()
  scores.value.forEach((s) => {
    if (s.student_name && !map.has(s.student_name)) {
      map.set(s.student_name, s)
    }
  })
  return [...map.values()]
})

// ======================
// STATS COMPUTED
// ======================
const totalStudents = computed(() => {
  return students.value.length
})

const totalTeachers = computed(() => {
  return teachers.value.length
})

const totalClasses = computed(() => {
  return classes.value.length
})

const averageScore = computed(() => {
  if (!scores.value.length) return 0
  const total = scores.value.reduce((sum, s) => sum + (Number(s.average) || 0), 0)
  return (total / scores.value.length).toFixed(1)
})

// ======================
// TOP STUDENTS
// ======================
const topStudents = computed(() => {
  return [...uniqueStudents.value]
    .filter(s => s.average)
    .sort((a, b) => (b.average || 0) - (a.average || 0))
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.student_name || 'Unknown',
      class: s.class_name || 'N/A',
      gpa: (s.average || 0) + '%',
      initials: (s.student_name || 'U').charAt(0),
      color: '#6366f1',
    }))
})

// ======================
// RECENT ACTIVITIES
// ======================
const activities = computed(() => {
  return [...scores.value]
    .filter(s => s.student_name && s.grade)
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      text: `${s.student_name} received Grade ${s.grade}`,
      time: s.created_at 
        ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Recently',
      color: s.grade === 'A' ? '#22c55e' : s.grade === 'B' ? '#3b82f6' : s.grade === 'C' ? '#f59e0b' : '#ef4444',
    }))
})

// ======================
// LINE CHART DATA
// ======================
const lineData = computed(() => ({
  labels: topStudents.value.map(s => {
    // Truncate long names
    const name = s.name
    return name.length > 12 ? name.substring(0, 10) + '...' : name
  }),
  datasets: [{
    label: 'Average Score (%)',
    data: topStudents.value.map(s => Number(s.gpa.replace('%', '')) || 0),
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.1)',
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: '#6366f1',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    borderWidth: 3,
  }]
}))

const lineOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 12 },
        usePointStyle: true,
        boxWidth: 10,
      }
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
      padding: 8,
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw}%`
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: { color: '#e5e7eb', drawBorder: false },
      title: {
        display: true,
        text: 'Score (%)',
        font: { size: 11 }
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 10 },
        maxRotation: 45,
        minRotation: 35
      }
    }
  },
  layout: {
    padding: { top: 10, bottom: 10, left: 5, right: 5 }
  }
}

// ======================
// DONUT CHART - GRADE DISTRIBUTION
// ======================
const gradeCounts = computed(() => {
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 }
  scores.value.forEach((s) => {
    if (s.grade && counts[s.grade] !== undefined) {
      counts[s.grade]++
    }
  })
  return counts
})

const totalGradeCount = computed(() => {
  return Object.values(gradeCounts.value).reduce((a, b) => a + b, 0)
})

const donutData = computed(() => ({
  labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
  datasets: [{
    data: [
      gradeCounts.value.A,
      gradeCounts.value.B,
      gradeCounts.value.C,
      gradeCounts.value.D,
      gradeCounts.value.F,
    ],
    backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
    borderWidth: 0,
    hoverOffset: 8,
  }]
}))

const donutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
          return `${context.label}: ${context.raw} (${percentage}%)`
        }
      }
    }
  }
}

const donutLegend = computed(() => [
  { label: 'A', color: '#22c55e', count: gradeCounts.value.A },
  { label: 'B', color: '#3b82f6', count: gradeCounts.value.B },
  { label: 'C', color: '#f59e0b', count: gradeCounts.value.C },
  { label: 'D', color: '#f97316', count: gradeCounts.value.D },
  { label: 'F', color: '#ef4444', count: gradeCounts.value.F },
])
</script>

<style scoped>
/* Chart responsiveness */
canvas {
  max-width: 100%;
  height: auto !important;
}

/* Custom scrollbar for tables if needed */
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

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>