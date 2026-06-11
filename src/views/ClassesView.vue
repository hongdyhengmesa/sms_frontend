<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BuildingLibraryIcon class="w-6 h-6 text-indigo-500" />
          Classes
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">
          Manage class sections and scheduling • Total: {{ classes.length }} classes
        </p>
      </div>

      <!-- Add Button -->
      <button class="btn-primary btn gap-2" @click="openAddModal">
        <PlusIcon class="w-4 h-4" />
        Add Class
      </button>
    </div>

    <!-- Stats Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Classes</p>
          <AcademicCapIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ classes.length }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Students</p>
          <UsersIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ totalStudents }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Avg GPA</p>
          <ChartBarIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ overallAvgGPA }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Active</p>
          <CheckCircleIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-emerald-600 mt-1">{{ activeClasses }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Fill Rate</p>
          <ChartPieIcon class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-purple-600 mt-1">{{ fillRate }}%</p>
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
              placeholder="Search by class name or teacher..."
            />
          </div>
        </div>

        <!-- Grade Filter -->
        <div class="w-32">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Grade</label>
          <select v-model="filterGrade" class="form-input py-2">
            <option value="">All Grades</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="w-32">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
          <select v-model="filterStatus" class="form-input py-2">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
          <select v-model="sortBy" class="form-input py-2">
            <option value="name">Class Name</option>
            <option value="grade">Grade</option>
            <option value="students">Students</option>
            <option value="gpa">GPA</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <button
          v-if="search || filterGrade || filterStatus"
          @click="resetFilters"
          class="text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-indigo-50 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Grade Tabs (Quick Filter) -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="g in ['All', '7', '8', '9']"
        :key="g"
        class="btn btn-sm transition-all"
        :class="activeGrade === g ? 'btn-primary' : 'btn-outline'"
        @click="activeGrade = g"
      >
        {{ g === 'All' ? 'All Grades' : `Grade ${g}` }}
      </button>
    </div>

    <!-- Table -->
    <div class="card card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gradient-to-r from-gray-50 to-indigo-50/30 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Class</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Grade</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Homeroom Teacher</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Students / Capacity</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Room</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Avg GPA</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="c in paginatedClasses"
              :key="c.id"
              class="hover:bg-gray-50/80 transition group"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                    <BuildingLibraryIcon class="w-4 h-4 text-indigo-600" />
                  </div>
                  <span class="text-base font-extrabold text-gray-900">{{ c.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="badge-blue badge">Grade {{ c.grade }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-sm" :style="{ background: c.tcolor }">
                    {{ c.tinit || 'N/A' }}
                  </div>
                  <span class="text-sm font-medium">{{ c.teacher || 'Not Assigned' }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :style="{
                        width: (c.students / c.cap * 100) + '%',
                        background: getFillColor(c.students / c.cap)
                      }"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-gray-700">{{ c.students }} / {{ c.cap }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-gray-600 flex items-center gap-1">
                  <HomeIcon class="w-3.5 h-3.5 text-gray-400" />
                  {{ c.room || '—' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm font-bold" :style="{ color: gpaColor(c.gpa) }">
                  {{ c.gpa }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="badge" :class="c.status === 'Active' ? 'badge-green' : 'badge-gray'">
                  <span class="w-1.5 h-1.5 rounded-full mr-1" :class="c.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                  {{ c.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-1.5">
                  <button class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="View" @click="viewClass(c)">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition" title="Edit" @click="editClass(c)">
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete" @click="openDeleteModal(c)">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="paginatedClasses.length === 0">
              <td colspan="8" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <BuildingLibraryIcon class="w-8 h-8 text-gray-400" />
                  </div>
                  <p class="text-gray-500 font-medium">No classes found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new class</p>
                  <button class="btn-primary btn mt-4" @click="openAddModal">
                    <PlusIcon class="w-4 h-4" />
                    Add Class
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredClasses.length > 0" class="border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        <div class="text-xs text-gray-500">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredClasses.length }} classes
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
        
        <!-- Items per page -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">Show:</span>
          <select v-model="itemsPerPage" class="text-xs border border-gray-200 rounded-lg px-2 py-1">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Grade Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="g in gradeSummary" :key="g.grade" class="card card-shadow p-4 hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Grade {{ g.grade }}</p>
          <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <AcademicCapIcon class="w-4 h-4 text-indigo-600" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Classes</span>
            <span class="font-bold text-gray-900">{{ g.classes }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Students</span>
            <span class="font-bold text-blue-600">{{ g.students }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Avg GPA</span>
            <span class="font-bold" :style="{ color: gpaColor(g.gpa) }">{{ g.gpa }}</span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div class="h-full rounded-full bg-green-500" :style="{ width: (g.students / maxStudentsPerGrade * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ editingId ? 'Edit Class' : 'Add Class' }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ editingId ? 'Update class information' : 'Create a new class section' }}</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl" @click="closeModal">✕</button>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label required">Class Name</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="7A" />
            </div>

            <div>
              <label class="form-label required">Grade</label>
              <select v-model.number="form.grade" class="form-input">
                <option value="">Select Grade</option>
                <option :value="7">Grade 7</option>
                <option :value="8">Grade 8</option>
                <option :value="9">Grade 9</option>
              </select>
            </div>

            <div>
              <label class="form-label">Homeroom Teacher</label>
              <input v-model="form.teacher" type="text" class="form-input" placeholder="Teacher name" />
            </div>

            <div>
              <label class="form-label">Students</label>
              <input v-model.number="form.students" type="number" min="0" class="form-input" />
            </div>

            <div>
              <label class="form-label">Capacity</label>
              <input v-model.number="form.cap" type="number" min="1" class="form-input" />
            </div>

            <div>
              <label class="form-label">Room</label>
              <input v-model="form.room" type="text" class="form-input" placeholder="Room number" />
            </div>

            <div>
              <label class="form-label">Average GPA</label>
              <input v-model.number="form.gpa" type="number" step="0.1" min="0" max="4" class="form-input" />
            </div>

            <div>
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-input">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn" @click="closeModal">Cancel</button>
            <button class="btn-primary btn" @click="saveClass">{{ editingId ? 'Update Class' : 'Save Class' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="closeViewModal">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Class Details</h3>
              <p class="text-sm text-gray-500">Detailed class information</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl" @click="closeViewModal">✕</button>
          </div>
          
          <div v-if="selectedClass" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-4">
                <p class="text-xs text-gray-500 mb-1">Class</p>
                <p class="font-bold text-xl">{{ selectedClass.name }}</p>
              </div>
              <div class="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <p class="text-xs text-gray-500 mb-1">Grade</p>
                <p class="font-bold text-xl">Grade {{ selectedClass.grade }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500 mb-1">Homeroom Teacher</p>
                <p class="font-semibold">{{ selectedClass.teacher || 'Not Assigned' }}</p>
              </div>
              <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500 mb-1">Room</p>
                <p class="font-semibold">{{ selectedClass.room || '—' }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500 mb-1">Students</p>
                <p class="font-bold text-xl">{{ selectedClass.students }} / {{ selectedClass.cap }}</p>
                <div class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-blue-500" :style="{ width: (selectedClass.students / selectedClass.cap * 100) + '%' }"></div>
                </div>
              </div>
              <div class="rounded-xl bg-gray-50 p-4">
                <p class="text-xs text-gray-500 mb-1">Average GPA</p>
                <p class="font-bold text-2xl" :style="{ color: gpaColor(selectedClass.gpa) }">{{ selectedClass.gpa }}</p>
              </div>
            </div>
            
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-xs text-gray-500 mb-1">Status</p>
              <span class="badge" :class="selectedClass.status === 'Active' ? 'badge-green' : 'badge-gray'">{{ selectedClass.status }}</span>
            </div>
          </div>

          <div class="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <button class="btn-primary btn" @click="closeViewModal">Close</button>
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
          <h3 class="text-xl font-bold text-gray-900">Delete Class</h3>
          <p class="text-sm text-gray-500 mt-2">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ selectedClass?.name }}</span>?
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
  EyeIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChartPieIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { getClasses, createClass, updateClass, removeClass } from '../services/classService'

// Data
const classes = ref([])
const activeGrade = ref('All')
const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const sortBy = ref('name')
const loading = ref(false)

// Modal states
const showModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref(null)
const selectedClass = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Form
const form = ref({
  name: '',
  grade: '',
  teacher: '',
  students: 0,
  cap: 40,
  room: '',
  gpa: 0,
  status: 'Active',
})

// Fetch Classes
const fetchClasses = async () => {
  try {
    loading.value = true
    const response = await getClasses()
    classes.value = response.data.map((c) => ({
      id: c.id,
      name: c.name,
      grade: c.grade_level,
      grade_level: c.grade_level,
      teacher: c.teacher,
      students: Number(c.students),
      cap: Number(c.capacity),
      capacity: Number(c.capacity),
      room: c.room,
      gpa: Number(c.gpa),
      status: c.status,
      tinit: c.teacher?.split(' ').map(t => t[0]).join('').toUpperCase(),
      tcolor: c.grade_level == 7 ? '#6366f1' : c.grade_level == 8 ? '#ec4899' : '#14b8a6',
    }))
  } catch (error) {
    console.error('Fetch Error:', error)
  } finally {
    loading.value = false
  }
}

// Computed - Stats
const totalStudents = computed(() => classes.value.reduce((sum, c) => sum + c.students, 0))
const overallAvgGPA = computed(() => {
  if (classes.value.length === 0) return '0.0'
  const sum = classes.value.reduce((acc, c) => acc + c.gpa, 0)
  return (sum / classes.value.length).toFixed(1)
})
const activeClasses = computed(() => classes.value.filter(c => c.status === 'Active').length)
const fillRate = computed(() => {
  if (classes.value.length === 0) return 0
  const totalCapacity = classes.value.reduce((sum, c) => sum + c.cap, 0)
  if (totalCapacity === 0) return 0
  return Math.round((totalStudents.value / totalCapacity) * 100)
})
const maxStudentsPerGrade = computed(() => {
  const max = Math.max(...gradeSummary.value.map(g => g.students))
  return max || 100
})

// Computed - Filtered Classes
const filteredClasses = computed(() => {
  let result = classes.value.filter((c) => {
    const matchSearch = !search.value || 
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.teacher?.toLowerCase().includes(search.value.toLowerCase())
    const matchGrade = !filterGrade.value || c.grade == filterGrade.value
    const matchStatus = !filterStatus.value || c.status === filterStatus.value
    const matchActiveGrade = activeGrade.value === 'All' || c.grade == activeGrade.value
    return matchSearch && matchGrade && matchStatus && matchActiveGrade
  })
  
  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'grade') return a.grade - b.grade
    if (sortBy.value === 'students') return b.students - a.students
    if (sortBy.value === 'gpa') return b.gpa - a.gpa
    return 0
  })
  
  return result
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(filteredClasses.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredClasses.value.length))
const paginatedClasses = computed(() => filteredClasses.value.slice(startIndex.value, endIndex.value))

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
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
  }
}

// Reset Filters
const resetFilters = () => {
  search.value = ''
  filterGrade.value = ''
  filterStatus.value = ''
  activeGrade.value = 'All'
  currentPage.value = 1
}

// Grade Summary
const gradeSummary = computed(() => {
  return [7, 8, 9].map((grade) => {
    const gradeClasses = classes.value.filter(c => c.grade == grade)
    const totalStudents = gradeClasses.reduce((sum, c) => sum + c.students, 0)
    const avgGpa = gradeClasses.length ? (gradeClasses.reduce((sum, c) => sum + c.gpa, 0) / gradeClasses.length).toFixed(1) : 0
    return { grade, classes: gradeClasses.length, students: totalStudents, gpa: avgGpa }
  })
})

// UI Helpers
const gpaColor = (gpa) => {
  if (gpa >= 3.5) return '#22c55e'
  if (gpa >= 3.0) return '#f59e0b'
  return '#ef4444'
}

const getFillColor = (ratio) => {
  if (ratio > 0.85) return '#f59e0b'
  return '#22c55e'
}

// Modal Functions
const openAddModal = () => {
  editingId.value = null
  form.value = {
    name: '',
    grade: '',
    teacher: '',
    students: 0,
    cap: 40,
    room: '',
    gpa: 0,
    status: 'Active',
  }
  showModal.value = true
}

const saveClass = async () => {
  try {
    if (!form.value.name || !form.value.grade) {
      alert('Class name and grade are required')
      return
    }

    const payload = {
      name: form.value.name,
      grade_level: String(form.value.grade),
      teacher: form.value.teacher,
      students: Number(form.value.students),
      capacity: Number(form.value.cap),
      room: form.value.room,
      gpa: Number(form.value.gpa),
      status: form.value.status,
    }

    if (editingId.value) {
      await updateClass(Number(editingId.value), payload)
    } else {
      await createClass(payload)
    }
    await fetchClasses()
    closeModal()
  } catch (error) {
    console.error('Save Error:', error)
    alert('Failed to save class')
  }
}

const editClass = (c) => {
  editingId.value = Number(c.id)
  form.value = {
    name: c.name,
    grade: c.grade_level || c.grade,
    teacher: c.teacher,
    students: Number(c.students),
    cap: Number(c.capacity || c.cap),
    room: c.room,
    gpa: Number(c.gpa),
    status: c.status,
  }
  showModal.value = true
}

const viewClass = (c) => {
  selectedClass.value = c
  showViewModal.value = true
}

const openDeleteModal = (c) => {
  selectedClass.value = c
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await removeClass(selectedClass.value.id)
    await fetchClasses()
    closeDeleteModal()
  } catch (error) {
    console.error('Delete Error:', error)
  }
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedClass.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedClass.value = null
}

// Lifecycle
onMounted(() => {
  fetchClasses()
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
.badge-green {
  background-color: #dcfce7;
  color: #166534;
}
.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}
.badge-gray {
  background-color: #f1f5f9;
  color: #475569;
}
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
.btn-primary:hover {
  background-color: #4338ca;
}
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
.btn-outline:hover {
  background-color: #f8fafc;
}
.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}
.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}
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