<template>
  <div class="space-y-6 report-container">
    <div class="print-header">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Report Card
          </h2>
          <p class="text-gray-500 mt-1">
            Official academic performance report
          </p>
        </div>

        <!-- Actions - Hide on print -->
        <div class="print-hide flex gap-3">
          <button class="btn-outline btn" @click="exportPDF">
            <ArrowDownTrayIcon class="w-4 h-4" />
            Export PDF
          </button>
          <button class="btn-primary btn" @click="printReport">
            <PrinterIcon class="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>

    <div class="print-hide card card-shadow max-w-6xl mx-auto p-6">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex-1">
          <label class="text-sm font-semibold text-gray-700 mb-2 block">
            Select Student
          </label>
          <div class="relative">
            <select 
              v-model="selectedStudentId" 
              @change="fetchReport"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            >
              <option v-for="student in studentList" :key="student.id" :value="student.id">
                {{ student.student_name }} - {{ student.class_name }} (Rank: {{ student.rank }})
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="previousStudent" 
            :disabled="!hasPreviousStudent"
            class="btn-outline btn px-4"
            :class="{ 'opacity-50 cursor-not-allowed': !hasPreviousStudent }"
          >
            ← Previous
          </button>
          <button 
            @click="nextStudent" 
            :disabled="!hasNextStudent"
            class="btn-outline btn px-4"
            :class="{ 'opacity-50 cursor-not-allowed': !hasNextStudent }"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Class Summary Stats -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase">Total Students</p>
            <p class="text-2xl font-bold text-gray-800">{{ classStats.totalStudents }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase">Class Average</p>
            <p class="text-2xl font-bold text-green-600">{{ classStats.classAverage }}%</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase">Highest Score</p>
            <p class="text-2xl font-bold text-amber-600">{{ classStats.highestScore }}%</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase">Passing Rate</p>
            <p class="text-2xl font-bold text-blue-600">{{ classStats.passingRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div ref="reportRef" class="card card-shadow max-w-6xl mx-auto overflow-hidden">
      <!-- HEADER -->
      <div class="p-8" style="background:linear-gradient(135deg,#1e3a8a 0%,#312e81 60%,#1e1b4b 100%);">
        <div class="flex items-start justify-between">
          <!-- School -->
          <div>
            <p class="text-xs text-blue-300 uppercase tracking-widest mb-2">
              Official Academic Report
            </p>
            <h2 class="font-serif text-4xl text-white mb-1">
              Soab Secondary School
            </h2>
            <p class="text-sm text-blue-200">
              Soab, Kratie
            </p>
            <p class="text-xs text-blue-300 mt-2 print-date">
              Generated: {{ currentDate }}
            </p>
          </div>

          <!-- Average -->
          <div class="text-right">
            <p class="text-xs text-blue-300 mb-2">
              Semester Average
            </p>
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-3">
              <div>
                <p class="text-4xl font-extrabold text-white leading-none">
                  {{ score.average }}%
                </p>
                <p class="text-[11px] text-blue-200 mt-0.5">
                  {{ performanceText }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-8">
        <!-- Student Info -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8 p-5 bg-gray-50 rounded-2xl">
          <div>
            <p class="info-label">Student Name</p>
            <p class="info-value">{{ score.student_name }}</p>
          </div>
          <div>
            <p class="info-label">Class</p>
            <p class="info-value">{{ score.class_name }}</p>
          </div>
          <div>
            <p class="info-label">Gender</p>
            <p class="info-value">{{ score.gender }}</p>
          </div>
          <div>
            <p class="info-label">Grade</p>
            <p class="info-value">{{ score.grade }}</p>
          </div>
          <div>
            <p class="info-label">Rank</p>
            <p class="info-value">{{ score.rank }} out of {{ classStats.totalStudents }}</p>
          </div>
          <div>
            <p class="info-label">Total Score</p>
            <p class="info-value">{{ score.total }}</p>
          </div>
        </div>

        <!-- SUBJECT TABLE -->
        <h3 class="text-sm font-bold text-gray-700 mb-3">Academic Results</h3>
        <div class="overflow-x-auto rounded-xl border border-gray-100">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Score</th>
                <th>Student Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th class="print-hide-column">Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in subjects" :key="subject.name">
                <td class="subject-name">{{ subject.name }}</td>
                <td>{{ subject.maxScore }}</td>
                <td>
                  <strong>{{ subject.score }}</strong>
                </td>
                <td>
                  {{ ((subject.score / subject.maxScore) * 100).toFixed(1) }}%
                </td>
                <td>
                  <span class="badge" :class="passClass(subject.score, subject.maxScore)">
                    {{ passText(subject.score, subject.maxScore) }}
                  </span>
                </td>
                <td class="print-hide-column">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all"
                      :class="getProgressBarClass(subject.score, subject.maxScore)"
                      :style="{ width: `${(subject.score / subject.maxScore) * 100}%` }"
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div class="summary-card bg-green-50">
            <p class="summary-value text-green-600">{{ score.grade }}</p>
            <p class="summary-label">Final Grade</p>
          </div>
          <div class="summary-card bg-blue-50">
            <p class="summary-value text-blue-600">#{{ score.rank }}</p>
            <p class="summary-label">Class Rank</p>
          </div>
          <div class="summary-card bg-purple-50">
            <p class="summary-value text-purple-600">{{ score.average }}%</p>
            <p class="summary-label">Average</p>
          </div>
          <div class="summary-card bg-amber-50">
            <p class="summary-value text-amber-600">{{ score.total }}</p>
            <p class="summary-label">Total Score</p>
          </div>
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

// ======================
// COMPUTED PROPERTIES
// ======================
const subjects = computed(() => [
  { name: 'Mathematics', score: score.value.math, maxScore: 100 },
  { name: 'Khmer', score: score.value.khmer, maxScore: 100 },
  { name: 'Physics', score: score.value.physics, maxScore: 50 },
  { name: 'Chemistry', score: score.value.chemistry, maxScore: 50 },
  { name: 'Biology', score: score.value.biology, maxScore: 50 },
  { name: 'Geography', score: score.value.geography, maxScore: 50 },
  { name: 'History', score: score.value.history, maxScore: 50 },
  { name: 'English', score: score.value.english, maxScore: 50 }
])

const classStats = computed(() => {
  if (studentList.value.length === 0) {
    return { totalStudents: 0, classAverage: 0, highestScore: 0, passingRate: 0 }
  }
  
  const averages = studentList.value.map(s => s.average)
  const classAverage = (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1)
  const highestScore = Math.max(...averages)
  const passingCount = studentList.value.filter(s => s.average >= 60).length
  const passingRate = ((passingCount / studentList.value.length) * 100).toFixed(1)
  
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
  if (score.value.average >= 90) return 'Excellent'
  if (score.value.average >= 80) return 'Very Good'
  if (score.value.average >= 70) return 'Good'
  if (score.value.average >= 60) return 'Average'
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

const getSubjectCount = (status) => {
  if (status === 'pass') {
    return subjects.value.filter(s => (s.score / s.maxScore) * 100 >= 50).length
  }
  return 0
}

const getHighestSubject = () => {
  const highest = subjects.value.reduce((prev, current) => 
    (prev.score / prev.maxScore) > (current.score / current.maxScore) ? prev : current
  )
  const percent = (highest.score / highest.maxScore) * 100
  return percent >= 90 ? highest.name : null
}

// ======================
// FETCH DATA
// ======================
const fetchAllStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/scores')
    studentList.value = response.data
    if (studentList.value.length > 0 && !selectedStudentId.value) {
      selectedStudentId.value = studentList.value[0].id
      await fetchReport()
    }
  } catch (error) {
    console.error('Failed to fetch students:', error)
  }
}

const fetchReport = async () => {
  if (!selectedStudentId.value) return
  
  try {
    const response = await axios.get(`http://localhost:3000/scores/${selectedStudentId.value}`)
    score.value = response.data
  } catch (error) {
    console.error('Report Fetch Error:', error)
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
  // Add a class to body before printing
  document.body.classList.add('printing')
  window.print()
  // Remove the class after print dialog closes
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
  fetchAllStudents()
  setCurrentDate()
})
</script>

<style scoped>
.btn {
  @apply px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all;
}

.btn-primary {
  @apply bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105;
}

.btn-outline {
  @apply border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600;
}

.card {
  @apply bg-white rounded-3xl border border-gray-100;
}

.card-shadow {
  @apply shadow-xl;
}

.info-label {
  @apply text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1;
}

.info-value {
  @apply text-sm font-semibold text-gray-800;
}

.data-table {
  @apply min-w-full text-sm;
}

.data-table thead {
  @apply bg-gray-50 text-gray-500 uppercase text-xs;
}

.data-table th {
  @apply px-5 py-4 text-left;
}

.data-table td {
  @apply px-5 py-4 border-t border-gray-100;
}

.subject-name {
  @apply font-semibold text-gray-800;
}

.badge {
  @apply px-3 py-1 rounded-full text-xs font-bold;
}

.badge-green {
  @apply bg-green-100 text-green-700;
}

.badge-red {
  @apply bg-red-100 text-red-700;
}

.summary-card {
  @apply rounded-2xl p-5 text-center transition-all hover:scale-105;
}

.summary-value {
  @apply text-3xl font-extrabold mb-1;
}

.summary-label {
  @apply text-xs text-gray-500 uppercase tracking-wide;
}

@media print {
  /* Hide admin sidebar - this targets common admin sidebar classes */
  aside,
  .sidebar,
  .admin-sidebar,
  [class*="sidebar"],
  [class*="Sidebar"],
  nav:not(.print-friendly),
  .main-nav,
  .admin-nav {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
  }

  /* Adjust main content to take full width */
  main,
  .main-content,
  .content-wrapper,
  [class*="main-content"] {
    margin-left: 0 !important;
    padding-left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Hide print-specific elements */
  .print-hide {
    display: none !important;
  }

  .print-hide-column {
    display: none !important;
  }

  /* Show print-specific elements */
  .print-header {
    display: block !important;
  }

  .print-footer {
    display: block !important;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .print-date {
    display: block !important;
  }

  /* Optimize report card for printing */
  .report-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  .card {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
    margin: 0 !important;
    page-break-inside: avoid;
  }

  /* Ensure colors print well */
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Page breaks */
  .page-break {
    page-break-before: always;
  }

  /* Typography for print */
  body {
    font-size: 12pt;
    line-height: 1.4;
  }

  h2 {
    font-size: 18pt;
  }

  .summary-value {
    font-size: 16pt;
  }

  /* Remove shadows and backgrounds for print */
  .card-shadow {
    box-shadow: none !important;
  }

  .bg-gradient-to-r {
    background: #1e3a8a !important;
  }
}

/* Global print styles for admin sidebar */
@media print {
  /* Hide common admin layout elements */
  .v-navigation-drawer,
  .v-app-bar,
  .v-main__wrap > nav,
  .layout > nav,
  [data-testid="sidebar"],
  .sidebar-menu,
  .navigation-drawer,
  .drawer,
  .menu-sidebar,
  .admin-menu,
  .side-menu,
  .navbar,
  .app-header,
  .toolbar,
  .v-toolbar {
    display: none !important;
  }

  /* Make main content full width */
  .v-main,
  .main,
  .app-main,
  .content {
    margin-left: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* Remove any margins/paddings that might be from sidebar */
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* Disable hover effects on print */
@media print {
  .summary-card:hover {
    transform: none !important;
  }
  
  .btn:hover {
    transform: none !important;
  }
}
</style>

<!-- Global style to hide sidebar when printing -->
<style>
/* This global style ensures admin sidebar is hidden during print */
@media print {
  /* Target common Vue.js/Vuetify/Element UI sidebar classes */
  .v-navigation-drawer--active,
  .el-aside,
  .ant-layout-sider,
  .sidebar-container,
  .side-bar,
  .app-sidebar,
  .navigation,
  [role="navigation"],
  header:not(.print-friendly),
  .header:not(.print-friendly),
  .app-header:not(.print-friendly),
  .top-nav:not(.print-friendly) {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    flex: 0 0 0 !important;
    position: fixed !important;
    left: -9999px !important;
  }

  /* Adjust main content area */
  main,
  .main-content,
  .app-main,
  .content-wrapper,
  .v-main,
  .el-main,
  .ant-layout-content {
    margin-left: 0 !important;
    padding-left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Fix layout containers */
  .flex,
  .row,
  .container,
  .v-container {
    display: block !important;
  }

  /* Ensure body takes full width */
  html, body {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: visible !important;
  }

  /* Reset any transforms that might affect layout */
  * {
    transform: none !important;
  }
}

/* Class to detect print mode */
body.printing {
  overflow: auto !important;
}

body.printing .print-hide {
  display: none !important;
}
</style>