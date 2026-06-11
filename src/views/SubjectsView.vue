<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BookOpenIcon class="w-6 h-6 text-indigo-500" />
          Subjects
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Manage secondary school subjects • Total: {{ subjects.length }} subjects
        </p>
      </div>

      <!-- Add Button -->
      <button class="btn-primary btn gap-2" @click="openAddModal">
        <PlusIcon class="w-4 h-4" />
        Add Subject
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Subjects</p>
          <BookOpenIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ subjects.length }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Core</p>
          <StarIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-indigo-600 mt-1">{{ coreCount }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Science</p>
          <BeakerIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ scienceCount }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Avg Score</p>
          <ChartBarIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ avgPerformance }}%</p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Students</p>
          <UsersIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-purple-600 mt-1">{{ totalStudents }}</p>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="flex flex-wrap gap-3 items-end">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="search"
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Search by name, code, or teacher..."
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
          <select v-model="filterCategory" class="form-input py-2">
            <option value="">All Categories</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <!-- Grade Filter -->
        <div class="w-32">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Grade</label>
          <select v-model="filterGrade" class="form-input py-2">
            <option value="">All Grades</option>
            <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
          <select v-model="sortBy" class="form-input py-2">
            <option value="name">Name</option>
            <option value="avg">Average Score</option>
            <option value="enrolled">Enrolled Students</option>
            <option value="grade_level">Grade</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <button
          v-if="search || filterCategory || filterGrade"
          @click="resetFilters"
          class="text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-indigo-50 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Quick Stats Tags -->
    <div class="flex flex-wrap gap-2">
      <span class="text-xs text-gray-500">Quick Stats:</span>
      <span v-for="stat in categoryStats" :key="stat.category" class="text-xs px-2 py-1 rounded-full" :class="getCategoryBadgeClass(stat.category)">
        {{ stat.category }}: {{ stat.count }}
      </span>
    </div>

    <!-- Subject Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="s in paginatedSubjects"
        :key="s.id"
        class="card card-shadow p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
              {{ s.emoji }}
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm">{{ s.name }}</p>
              <code class="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">{{ s.code }}</code>
            </div>
          </div>
          <span class="badge" :class="badgeColor(s.category)">{{ s.category }}</span>
        </div>

        <!-- Meta Info -->
        <div class="flex gap-4 text-xs text-gray-500 mb-4 flex-wrap">
          <span class="flex items-center gap-1">🎓 {{ s.grade_level }}</span>
          <span class="flex items-center gap-1">👨‍🏫 {{ truncateText(s.teacher, 20) }}</span>
          <span class="flex items-center gap-1">👥 {{ s.enrolled }} students</span>
        </div>

        <!-- Average Score Progress -->
        <div>
          <div class="flex justify-between text-xs mb-1.5">
            <span class="text-gray-500 font-medium">Average Score</span>
            <span class="font-bold" :class="getScoreTextClass(s.avg)">{{ s.avg }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :style="{ width: s.avg + '%', background: avgColor(s.avg) }"
            ></div>
          </div>
        </div>

        <!-- Performance Indicator -->
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-gray-400">Performance</span>
          <span class="text-xs font-medium" :class="getPerformanceClass(s.avg)">
            {{ getPerformanceLabel(s.avg) }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button class="btn-outline btn btn-sm flex-1 justify-center gap-1" @click="editSubject(s)">
            <PencilSquareIcon class="w-3.5 h-3.5" />
            Edit
          </button>
          <button class="btn-ghost btn btn-sm text-red-400 hover:bg-red-50" @click="openDeleteModal(s)">
            <TrashIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredSubjects.length > 0" class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
      <div class="text-xs text-gray-500">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredSubjects.length }} subjects
      </div>
      <div class="flex gap-1.5">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        
        <div class="flex gap-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            class="w-8 h-8 rounded-lg text-sm font-medium transition"
            :class="currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Show:</span>
        <select v-model="itemsPerPage" class="text-xs border border-gray-200 rounded-lg px-2 py-1">
          <option :value="6">6</option>
          <option :value="12">12</option>
          <option :value="24">24</option>
          <option :value="48">48</option>
        </select>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ editingId ? 'Edit Subject' : 'Add Subject' }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ editingId ? 'Update subject information' : 'Create a new subject' }}</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl" @click="closeModal">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label required">Subject Name</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Mathematics" />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <div>
              <label class="form-label required">Subject Code</label>
              <input v-model="form.code" type="text" class="form-input" placeholder="MATH101" />
              <p v-if="errors.code" class="text-red-500 text-xs mt-1">{{ errors.code }}</p>
            </div>

            <div>
              <label class="form-label required">Category</label>
              <select v-model="form.category" class="form-input">
                <option value="">Select Category</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
            </div>

            <div>
              <label class="form-label required">Grade Level</label>
              <select v-model="form.grade_level" class="form-input">
                <option value="">Select Grade</option>
                <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
              </select>
              <p v-if="errors.grade_level" class="text-red-500 text-xs mt-1">{{ errors.grade_level }}</p>
            </div>

            <div>
              <label class="form-label">Teacher</label>
              <input v-model="form.teacher" type="text" class="form-input" placeholder="Mr. Dara" />
            </div>

            <div>
              <label class="form-label">Enrolled Students</label>
              <input v-model.number="form.enrolled" type="number" min="0" class="form-input" />
            </div>

            <div>
              <label class="form-label">Average Score (0-100)</label>
              <input v-model.number="form.avg" type="number" min="0" max="100" class="form-input" />
            </div>

            <div>
              <label class="form-label">Emoji</label>
              <input v-model="form.emoji" type="text" class="form-input" placeholder="📘" />
            </div>
          </div>

          <!-- Preview Card -->
          <div v-if="form.name && form.category" class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
            <p class="text-xs text-gray-500 mb-2">Preview</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl">{{ form.emoji || '📘' }}</div>
              <div>
                <p class="font-bold text-gray-900">{{ form.name || 'Subject Name' }}</p>
                <p class="text-xs text-gray-500">{{ form.code || 'CODE' }} • {{ form.category || 'Category' }} • Grade {{ form.grade_level || '?' }}</p>
              </div>
              <div class="ml-auto text-right">
                <p class="text-xs text-gray-500">Avg Score</p>
                <p class="text-xl font-bold" :class="getScoreTextClass(form.avg)">{{ form.avg || 0 }}%</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn" @click="closeModal">Cancel</button>
            <button class="btn-primary btn" @click="saveSubject">{{ editingId ? 'Update Subject' : 'Save Subject' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="closeDeleteModal">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div class="flex justify-center">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <TrashIcon class="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div class="text-center mt-5">
          <h3 class="text-xl font-bold text-gray-900">Delete Subject</h3>
          <p class="text-sm text-gray-500 mt-2">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ deletingSubject?.name }}</span>?
          </p>
          <p class="text-xs text-red-400 mt-1">This action cannot be undone.</p>
        </div>
        <div class="flex justify-center gap-3 mt-8">
          <button class="btn-outline btn" @click="closeDeleteModal">Cancel</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  StarIcon,
  BeakerIcon,
  ChartBarIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import {
  getSubjects,
  createSubject,
  updateSubject,
  removeSubject,
} from '../services/subjectService'

