<template>
  <div class="space-y-4 md:space-y-6 report-container">
    <!-- Error Alert -->
    <div v-if="connectionError" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <div class="flex items-center gap-3">
        <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
        <div>
          <h3 class="font-semibold text-red-800">Connection Error</h3>
          <p class="text-sm text-red-600">Cannot connect to the server. Please make sure the backend is running.</p>
        </div>
        <button @click="retryConnection" class="ml-auto bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm transition">
          <i class="fas fa-sync-alt mr-1"></i> Retry
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500">Loading report data...</p>
      </div>
    </div>

    <!-- No Data State -->
    <div v-if="!loading && !connectionError && studentList.length === 0" class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-file-alt text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Report Data Available</h3>
      <p class="text-gray-500 mb-4">No scores have been added yet.</p>
      <router-link to="/scores" class="btn-primary inline-flex items-center gap-2">
        <i class="fas fa-plus-circle"></i> Add Scores First
      </router-link>
    </div>

    <!-- Print Header -->
    <div class="print-header" v-if="!loading && !connectionError && studentList.length > 0">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Report Card
          </h2>
          <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
            Official academic performance report
          </p>
        </div>

        <!-- Actions -->
        <div class="print-hide flex gap-2 md:gap-3">
          <button class="btn-outline btn text-sm md:text-base" @click="exportPDF">
            <ArrowDownTrayIcon class="w-4 h-4" />
            <span class="hidden xs:inline">Export PDF</span>
            <span class="xs:hidden">PDF</span>
          </button>
          <button class="btn-primary btn text-sm md:text-base" @click="printReport">
            <PrinterIcon class="w-4 h-4" />
            <span class="hidden xs:inline">Print</span>
            <span class="xs:hidden">Print</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Student Selector -->
    <div class="print-hide card card-shadow max-w-6xl mx-auto p-4 md:p-6" v-if="!loading && !connectionError && studentList.length > 0">
      <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div class="flex-1">
          <label class="text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2 block flex items-center gap-2">
            <i class="fas fa-user-graduate text-indigo-500"></i>
            Select Student
          </label>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <select 
              v-model="selectedStudentId" 
              @change="fetchReport"
              class="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm md:text-base appearance-none bg-white cursor-pointer"
            >
              <option v-for="student in studentList" :key="student.id" :value="student.id">
                {{ truncateText(student.student_name, 25) }} - {{ student.class_name }} (Avg: {{ student.average }}%)
              </option>
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
          </div>
        </div>
        
        <div class="flex gap-2 md:gap-3">
          <button 
            @click="previousStudent" 
            :disabled="!hasPreviousStudent"
            class="btn-outline btn px-3 md:px-4 text-sm md:text-base"
            :class="{ 'opacity-50 cursor-not-allowed': !hasPreviousStudent }"
          >
            <i class="fas fa-chevron-left mr-1"></i> Prev
          </button>
          <button 
            @click="nextStudent" 
            :disabled="!hasNextStudent"
            class="btn-outline btn px-3 md:px-4 text-sm md:text-base"
            :class="{ 'opacity-50 cursor-not-allowed': !hasNextStudent }"
          >
            Next <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- Class Summary Stats -->
      <div class="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div class="stat-card-mini">
            <div class="stat-icon-mini bg-blue-100">
              <i class="fas fa-users text-blue-600"></i>
            </div>
            <div>
              <p class="stat-label-mini">Total Students</p>
              <p class="stat-value-mini">{{ classStats.totalStudents }}</p>
            </div>
          </div>
          <div class="stat-card-mini">
            <div class="stat-icon-mini bg-green-100">
              <i class="fas fa-chart-line text-green-600"></i>
            </div>
            <div>
              <p class="stat-label-mini">Class Average</p>
              <p class="stat-value-mini text-green-600">{{ classStats.classAverage }}%</p>
            </div>
          </div>
          <div class="stat-card-mini">
            <div class="stat-icon-mini bg-amber-100">
              <i class="fas fa-trophy text-amber-600"></i>
            </div>
            <div>
              <p class="stat-label-mini">Highest Score</p>
              <p class="stat-value-mini text-amber-600">{{ classStats.highestScore }}%</p>
            </div>
          </div>
          <div class="stat-card-mini">
            <div class="stat-icon-mini bg-purple-100">
              <i class="fas fa-check-circle text-purple-600"></i>
            </div>
            <div>
              <p class="stat-label-mini">Passing Rate</p>
              <p class="stat-value-mini text-purple-600">{{ classStats.passingRate }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Card -->
    <div ref="reportRef" class="card card-shadow max-w-6xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-2xl" v-if="!loading && !connectionError && studentList.length > 0 && score.student_name">
      <!-- Header -->
      <div class="report-header p-4 md:p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 relative z-10">
          <!-- School Logo & Info -->
          <div class="flex items-center gap-4">
            <div class="school-logo">
              <i class="fas fa-graduation-cap text-3xl text-white/80"></i>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-[10px] md:text-xs text-blue-300 uppercase tracking-widest mb-1 md:mb-2">
                Official Academic Report
              </p>
              <h2 class="font-serif text-2xl md:text-4xl text-white mb-0.5 md:mb-1">
                Soab Secondary School
              </h2>
              <p class="text-xs md:text-sm text-blue-200">
                <i class="fas fa-map-marker-alt mr-1"></i> Soab, Kratie
              </p>
              <p class="text-[10px] md:text-xs text-blue-300 mt-1 md:mt-2 print-date">
                <i class="far fa-calendar-alt mr-1"></i> Generated: {{ currentDate }}
              </p>
            </div>
          </div>

          <!-- Average Score -->
          <div class="text-center sm:text-right">
            <p class="text-[10px] md:text-xs text-blue-300 mb-1 md:mb-2">
              Semester Average
            </p>
            <div class="average-score-card">
              <div>
                <p class="average-score-value">{{ score.average }}%</p>
                <p class="average-score-label">{{ performanceText }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 md:p-8 bg-white">
        <!-- Student Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          <div class="info-card">
            <div class="info-card-icon bg-indigo-100">
              <i class="fas fa-user text-indigo-600"></i>
            </div>
            <div>
              <p class="info-card-label">Student Name</p>
              <p class="info-card-value">{{ score.student_name }}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-icon bg-blue-100">
              <i class="fas fa-building text-blue-600"></i>
            </div>
            <div>
              <p class="info-card-label">Class</p>
              <p class="info-card-value">{{ score.class_name }}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-icon bg-pink-100">
              <i class="fas fa-venus-mars text-pink-600"></i>
            </div>
            <div>
              <p class="info-card-label">Gender</p>
              <p class="info-card-value">{{ score.gender || 'Not specified' }}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-icon bg-green-100">
              <i class="fas fa-star text-green-600"></i>
            </div>
            <div>
              <p class="info-card-label">Grade</p>
              <p class="info-card-value"><span class="grade-badge" :class="getGradeBadgeClass(score.grade)">{{ score.grade }}</span></p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-icon bg-amber-100">
              <i class="fas fa-trophy text-amber-600"></i>
            </div>
            <div>
              <p class="info-card-label">Rank</p>
              <p class="info-card-value">{{ score.rank || 'N/A' }} / {{ classStats.totalStudents }}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-icon bg-purple-100">
              <i class="fas fa-calculator text-purple-600"></i>
            </div>
            <div>
              <p class="info-card-label">Total Score</p>
              <p class="info-card-value">{{ score.total }}</p>
            </div>
          </div>
        </div>

        <!-- Subject Table -->
        <h3 class="text-sm md:text-base font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
          <i class="fas fa-table-list text-indigo-500"></i>
          Academic Results
        </h3>
        
        <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table class="data-table w-full text-xs md:text-sm">
            <thead>
              <tr class="bg-gradient-to-r from-gray-50 to-indigo-50/30">
                <th class="px-3 md:px-5 py-3 md:py-4 text-left">Subject</th>
                <th class="px-3 md:px-5 py-3 md:py-4 text-center">Max Score</th>
                <th class="px-3 md:px-5 py-3 md:py-4 text-center">Score</th>
                <th class="px-3 md:px-5 py-3 md:py-4 text-center">Percentage</th>
                <th class="px-3 md:px-5 py-3 md:py-4 text-center">Status</th>
                <th class="print-hide-column px-3 md:px-5 py-3 md:py-4 text-center">Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in subjects" :key="subject.name" class="border-t border-gray-100 hover:bg-gray-50 transition">
                <td class="px-3 md:px-5 py-3 md:py-4 font-semibold text-gray-800">
                  <i class="fas fa-book-open text-indigo-400 mr-2"></i>
                  {{ subject.name }}
                </td>
                <td class="px-3 md:px-5 py-3 md:py-4 text-center font-mono">{{ subject.maxScore }}</td>
                <td class="px-3 md:px-5 py-3 md:py-4 text-center font-bold text-gray-800">{{ subject.score }}</td>
                <td class="px-3 md:px-5 py-3 md:py-4 text-center font-mono">
                  {{ ((subject.score / subject.maxScore) * 100).toFixed(1) }}%
                </td>
                <td class="px-3 md:px-5 py-3 md:py-4 text-center">
                  <span class="status-badge" :class="passClass(subject.score, subject.maxScore)">
                    <i :class="passClass(subject.score, subject.maxScore) === 'badge-green' ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="mr-1"></i>
                    {{ passText(subject.score, subject.maxScore) }}
                  </span>
                </td>
                <td class="print-hide-column px-3 md:px-5 py-3 md:py-4">
                  <div class="progress-bar">
                    <div 
                      class="progress-bar-fill"
                      :class="getProgressBarClass(subject.score, subject.maxScore)"
                      :style="{ width: `${(subject.score / subject.maxScore) * 100}%` }"
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
          <div class="summary-card-v2 summary-card-green">
            <div class="summary-card-icon">
              <i class="fas fa-award text-2xl"></i>
            </div>
            <div>
              <p class="summary-card-label">Final Grade</p>
              <p class="summary-card-value text-green-600">{{ score.grade }}</p>
            </div>
          </div>
          <div class="summary-card-v2 summary-card-blue">
            <div class="summary-card-icon">
              <i class="fas fa-chart-simple text-2xl"></i>
            </div>
            <div>
              <p class="summary-card-label">Class Rank</p>
              <p class="summary-card-value text-blue-600">#{{ score.rank || 'N/A' }}</p>
            </div>
          </div>
          <div class="summary-card-v2 summary-card-purple">
            <div class="summary-card-icon">
              <i class="fas fa-percent text-2xl"></i>
            </div>
            <div>
              <p class="summary-card-label">Average Score</p>
              <p class="summary-card-value text-purple-600">{{ score.average }}%</p>
            </div>
          </div>
          <div class="summary-card-v2 summary-card-amber">
            <div class="summary-card-icon">
              <i class="fas fa-star text-2xl"></i>
            </div>
            <div>
              <p class="summary-card-label">Total Points</p>
              <p class="summary-card-value text-amber-600">{{ score.total }}</p>
            </div>
          </div>
        </div>

        <!-- Performance Message -->
        <div class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-center">
          <p class="text-sm text-gray-700">
            <i class="fas fa-quote-left text-indigo-400 mr-2"></i>
            {{ getPerformanceMessage() }}
            <i class="fas fa-quote-right text-indigo-400 ml-2"></i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/vue/24/outline'

// ======================
// STATE
// ======================
const reportRef = ref(null)
const selectedStudentId = ref(null)
const studentList = ref([])
const currentDate = ref('')
const loading = ref(false)
const connectionError = ref(false)
const score = ref({
  student_name: '',
  class_name: '',
  gender: '',
  math: 0,
  khmer: 0,
  physics: 0,
  chemistry: 0,
  biology: 0,
  geography: 0,
  history: 0,
  english: 0,
  total: 0,
  average: 0,
  grade: '',
  rank: '',
})

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Helper to truncate text
const truncateText = (text, length) => {
  if (!text) return '—'
  return text.length > length ? text.substring(0, length) + '...' : text
}

// ======================
// COMPUTED PROPERTIES
// ======================
const subjects = computed(() => [
  { name: 'Mathematics', score: score.value.math || 0, maxScore: 100 },
  { name: 'Khmer', score: score.value.khmer || 0, maxScore: 100 },
  { name: 'Physics', score: score.value.physics || 0, maxScore: 50 },
  { name: 'Chemistry', score: score.value.chemistry || 0, maxScore: 50 },
  { name: 'Biology', score: score.value.biology || 0, maxScore: 50 },
  { name: 'Geography', score: score.value.geography || 0, maxScore: 50 },
  { name: 'History', score: score.value.history || 0, maxScore: 50 },
  { name: 'English', score: score.value.english || 0, maxScore: 50 }
])

const classStats = computed(() => {
  if (studentList.value.length === 0) {
    return { totalStudents: 0, classAverage: 0, highestScore: 0, passingRate: 0 }
  }
  
  const averages = studentList.value.map(s => s.average || 0)
  const classAverage = averages.length > 0 ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1) : 0
  const highestScore = averages.length > 0 ? Math.max(...averages) : 0
  const passingCount = studentList.value.filter(s => (s.average || 0) >= 60).length
  const passingRate = studentList.value.length > 0 ? ((passingCount / studentList.value.length) * 100).toFixed(1) : 0
  
  return {
    totalStudents: studentList.value.length,
    classAverage,
    highestScore,
    passingRate
  }
})

const hasPreviousStudent = computed(() => {
  const currentIndex = studentList.value.findIndex(s => s.id === selectedStudentId.value)
  return currentIndex > 0
})

const hasNextStudent = computed(() => {
  const currentIndex = studentList.value.findIndex(s => s.id === selectedStudentId.value)
  return currentIndex < studentList.value.length - 1
})

const performanceText = computed(() => {
  const avg = score.value.average || 0
  if (avg >= 90) return 'Excellent'
  if (avg >= 80) return 'Very Good'
  if (avg >= 70) return 'Good'
  if (avg >= 60) return 'Average'
  return 'Needs Improvement'
})

// ======================
// METHODS
// ======================
const passText = (value, max) => {
  const percent = (value / max) * 100
  return percent >= 50 ? 'PASS' : 'FAIL'
}

const passClass = (value, max) => {
  const percent = (value / max) * 100
  return percent >= 50 ? 'badge-green' : 'badge-red'
}

const getProgressBarClass = (value, max) => {
  const percent = (value / max) * 100
  if (percent >= 80) return 'bg-green-500'
  if (percent >= 60) return 'bg-blue-500'
  if (percent >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getGradeBadgeClass = (grade) => {
  switch(grade) {
    case 'A': return 'grade-a'
    case 'B': return 'grade-b'
    case 'C': return 'grade-c'
    case 'D': return 'grade-d'
    default: return 'grade-f'
  }
}

const getPerformanceMessage = () => {
  const avg = score.value.average || 0
  if (avg >= 90) {
    return 'Outstanding performance! You have excelled in all subjects. Keep up the great work!'
  } else if (avg >= 80) {
    return 'Very good performance! You are doing well. A little more effort will make you excellent!'
  } else if (avg >= 70) {
    return 'Good performance! You are on the right track. Keep working hard to improve further.'
  } else if (avg >= 60) {
    return 'Satisfactory performance. You have passed, but there is room for improvement.'
  } else {
    return 'Needs improvement. Please work harder next semester and seek help from teachers.'
  }
}

const retryConnection = () => {
  fetchAllStudents()
}

// ======================
// FETCH DATA
// ======================
const fetchAllStudents = async () => {
  loading.value = true
  connectionError.value = false
  
  try {
    const response = await axios.get(`${API_URL}/scores`)
    studentList.value = response.data || []
    
    if (studentList.value.length > 0 && !selectedStudentId.value) {
      selectedStudentId.value = studentList.value[0].id
      await fetchReport()
    }
  } catch (error) {
    console.error('Failed to fetch students:', error)
    connectionError.value = true
    studentList.value = []
  } finally {
    loading.value = false
  }
}

const fetchReport = async () => {
  if (!selectedStudentId.value) return
  
  loading.value = true
  try {
    const response = await axios.get(`${API_URL}/scores/${selectedStudentId.value}`)
    score.value = response.data || {
      student_name: '',
      class_name: '',
      gender: '',
      math: 0,
      khmer: 0,
      physics: 0,
      chemistry: 0,
      biology: 0,
      geography: 0,
      history: 0,
      english: 0,
      total: 0,
      average: 0,
      grade: '',
      rank: '',
    }
  } catch (error) {
    console.error('Report Fetch Error:', error)
    if (error.code === 'ERR_NETWORK') {
      connectionError.value = true
    }
  } finally {
    loading.value = false
  }
}

const previousStudent = async () => {
  const currentIndex = studentList.value.findIndex(s => s.id === selectedStudentId.value)
  if (currentIndex > 0) {
    selectedStudentId.value = studentList.value[currentIndex - 1].id
    await fetchReport()
  }
}

const nextStudent = async () => {
  const currentIndex = studentList.value.findIndex(s => s.id === selectedStudentId.value)
  if (currentIndex < studentList.value.length - 1) {
    selectedStudentId.value = studentList.value[currentIndex + 1].id
    await fetchReport()
  }
}

const exportPDF = () => {
  document.body.classList.add('printing')
  window.print()
  setTimeout(() => {
    document.body.classList.remove('printing')
  }, 100)
}

const printReport = () => {
  document.body.classList.add('printing')
  window.print()
  setTimeout(() => {
    document.body.classList.remove('printing')
  }, 100)
}

// Set current date
const setCurrentDate = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  setCurrentDate()
  fetchAllStudents()
})
</script>

<style scoped>
/* Custom breakpoint */
@media (min-width: 480px) {
  .xs\:inline { display: inline; }
  .xs\:hidden { display: none; }
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

@media (min-width: 768px) {
  .btn {
    padding: 0.75rem 1.5rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.btn-outline {
  border: 1px solid #e2e8f0;
  background: white;
  color: #4b5563;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #6366f1;
  color: #6366f1;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
}

.card-shadow {
  box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.15);
}

/* Report Header */
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e1b4b 100%);
  position: relative;
}

.school-logo {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

@media (min-width: 768px) {
  .school-logo {
    width: 70px;
    height: 70px;
  }
}

.average-score-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
}

@media (min-width: 768px) {
  .average-score-card {
    gap: 1rem;
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
  }
}

.average-score-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

@media (min-width: 768px) {
  .average-score-value {
    font-size: 2.5rem;
  }
}

.average-score-label {
  font-size: 0.7rem;
  color: #bfdbfe;
  margin-top: 0.25rem;
}

@media (min-width: 768px) {
  .average-score-label {
    font-size: 0.75rem;
  }
}

/* Info Cards */
.info-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .info-card-icon {
    width: 48px;
    height: 48px;
  }
}

