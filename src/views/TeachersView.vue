<template>
  <div class="space-y-4 md:space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <UserGroupIcon class="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
          Teachers
        </h2>
        <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
          Manage teacher information and subjects • Total: {{ teachers.length }}
        </p>
      </div>

      <!-- Add Teacher - Mobile friendly -->
      <button class="btn-primary btn gap-2 text-sm md:text-base" @click="openAddModal">
        <PlusIcon class="w-4 h-4" />
        <span class="hidden xs:inline">Add Teacher</span>
        <span class="xs:hidden">Add</span>
      </button>
    </div>

    <!-- Summary Cards - Responsive Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
      <div class="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-[10px] md:text-xs text-gray-500">Total</p>
          <UsersIcon class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold text-gray-900 mt-1">{{ teachers.length }}</h3>
      </div>

      <div class="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-[10px] md:text-xs text-gray-500">Male</p>
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></span>
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold text-blue-600 mt-1">
          {{ teachers.filter(t => t.gender === 'Male').length }}
        </h3>
      </div>

      <div class="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-[10px] md:text-xs text-gray-500">Female</p>
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-pink-500"></span>
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold text-pink-600 mt-1">
          {{ teachers.filter(t => t.gender === 'Female').length }}
        </h3>
      </div>

      <div class="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-[10px] md:text-xs text-gray-500">Subjects</p>
          <BookOpenIcon class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold text-green-600 mt-1">{{ subjects.length }}</h3>
      </div>

      <div class="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
        <div class="flex items-center justify-between">
          <p class="text-[10px] md:text-xs text-gray-500">Active</p>
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
        </div>
        <h3 class="text-xl md:text-2xl font-extrabold text-emerald-600 mt-1">{{ activeCount }}</h3>
      </div>
    </div>

    <!-- Filters Bar - Responsive Layout -->
    <div class="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
      <div class="flex flex-col gap-3">
        <!-- Search - Full width on mobile -->
        <div class="w-full">
          <label class="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 block">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
            <input
              v-model="search"
              class="w-full pl-9 pr-3 py-1.5 md:py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition text-sm md:text-base"
              placeholder="Search by name, email, or subject..."
            />
          </div>
        </div>

        <!-- Filter Row - Scrollable on mobile -->
        <div class="flex flex-wrap gap-2 md:gap-3 items-end">
          <!-- Gender Filter -->
          <div class="flex-1 min-w-[100px]">
            <label class="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 block">Gender</label>
            <select v-model="filterGender" class="form-input py-1.5 md:py-2 text-sm md:text-base">
              <option value="">All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <!-- Subject Filter -->
          <div class="flex-1 min-w-[120px]">
            <label class="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 block">Subject</label>
            <select v-model="filterSubject" class="form-input py-1.5 md:py-2 text-sm md:text-base">
              <option value="">All Subjects</option>
              <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="flex-1 min-w-[100px]">
            <label class="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
            <select v-model="sortBy" class="form-input py-1.5 md:py-2 text-sm md:text-base">
              <option value="name">Name</option>
              <option value="gender">Gender</option>
              <option value="subject">Subject</option>
            </select>
          </div>

          <!-- Reset Filters -->
          <button
            v-if="search || filterGender || filterSubject"
            @click="resetFilters"
            class="text-indigo-600 hover:text-indigo-700 text-xs md:text-sm font-medium py-1.5 md:py-2 px-2 md:px-3 rounded-xl hover:bg-indigo-50 transition whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Card View (visible on small screens) -->
    <div class="block md:hidden space-y-3">
      <div
        v-for="t in paginatedTeachers"
        :key="t.id"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      >
        <!-- Header with avatar and actions -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
              :style="{ background: t.color }"
            >
              {{ t.initials }}
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ t.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ t.email }}</p>
            </div>
          </div>
          <div class="flex gap-1">
            <button
              class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              @click="editTeacher(t)"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              @click="openDeleteModal(t)"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">Gender</p>
            <span
              class="inline-block mt-1 badge text-xs"
              :class="t.gender === 'Male' ? 'badge-blue' : 'badge-pink'"
            >
              {{ t.gender }}
            </span>
          </div>
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">Status</p>
            <span class="badge-green badge text-xs mt-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
              {{ t.status }}
            </span>
          </div>
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">Subject</p>
            <span
              class="inline-block mt-1 badge text-xs"
              :class="t.subject === 'Not Assigned' ? 'badge-gray' : 'badge-indigo'"
            >
              {{ t.subject }}
            </span>
          </div>
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
            <div class="flex items-center gap-1 mt-1">
              <PhoneIcon class="w-3 h-3 text-gray-400" />
              <span class="text-sm text-gray-600">{{ t.phone || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Empty State -->
      <div v-if="paginatedTeachers.length === 0" class="bg-white rounded-2xl p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <UserGroupIcon class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500 font-medium">No teachers found</p>
        <p class="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    </div>

    <!-- Desktop Table View (hidden on mobile) -->
    <div class="hidden md:block card card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gradient-to-r from-gray-50 to-indigo-50/30 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Teacher</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Gender</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Main Subject</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="t in paginatedTeachers"
              :key="t.id"
              class="hover:bg-gray-50/80 transition group"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    :style="{ background: t.color }"
                  >
                    {{ t.initials }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ t.name }}</p>
                    <p class="text-xs text-gray-400">{{ t.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="t.gender === 'Male' ? 'badge-blue' : 'badge-pink'"
                >
                  {{ t.gender }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="t.subject === 'Not Assigned' ? 'badge-gray' : 'badge-indigo'"
                >
                  {{ t.subject }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <PhoneIcon class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-sm text-gray-600">{{ t.phone || '—' }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="badge-green badge">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                  {{ t.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-1.5">
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit"
                    @click="editTeacher(t)"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                    @click="openDeleteModal(t)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Desktop Empty State -->
            <tr v-if="paginatedTeachers.length === 0">
              <td colspan="6" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <UserGroupIcon class="w-8 h-8 text-gray-400" />
                  </div>
                  <p class="text-gray-500 font-medium">No teachers found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new teacher</p>
                  <button class="btn-primary btn mt-4" @click="openAddModal">
                    <PlusIcon class="w-4 h-4" />
                    Add Teacher
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination - Responsive -->
    <div v-if="filteredTeachers.length > 0" class="border-t border-gray-100 px-3 md:px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50 rounded-b-2xl">
      <div class="text-[11px] md:text-xs text-gray-500 order-2 sm:order-1">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTeachers.length }} teachers
      </div>
      
      <!-- Pagination Controls -->
      <div class="flex gap-1.5 order-1 sm:order-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'"
        >
          <ChevronLeftIcon class="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        
        <!-- Simplified pagination for mobile -->
        <div class="hidden sm:flex gap-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            class="w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs md:text-sm font-medium transition"
            :class="currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
        </div>
        
        <!-- Mobile simplified page indicator -->
        <div class="flex sm:hidden items-center gap-1 text-sm">
          <span class="text-gray-600">Page</span>
          <select v-model="currentPage" class="border border-gray-200 rounded-lg px-2 py-1 text-sm">
            <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
          </select>
          <span class="text-gray-500 text-xs">of {{ totalPages }}</span>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'"
        >
          <ChevronRightIcon class="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
      
      <!-- Items per page -->
      <div class="flex items-center gap-2 order-3">
        <span class="text-[11px] md:text-xs text-gray-500">Show:</span>
        <select v-model="itemsPerPage" class="text-xs border border-gray-200 rounded-lg px-1.5 py-0.5 md:px-2 md:py-1">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Add/Edit Modal - Responsive -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 md:p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 md:p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-900">
                {{ editingId ? 'Edit Teacher' : 'Add Teacher' }}
              </h3>
              <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                {{ editingId ? 'Update teacher information' : 'Fill in the details to add a new teacher' }}
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl p-1" @click="closeModal">✕</button>
          </div>

          <!-- Form - Responsive Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label class="form-label required">Teacher Name</label>
              <input v-model="form.name" type="text" class="form-input text-sm md:text-base" placeholder="Full name" />
            </div>

            <div>
              <label class="form-label required">Email</label>
              <input v-model="form.email" type="email" class="form-input text-sm md:text-base" placeholder="teacher@school.com" />
            </div>

            <div>
              <label class="form-label">Gender</label>
              <select v-model="form.gender" class="form-input text-sm md:text-base">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label class="form-label">Phone</label>
              <input v-model="form.phone" type="text" class="form-input text-sm md:text-base" placeholder="012 345 678" />
            </div>

            <div class="md:col-span-2">
              <label class="form-label">Main Subject</label>
              <select v-model="form.subject" class="form-input text-sm md:text-base">
                <option value="">Select Subject</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-6 md:mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn text-sm md:text-base" @click="closeModal">Cancel</button>
            <button class="btn-primary btn text-sm md:text-base" @click="saveTeacher">
              {{ editingId ? 'Update Teacher' : 'Save Teacher' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal - Responsive -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 md:p-4"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white w-full max-w-md rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6">
        <div class="flex justify-center">
          <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-100 flex items-center justify-center">
            <TrashIcon class="w-7 h-7 md:w-8 md:h-8 text-red-500" />
          </div>
        </div>
        <div class="text-center mt-4 md:mt-5">
          <h3 class="text-lg md:text-xl font-bold text-gray-900">Delete Teacher</h3>
          <p class="text-xs md:text-sm text-gray-500 mt-2">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ deletingTeacher?.name }}</span>?
          </p>
          <p class="text-xs text-red-400 mt-1">This action cannot be undone.</p>
        </div>
        <div class="flex justify-center gap-3 mt-6 md:mt-8">
          <button class="btn-outline btn text-sm md:text-base" @click="closeDeleteModal">Cancel</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-xl font-semibold transition text-sm md:text-base" @click="deleteTeacher">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  UserGroupIcon,
  BookOpenIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  removeTeacher,
} from '../services/teacherService'

// Teachers
const teachers = ref([])

// Search & Filters
const search = ref('')
const filterGender = ref('')
const filterSubject = ref('')
const sortBy = ref('name')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modals
const showModal = ref(false)
const showDeleteModal = ref(false)
const deletingTeacher = ref(null)
const editingId = ref(null)

// Subjects
const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Khmer',
  'English',
  'History',
  'Geography',
  'Computer',
]

// Form
const form = ref({
  name: '',
  email: '',
  gender: 'Male',
  phone: '',
  subject: '',
})

// Computed - Active Count
const activeCount = computed(() => teachers.value.length)

// Computed - Filtered & Sorted Teachers
const filteredTeachers = computed(() => {
  let result = teachers.value.filter((t) => {
    const matchSearch = !search.value ||
      t.name.toLowerCase().includes(search.value.toLowerCase()) ||
      t.email.toLowerCase().includes(search.value.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.value.toLowerCase())
    
    const matchGender = !filterGender.value || t.gender === filterGender.value
    const matchSubject = !filterSubject.value || t.subject === filterSubject.value
    
    return matchSearch && matchGender && matchSubject
  })
  
  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'gender') return a.gender.localeCompare(b.gender)
    if (sortBy.value === 'subject') return a.subject.localeCompare(b.subject)
    return 0
  })
  
  return result
})