// Data
const subjects = ref([])
const search = ref('')
const filterCategory = ref('')
const filterGrade = ref('')
const sortBy = ref('name')
const loading = ref(false)

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref(null)
const deletingSubject = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Categories and Grades
const categories = ['Core', 'Science', 'Language', 'Social Studies', 'Technology', 'Arts']
const grades = ['7A', '7B', '7C', '8A', '8B', '9A', '9B']

// Errors
const errors = ref({})

// Form
const form = ref({
  name: '',
  code: '',
  category: '',
  grade_level: '',
  teacher: '',
  enrolled: 0,
  avg: 0,
  emoji: '📘',
})

// Computed - Statistics
const coreCount = computed(() => subjects.value.filter(s => s.category === 'Core').length)
const scienceCount = computed(() => subjects.value.filter(s => s.category === 'Science').length)
const totalStudents = computed(() => subjects.value.reduce((sum, s) => sum + (s.enrolled || 0), 0))

const avgPerformance = computed(() => {
  if (!subjects.value.length) return 0
  const total = subjects.value.reduce((sum, s) => sum + (s.avg || 0), 0)
  return Math.round(total / subjects.value.length)
})

const categoryStats = computed(() => {
  return categories.map(cat => ({
    category: cat,
    count: subjects.value.filter(s => s.category === cat).length
  })).filter(stat => stat.count > 0)
})

// Computed - Filtered Subjects
const filteredSubjects = computed(() => {
  let result = subjects.value.filter((s) => {
    const matchSearch = !search.value ||
      s.name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.code.toLowerCase().includes(search.value.toLowerCase()) ||
      s.teacher.toLowerCase().includes(search.value.toLowerCase())
    const matchCategory = !filterCategory.value || s.category === filterCategory.value
    const matchGrade = !filterGrade.value || s.grade_level === filterGrade.value
    return matchSearch && matchCategory && matchGrade
  })
  
  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'avg') return b.avg - a.avg
    if (sortBy.value === 'enrolled') return b.enrolled - a.enrolled
    if (sortBy.value === 'grade_level') return a.grade_level.localeCompare(b.grade_level)
    return 0
  })
  
  return result
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(filteredSubjects.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredSubjects.value.length))
const paginatedSubjects = computed(() => filteredSubjects.value.slice(startIndex.value, endIndex.value))