.info-card-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.125rem;
}

@media (min-width: 768px) {
  .info-card-label {
    font-size: 0.7rem;
  }
}

.info-card-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

@media (min-width: 768px) {
  .info-card-value {
    font-size: 1rem;
  }
}

/* Grade Badge */
.grade-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
}

.grade-a { background: #dcfce7; color: #166534; }
.grade-b { background: #dbeafe; color: #1e40af; }
.grade-c { background: #fef3c7; color: #92400e; }
.grade-d { background: #fed7aa; color: #9a3412; }
.grade-f { background: #fee2e2; color: #991b1b; }

/* Table Styles */
.data-table {
  width: 100%;
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.data-table th {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .data-table th {
    font-size: 0.75rem;
  }
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
}

@media (min-width: 768px) {
  .status-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
}

.badge-green {
  background: #dcfce7;
  color: #166534;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  max-width: 120px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

/* Summary Cards */
.summary-card-v2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.summary-card-v2:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.summary-card-green {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.summary-card-blue {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.summary-card-purple {
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
}

.summary-card-amber {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.summary-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-card-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.summary-card-value {
  font-size: 1.25rem;
  font-weight: 800;
}

@media (min-width: 768px) {
  .summary-card-value {
    font-size: 1.5rem;
  }
}

/* Mini Stat Cards */
.stat-card-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon-mini {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label-mini {
  font-size: 0.65rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.stat-value-mini {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
}

/* Animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

/* Print Styles */
@media print {
  .print-hide {
    display: none !important;
  }
  
  .print-hide-column {
    display: none !important;
  }
  
  .card {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
    margin: 0 !important;
  }
  
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>

<!-- Global print styles -->
<style>
@media print {
  aside, .sidebar, nav:not(.print-friendly), header:not(.print-friendly) {
    display: none !important;
  }
  
  main, .main-content {
    margin-left: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  body.printing {
    overflow: auto !important;
  }
}
</style>