<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <UsersIcon class="w-6 h-6 text-indigo-500" />
          Students
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">
          Manage all enrolled students • Total: {{ students.length }}
        </p>
      </div>

      <!-- Add Button -->
      <button class="btn-primary btn gap-2" @click="openAddModal">
        <PlusIcon class="w-4 h-4" />
        Add Student
      </button>
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
              placeholder="Search by name or ID..."
            />
          </div>
        </div>

        <!-- Class Filter -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Class</label>
          <select v-model="filterClass" class="form-input py-2">
            <option value="">All</option>
            <option v-for="c in classList" :key="c.id" :value="c.name">
              {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="w-32">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
          <select v-model="filterStatus" class="form-input py-2">
            <option value="">All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="w-36">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Sort By</label>
          <select v-model="sortBy" class="form-input py-2">
            <option value="name">Name</option>
            <option value="sid">Student ID</option>
            <option value="class">Class</option>
            <option value="gpa">GPA</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <button
          v-if="search || filterClass || filterStatus"
          @click="resetFilters"
          class="text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-indigo-50 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">Total Students</p>
        <p class="text-2xl font-bold text-gray-800">{{ filtered.length }}</p>
      </div>
      <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">Active</p>
        <p class="text-2xl font-bold text-emerald-600">{{ activeCount }}</p>
      </div>
      <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">Classes</p>
        <p class="text-2xl font-bold text-indigo-600">{{ classCount }}</p>
      </div>
      <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">Avg GPA</p>
        <p class="text-2xl font-bold text-amber-600">{{ avgGPA }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="card card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gradient-to-r from-gray-50 to-indigo-50/30 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student ID</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Class</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">GPA</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Enrolled</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="s in paginatedStudents"
              :key="s.id"
              class="hover:bg-gray-50/80 transition group"
            >
              <!-- Student -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    :style="{ background: s.color }"
                  >
                    {{ s.initials }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ s.name }}</p>
                    <p class="text-xs text-gray-400">{{ s.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Student ID -->
              <td class="px-4 py-3">
                <code class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">
                  {{ s.sid }}
                </code>
              </td>

              <!-- Class -->
              <td class="px-4 py-3">
                <span class="badge-blue badge">{{ s.class }}</span>
              </td>

              <!-- GPA -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2 min-w-[140px]">
                  <span class="text-sm font-bold text-gray-800 w-8">{{ s.gpa.toFixed(1) }}</span>
                  <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :style="{
                        width: (s.gpa / 4 * 100) + '%',
                        background: gpaColor(s.gpa),
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    :class="gradeClass(s.grade)"
                  >
                    {{ s.grade }}
                  </span>
                </div>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="s.status === 'Active' ? 'badge-green' : 'badge-red'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1" :class="s.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ s.status }}
                </span>
              </td>

              <!-- Enrolled -->
              <td class="px-4 py-3 text-xs text-gray-500">
                {{ s.enrolled }}
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex justify-center gap-1.5">
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit"
                    @click="editStudent(s)"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                    @click="openDeleteModal(s)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="paginatedStudents.length === 0">
              <td colspan="7" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <UsersIcon class="w-8 h-8 text-gray-400" />
                  </div>
                  <p class="text-gray-500 font-medium">No students found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new student</p>
                  <button class="btn-primary btn mt-4" @click="openAddModal">
                    <PlusIcon class="w-4 h-4" />
                    Add Student
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filtered.length > 0" class="border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        <div class="text-xs text-gray-500">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filtered.length }} students
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
                {{ editingId ? 'Edit Student' : 'Add Student' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ editingId ? 'Update student information' : 'Fill in the details to add a new student' }}
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl" @click="closeModal">✕</button>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label required">Student Name</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Full name" />
            </div>

            <div>
              <label class="form-label required">Email</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="student@school.com" />
            </div>

            <div>
              <label class="form-label">Student ID</label>
              <input :value="generateStudentId()" type="text" class="form-input bg-gray-100" readonly />
            </div>

            <div>
              <label class="form-label">Enrollment Year</label>
              <input v-model="form.enrollYear" type="number" class="form-input" />
            </div>

            <div>
              <label class="form-label required">Class</label>
              <select v-model="form.class" class="form-input">
                <option value="">Select Class</option>
                <option v-for="c in classList" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">GPA (0-4)</label>
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
            <button class="btn-primary btn" @click="saveStudent">
              {{ editingId ? 'Update Student' : 'Save Student' }}
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
          <h3 class="text-xl font-bold text-gray-900">Delete Student</h3>
          <p class="text-sm text-gray-500 mt-2">
            Are you sure you want to delete
            <span class="font-semibold text-gray-800">{{ deletingStudent?.name }}</span>?
          </p>
          <p class="text-xs text-red-400 mt-1">This action cannot be undone.</p>
        </div>
        <div class="flex justify-center gap-3 mt-8">
          <button class="btn-outline btn" @click="closeDeleteModal">Cancel</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition" @click="deleteStudent">
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
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import {
  getStudents,
  createStudent,
  updateStudent,
  removeStudent,
} from '../services/studentService'

// Students
const students = ref([])

// Search & Filters
const search = ref('')
const filterClass = ref('')
const filterStatus = ref('')
const sortBy = ref('name')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Modals
const showModal = ref(false)
const showDeleteModal = ref(false)
const deletingStudent = ref(null)
const editingId = ref(null)

// Classes
const classList = [
  { id: 1, name: '7A' },
  { id: 2, name: '7B' },
  { id: 3, name: '7C' },
  { id: 4, name: '8A' },
  { id: 5, name: '8B' },
  { id: 6, name: '8C' },
  { id: 7, name: '9A' },
  { id: 8, name: '9B' },
]

// Form
const form = ref({
  name: '',
  email: '',
  enrollYear: new Date().getFullYear(),
  class: '',
  gpa: 0,
  status: 'Active',
})

// Computed - Filtered & Sorted Students
const filtered = computed(() => {
  let result = students.value.filter((s) => {
    const matchSearch = !search.value ||
      s.name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.sid.toLowerCase().includes(search.value.toLowerCase())
    
    const matchClass = !filterClass.value || s.class === filterClass.value
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    
    return matchSearch && matchClass && matchStatus
  })
  
  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'sid') return a.sid.localeCompare(b.sid)
    if (sortBy.value === 'class') return a.class.localeCompare(b.class)
    if (sortBy.value === 'gpa') return b.gpa - a.gpa
    return 0
  })
  
  return result
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filtered.value.length))
const paginatedStudents = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

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