// Displayed page numbers
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })
  
  return rangeWithDots
})

// Pagination Methods
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { if (page !== '...') currentPage.value = page }

// Reset Filters
const resetFilters = () => {
  search.value = ''
  filterCategory.value = ''
  filterGrade.value = ''
  currentPage.value = 1
}

// Fetch Subjects
const fetchSubjects = async () => {
  try {
    loading.value = true
    const response = await getSubjects()
    subjects.value = response.data.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      category: s.category,
      grade_level: s.grade_level,
      teacher: s.teacher || 'Not Assigned',
      enrolled: s.enrolled || 0,
      avg: s.avg || 0,
      emoji: s.emoji || '📘',
    }))
  } catch (error) {
    console.error('Fetch Error:', error)
  } finally {
    loading.value = false
  }
}

// UI Helper Functions
const badgeColor = (category) => {
  switch (category) {
    case 'Science': return 'badge-blue'
    case 'Language': return 'badge-green'
    case 'Arts': return 'badge-pink'
    case 'Technology': return 'badge-orange'
    default: return 'badge-indigo'
  }
}

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Core': return 'bg-indigo-100 text-indigo-700'
    case 'Science': return 'bg-blue-100 text-blue-700'
    case 'Language': return 'bg-green-100 text-green-700'
    case 'Arts': return 'bg-pink-100 text-pink-700'
    case 'Technology': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const avgColor = (avg) => {
  if (avg >= 80) return '#22c55e'
  if (avg >= 60) return '#f59e0b'
  return '#ef4444'
}

const getScoreTextClass = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getPerformanceLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Average'
  if (score >= 50) return 'Below Average'
  return 'Needs Improvement'
}

const getPerformanceClass = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const truncateText = (text, length) => {
  if (!text) return '—'
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Validation
const validateForm = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Subject name is required'
  if (!form.value.code) errors.value.code = 'Subject code is required'
  if (!form.value.category) errors.value.category = 'Category is required'
  if (!form.value.grade_level) errors.value.grade_level = 'Grade level is required'
  return Object.keys(errors.value).length === 0
}

// Modal Functions
const openAddModal = () => {
  editingId.value = null
  errors.value = {}
  form.value = {
    name: '',
    code: '',
    category: '',
    grade_level: '',
    teacher: '',
    enrolled: 0,
    avg: 0,
    emoji: '📘',
  }
  showModal.value = true
}

const saveSubject = async () => {
  if (!validateForm()) return
  try {
    const payload = {
      name: form.value.name,
      code: form.value.code,
      category: form.value.category,
      grade_level: form.value.grade_level,
      teacher: form.value.teacher,
      enrolled: form.value.enrolled,
      avg: form.value.avg,
      emoji: form.value.emoji,
    }
    if (editingId.value) {
      await updateSubject(editingId.value, payload)
    } else {
      await createSubject(payload)
    }
    await fetchSubjects()
    closeModal()
  } catch (error) {
    console.error('Save Error:', error)
    alert('Failed to save subject')
  }
}

const editSubject = (subject) => {
  editingId.value = subject.id
  form.value = { ...subject }
  showModal.value = true
}

const openDeleteModal = (subject) => {
  deletingSubject.value = subject
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await removeSubject(deletingSubject.value.id)
    await fetchSubjects()
    closeDeleteModal()
  } catch (error) {
    console.error('Delete Error:', error)
  }
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingSubject.value = null
}

// Lifecycle
onMounted(() => {
  fetchSubjects()
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-blue { background-color: #dbeafe; color: #1e40af; }
.badge-green { background-color: #dcfce7; color: #166534; }
.badge-pink { background-color: #fce7f3; color: #9d174d; }
.badge-orange { background-color: #ffedd5; color: #9a3412; }
.badge-indigo { background-color: #e0e7ff; color: #3730a3; }

.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-primary:hover { background-color: #4338ca; }

.btn-outline {
  border: 1px solid #e2e8f0;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-outline:hover { background-color: #f8fafc; }

.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}
.form-label.required::after { content: '*'; color: #ef4444; margin-left: 0.25rem; }

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  ring: 2px solid #e0e7ff;
}

.card {
  background-color: white;
  border-radius: 1rem;
}
.card-shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
</style>