// Reset to page 1 when filters change
watch([search, filterGender, filterSubject, sortBy], () => {
  currentPage.value = 1
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(filteredTeachers.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredTeachers.value.length))
const paginatedTeachers = computed(() => filteredTeachers.value.slice(startIndex.value, endIndex.value))

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

// Reset Filters
const resetFilters = () => {
  search.value = ''
  filterGender.value = ''
  filterSubject.value = ''
  currentPage.value = 1
}

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

// Fetch Teachers
const fetchTeachers = async () => {
  try {
    const response = await getTeachers()
    teachers.value = response.data.map((t) => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      email: t.email,
      gender: t.gender,
      phone: t.phone,
      subject: t.main_subject || 'Not Assigned',
      initials: `${t.first_name?.[0] || ''}${t.last_name?.[0] || ''}`,
      color: t.gender === 'Female' ? '#ec4899' : '#6366f1',
      status: 'Active',
    }))
  } catch (error) {
    console.error('Failed to fetch teachers:', error)
  }
}

// Open Add Modal
const openAddModal = () => {
  editingId.value = null
  form.value = {
    name: '',
    email: '',
    gender: 'Male',
    phone: '',
    subject: '',
  }
  showModal.value = true
}

// Save Teacher
const saveTeacher = async () => {
  try {
    if (!form.value.name.trim()) {
      alert('Teacher name is required')
      return
    }

    if (!form.value.email.trim()) {
      alert('Email is required')
      return
    }

    const names = form.value.name.trim().split(' ')
    const payload = {
      first_name: names[0] || '',
      last_name: names.slice(1).join(' ') || 'Unknown',
      gender: form.value.gender,
      email: form.value.email.trim(),
      phone: form.value.phone.trim(),
      main_subject: form.value.subject || null,
    }

    if (editingId.value) {
      await updateTeacher(editingId.value, payload)
    } else {
      await createTeacher(payload)
    }

    await fetchTeachers()
    closeModal()
  } catch (error) {
    console.log('SERVER ERROR:', error.response?.data)
    alert(error.response?.data?.message || 'Failed to save teacher')
  }
}

// Edit
const editTeacher = (teacher) => {
  editingId.value = teacher.id
  form.value = {
    name: teacher.name,
    email: teacher.email,
    gender: teacher.gender,
    phone: teacher.phone,
    subject: teacher.subject,
  }
  showModal.value = true
}

// Open Delete Modal
const openDeleteModal = (teacher) => {
  deletingTeacher.value = teacher
  showDeleteModal.value = true
}

// Delete Teacher
const deleteTeacher = async () => {
  try {
    await removeTeacher(deletingTeacher.value.id)
    await fetchTeachers()
    closeDeleteModal()
  } catch (error) {
    console.error('Failed to delete teacher:', error)
    alert('Failed to delete teacher')
  }
}

// Close Modals
const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingTeacher.value = null
}

// Load
onMounted(() => {
  fetchTeachers()
})
</script>

<style scoped>
/* Custom breakpoint for extra small screens */
@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}

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
.badge-pink {
  background-color: #fce7f3;
  color: #9d174d;
}
.badge-indigo {
  background-color: #e0e7ff;
  color: #3730a3;
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