// Stats
const activeCount = computed(() => students.value.filter(s => s.status === 'Active').length)
const classCount = computed(() => new Set(students.value.map(s => s.class)).size)
const avgGPA = computed(() => {
  if (students.value.length === 0) return '0.0'
  const sum = students.value.reduce((acc, s) => acc + s.gpa, 0)
  return (sum / students.value.length).toFixed(1)
})

// Generate Student ID
const generateStudentId = () => {
  const classCode = String(form.value.class || 0)
  const random = String(Math.floor(1000 + Math.random() * 9000))
  return `SB${form.value.enrollYear}${classCode}${random}`
}

// Fetch Students
const fetchStudents = async () => {
  try {
    const response = await getStudents()
    students.value = response.data.map((s) => ({
      id: s.id,
      name: `${s.first_name} ${s.last_name}`,
      email: s.email,
      sid: s.student_code,
      class: classList.find(c => c.id === s.class_id)?.name || 'N/A',
      gpa: Number(s.gpa),
      status: s.status,
      initials: `${s.first_name?.[0] || ''}${s.last_name?.[0] || ''}`,
      color: '#6366f1',
      grade: s.gpa >= 3.5 ? 'A' : s.gpa >= 3.0 ? 'B' : s.gpa >= 2.5 ? 'C' : 'F',
      enrolled: new Date().toISOString().split('T')[0],
    }))
  } catch (error) {
    console.log('SERVER ERROR:', error.response?.data)
    console.error(error)
  }
}

// Reset Filters
const resetFilters = () => {
  search.value = ''
  filterClass.value = ''
  filterStatus.value = ''
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

// Open Add Modal
const openAddModal = () => {
  editingId.value = null
  form.value = {
    name: '',
    email: '',
    enrollYear: new Date().getFullYear(),
    class: '',
    gpa: 0,
    status: 'Active',
  }
  showModal.value = true
}

// Save Student
const saveStudent = async () => {
  try {
    if (!form.value.name.trim()) {
      alert('Student name is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      alert('Please enter a valid email address')
      return
    }

    if (!form.value.class) {
      alert('Please select a class')
      return
    }

    if (form.value.gpa < 0 || form.value.gpa > 4) {
      alert('GPA must be between 0 and 4')
      return
    }

    const names = form.value.name.trim().split(' ')
    const payload = {
      student_code: generateStudentId(),
      first_name: names[0] || '',
      last_name: names.slice(1).join(' ') || '',
      gender: 'Male',
      email: form.value.email.trim(),
      phone: '000000000',
      address: 'Phnom Penh',
      class_id: Number(form.value.class),
      gpa: Number(form.value.gpa),
      status: form.value.status,
    }

    if (editingId.value) {
      await updateStudent(editingId.value, payload)
    } else {
      await createStudent(payload)
    }

    await fetchStudents()
    closeModal()
  } catch (error) {
    console.log('STUDENT ERROR:', error.response?.data)
    alert(error.response?.data?.message || 'Failed to save student')
    console.error(error)
  }
}

// Edit
const editStudent = (student) => {
  editingId.value = student.id
  const selectedClass = classList.find(c => c.name === student.class)
  form.value = {
    name: student.name,
    email: student.email,
    enrollYear: new Date().getFullYear(),
    class: selectedClass?.id || '',
    gpa: student.gpa,
    status: student.status,
  }
  showModal.value = true
}

// Open Delete Modal
const openDeleteModal = (student) => {
  deletingStudent.value = student
  showDeleteModal.value = true
}

// Delete Student
const deleteStudent = async () => {
  if (!deletingStudent.value) return
  try {
    await removeStudent(deletingStudent.value.id)
    await fetchStudents()
    closeDeleteModal()
  } catch (error) {
    console.error(error)
  }
}

// Close Modals
const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingStudent.value = null
}

// GPA Color
const gpaColor = (g) =>
  g >= 3.5 ? '#22c55e' : g >= 3.0 ? '#3b82f6' : g >= 2.5 ? '#f59e0b' : '#ef4444'

// Grade Badge
const gradeClass = (g) => ({
  A: 'badge-green',
  B: 'badge-blue',
  C: 'badge-amber',
  F: 'badge-red',
}[g] || 'badge-gray')

// Load
onMounted(() => {
  fetchStudents()
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
.badge-red {
  background-color: #fee2e2;
  color: #991b1b;
}
.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}
.badge-amber {
  background-color: #fef3c7;
  color: #92400e;
}
.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
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