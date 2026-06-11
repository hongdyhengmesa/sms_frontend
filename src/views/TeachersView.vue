<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <UserGroupIcon class="w-6 h-6 text-indigo-500" />
          Teachers
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Manage teacher information and subjects • Total: {{ teachers.length }}
        </p>
      </div>

      <!-- Add Teacher -->
      <button class="btn-primary btn gap-2" @click="openAddModal">
        <PlusIcon class="w-4 h-4" />
        Add Teacher
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Teachers</p>
          <UsersIcon class="w-4 h-4 text-gray-400" />
        </div>
        <h3 class="text-2xl font-extrabold text-gray-900 mt-1">{{ teachers.length }}</h3>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Male</p>
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
        </div>
        <h3 class="text-2xl font-extrabold text-blue-600 mt-1">
          {{ teachers.filter(t => t.gender === 'Male').length }}
        </h3>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Female</p>
          <span class="w-2 h-2 rounded-full bg-pink-500"></span>
        </div>
        <h3 class="text-2xl font-extrabold text-pink-600 mt-1">
          {{ teachers.filter(t => t.gender === 'Female').length }}
        </h3>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Subjects</p>
          <BookOpenIcon class="w-4 h-4 text-gray-400" />
        </div>
        <h3 class="text-2xl font-extrabold text-green-600 mt-1">{{ subjects.length }}</h3>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">Active</p>
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
        <h3 class="text-2xl font-extrabold text-emerald-600 mt-1">{{ activeCount }}</h3>
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
              placeholder="Search by name, email, or subject..."
            />
          </div>
        </div>

        <!-- Gender Filter -->
        <div class="w-32">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Gender</label>
          <select v-model="filterGender" class="form-input py-2">
            <option value="">All</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <!-- Subject Filter -->
        <div class="w-40">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Subject</label>
          <select v-model="filterSubject" class="form-input py-2">
            <option value="">All Subjects</option>
            <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
          <select v-model="sortBy" class="form-input py-2">
            <option value="name">Name</option>
            <option value="gender">Gender</option>
            <option value="subject">Subject</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <button
          v-if="search || filterGender || filterSubject"
          @click="resetFilters"
          class="text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-indigo-50 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card card-shadow overflow-hidden">
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
              <!-- Teacher -->
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

              <!-- Gender -->
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="t.gender === 'Male' ? 'badge-blue' : 'badge-pink'"
                >
                  {{ t.gender }}
                </span>
               </td>

              <!-- Subject -->
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="t.subject === 'Not Assigned' ? 'badge-gray' : 'badge-indigo'"
                >
                  {{ t.subject }}
                </span>
               </td>

              <!-- Phone -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <PhoneIcon class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-sm text-gray-600">{{ t.phone || '—' }}</span>
                </div>
               </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span class="badge-green badge">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                  {{ t.status }}
                </span>
               </td>

              <!-- Actions -->
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

            <!-- Empty State -->
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

      <!-- Pagination -->
      <div v-if="filteredTeachers.length > 0" class="border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        <div class="text-xs text-gray-500">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTeachers.length }} teachers
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
option>
          </select>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ editingId ? 'Edit Teacher' : 'Add Teacher' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ editingId ? 'Update teacher information' : 'Fill in the details to add a new teacher' }}
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl" @click="closeModal">✕</button>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label required">Teacher Name</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Full name" />
            </div>

            <div>
              <label class="form-label required">Email</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="teacher@school.com" />
            </div>

            <div>
              <label class="form-label">Gender</label>
              <select v-model="form.gender" class="form-input">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label class="form-label">Phone</label>
              <input v-model="form.phone" type="text" class="form-input" placeholder="012 345 678" />
            </div>

            <div>
              <label class="form-label">Main Subject</label>
              <select v-model="form.subject" class="form-input">
                <option value="">Select Subject</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn" @click="closeModal">Cancel</button>
            <button class="btn-primary btn" @click="saveTeacher">
              {{ editingId ? 'Update Teacher' : 'Save Teacher' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div class="flex justify-center">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <TrashIcon class="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div class="text-center mt-5">
          <h3 class="text-xl font-bold text-gray-900">Delete Teacher</h3>
          <p class="text-sm text-gray-500 mt-2">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ deletingTeacher?.name }}</span>?
          </p>
          <p class="text-xs text-red-400 mt-1">This action cannot be undone.</p>
        </div>
        <div class="flex justify-center gap-3 mt-8">
          <button class="btn-outline btn" @click="closeDeleteModal">Cancel</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition" @click="deleteTeacher">
            Delete
          </button>
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
const itemsPerPage = ref(20)

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