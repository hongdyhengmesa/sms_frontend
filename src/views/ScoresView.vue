<template>
  <div class="space-y-6">
    <!-- Custom Alert Modal -->
    <div v-if="alertModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn" @click.self="closeAlertModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md transform animate-slideUp">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center" 
              :class="alertModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'">
              <svg v-if="alertModal.type === 'success'" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ alertModal.title }}</h3>
          <p class="text-gray-500">{{ alertModal.message }}</p>
        </div>
        <div class="flex justify-center mt-6">
          <button class="px-6 py-2 rounded-xl font-semibold transition-all" 
            :class="alertModal.type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'"
            @click="closeAlertModal">
            Got it
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Score Management
        </h2>
        <p class="text-gray-500 mt-1">Record and manage student academic scores</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Hidden CSV Import -->
        <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="importCSV" />

        <!-- Import CSV -->
        <button class="btn-outline btn gap-2" @click="csvInput.click()">
          <ArrowUpTrayIcon class="w-4 h-4" />
          Import CSV
        </button>

        <!-- Export by Class Dropdown -->
        <div class="relative">
          <button
            class="btn-primary btn gap-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            @click="showExportMenu = !showExportMenu"
          >
            <ArrowDownTrayIcon class="w-4 h-4" />
            Export by Class
          </button>

          <!-- Export Menu -->
          <div v-if="showExportMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 animate-fadeIn">
            <div class="max-h-80 overflow-y-auto">
              <div class="p-2">
                <button
                  v-for="c in classList"
                  :key="c"
                  @click="exportByClass(c)"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 transition-colors rounded-lg flex items-center justify-between"
                >
                  <span class="font-semibold">{{ c }}</span>
                  <span class="text-xs text-gray-400">{{ getClassCount(c) }} students</span>
                </button>
              </div>
              <div class="border-t border-gray-100"></div>
              <div class="p-2">
                <button
                  @click="exportAllClasses"
                  class="w-full px-3 py-2 text-left text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors rounded-lg"
                >
                  📋 Export All Classes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add -->
        <button class="btn-primary btn gap-2 shadow-lg hover:shadow-xl transition-all" @click="openAddModal">
          <PlusIcon class="w-4 h-4" />
          Add Score
        </button>
      </div>
    </div>

    <!-- Class Filter Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <div
        v-for="c in classList"
        :key="c"
        @click="selectedClass = c"
        class="bg-white rounded-2xl border p-3 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
        :class="selectedClass === c ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md' : 'border-gray-100 hover:border-indigo-200'"
      >
        <h3 class="text-lg font-black text-gray-800">{{ c }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ getClassCount(c) }} Students</p>
      </div>
    </div>

    <!-- Stats & Filters -->
    <div class="flex flex-col md:flex-row gap-3 items-center">
      <div class="relative flex-1">
        <input
          v-model="search"
          type="text"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
          placeholder="Search student by name..."
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div class="flex gap-3">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-2">
          <p class="text-xs text-blue-600 font-semibold">TOTAL</p>
          <p class="text-2xl font-black text-blue-700">{{ filtered.length }}</p>
        </div>
        
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl px-4 py-2">
          <p class="text-xs text-green-600 font-semibold">AVERAGE</p>
          <p class="text-2xl font-black text-green-700">{{ calculateOverallAverage() }}%</p>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl px-4 py-2">
          <p class="text-xs text-purple-600 font-semibold">PASS RATE</p>
          <p class="text-2xl font-black text-purple-700">{{ calculatePassRate() }}%</p>
        </div>

        <button v-if="selectedClass" class="btn-outline btn" @click="selectedClass = ''">
          Clear Filter
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-500 uppercase text-xs sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">Student</th>
              <th class="px-4 py-3 text-left">Class</th>
              <th class="px-4 py-3 text-left">Gender</th>
              <th class="px-4 py-3 text-left">Math</th>
              <th class="px-4 py-3 text-left">Khmer</th>
              <th class="px-4 py-3 text-left">Physics</th>
              <th class="px-4 py-3 text-left">Chemistry</th>
              <th class="px-4 py-3 text-left">Biology</th>
              <th class="px-4 py-3 text-left">Geography</th>
              <th class="px-4 py-3 text-left">History</th>
              <th class="px-4 py-3 text-left">English</th>
              <th class="px-4 py-3 text-left">Total</th>
              <th class="px-4 py-3 text-left">Average</th>
              <th class="px-4 py-3 text-left">Grade</th>
              <th class="px-4 py-3 text-left">Rank</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sc, index) in paginatedScores"
              :key="sc.id"
              class="border-t border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-200"
            >
              <td class="px-4 py-3 font-medium text-gray-500">{{ startIndex + index + 1 }}</td>
              <td class="px-4 py-3 font-semibold text-gray-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {{ sc.name.charAt(0) }}
                  </div>
                  {{ sc.name }}
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{{ sc.class }}</span>
              </td>
              <td class="px-4 py-3">
                <span :class="sc.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'">{{ sc.gender }}</span>
              </td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.math, 100)">{{ sc.math }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.khmer, 100)">{{ sc.khmer }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.physics, 50)">{{ sc.physics }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.chemistry, 50)">{{ sc.chemistry }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.biology, 50)">{{ sc.biology }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.geography, 50)">{{ sc.geography }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.history, 50)">{{ sc.history }}</td>
              <td class="px-4 py-3 font-medium" :class="getScoreColor(sc.english, 50)">{{ sc.english }}</td>
              <td class="px-4 py-3 font-bold text-gray-900">{{ sc.total }}</td>
              <td class="px-4 py-3 font-bold" :class="getAverageColor(sc.average)">{{ sc.average }}%</td>
              <td class="px-4 py-3">
                <span class="px-3 py-1 rounded-full text-xs font-bold shadow-sm" :class="gradeClass(sc.grade)">
                  {{ sc.grade }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 font-bold">
                  <span v-if="sc.rank === 1" class="text-yellow-500">🥇</span>
                  <span v-else-if="sc.rank === 2" class="text-gray-400">🥈</span>
                  <span v-else-if="sc.rank === 3" class="text-amber-600">🥉</span>
                  {{ sc.rank }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button class="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition group" @click="editScore(sc)">
                    <PencilSquareIcon class="w-4 h-4 text-indigo-600 group-hover:scale-110 transition" />
                  </button>
                  <button class="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center hover:bg-red-600 transition group shadow-sm" @click="openDeleteModal(sc.id)">
                    <TrashIcon class="w-4 h-4 text-white group-hover:scale-110 transition" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filtered.length === 0">
              <td colspan="17" class="text-center py-16">
                <div class="text-gray-400">
                  <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-lg font-semibold">No students found</p>
                  <p class="text-sm">Try adjusting your search or filter</p>
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
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h3 class="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {{ editingId ? 'Edit Score' : 'Add Score' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">Fill in the details to {{ editingId ? 'update' : 'add' }} student scores</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-2xl hover:rotate-90 transition-transform duration-200" @click="closeModal">✕</button>
          </div>

          <!-- Preview Card -->
          <div v-if="form.name && form.class" class="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xs text-gray-500">Preview</p>
                <p class="text-lg font-bold text-gray-800">{{ form.name }} - {{ form.class }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">Calculated Average</p>
                <p class="text-2xl font-bold" :class="getAverageColor(calculatePreviewAverage())">
                  {{ calculatePreviewAverage() }}%
                </p>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold" :class="gradeClass(calculatePreviewGrade())">
                  {{ calculatePreviewGrade() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="form-label font-semibold required">Student Name</label>
              <input v-model="form.name" type="text" class="form-input" :class="{'border-red-500': formErrors.name}" placeholder="Enter student name" @blur="validateField('name')" />
              <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
            </div>

            <div>
              <label class="form-label font-semibold required">Class</label>
              <select v-model="form.class" class="form-input" :class="{'border-red-500': formErrors.class}" @change="validateField('class')">
                <option value="">Select Class</option>
                <option v-for="c in classList" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="formErrors.class" class="text-xs text-red-500 mt-1">{{ formErrors.class }}</p>
            </div>

            <div>
              <label class="form-label font-semibold required">Gender</label>
              <select v-model="form.gender" class="form-input" :class="{'border-red-500': formErrors.gender}" @change="validateField('gender')">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <p v-if="formErrors.gender" class="text-xs text-red-500 mt-1">{{ formErrors.gender }}</p>
            </div>

            <!-- Math -->
            <div>
              <label class="form-label font-semibold required">Mathematics (0-100)</label>
              <input v-model.number="form.math" type="number" min="0" max="100" class="form-input" :class="{'border-red-500': formErrors.math}" @input="validateField('math')" />
              <p v-if="formErrors.math" class="text-xs text-red-500 mt-1">{{ formErrors.math }}</p>
            </div>

            <!-- Khmer -->
            <div>
              <label class="form-label font-semibold required">Khmer (0-100)</label>
              <input v-model.number="form.khmer" type="number" min="0" max="100" class="form-input" :class="{'border-red-500': formErrors.khmer}" @input="validateField('khmer')" />
              <p v-if="formErrors.khmer" class="text-xs text-red-500 mt-1">{{ formErrors.khmer }}</p>
            </div>

            <!-- Physics -->
            <div>
              <label class="form-label font-semibold required">Physics (0-50)</label>
              <input v-model.number="form.physics" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.physics}" @input="validateField('physics')" />
              <p v-if="formErrors.physics" class="text-xs text-red-500 mt-1">{{ formErrors.physics }}</p>
            </div>

            <!-- Chemistry -->
            <div>
              <label class="form-label font-semibold required">Chemistry (0-50)</label>
              <input v-model.number="form.chemistry" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.chemistry}" @input="validateField('chemistry')" />
              <p v-if="formErrors.chemistry" class="text-xs text-red-500 mt-1">{{ formErrors.chemistry }}</p>
            </div>

            <!-- Biology -->
            <div>
              <label class="form-label font-semibold required">Biology (0-50)</label>
              <input v-model.number="form.biology" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.biology}" @input="validateField('biology')" />
              <p v-if="formErrors.biology" class="text-xs text-red-500 mt-1">{{ formErrors.biology }}</p>
            </div>

            <!-- Geography -->
            <div>
              <label class="form-label font-semibold required">Geography (0-50)</label>
              <input v-model.number="form.geography" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.geography}" @input="validateField('geography')" />
              <p v-if="formErrors.geography" class="text-xs text-red-500 mt-1">{{ formErrors.geography }}</p>
            </div>

            <!-- History -->
            <div>
              <label class="form-label font-semibold required">History (0-50)</label>
              <input v-model.number="form.history" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.history}" @input="validateField('history')" />
              <p v-if="formErrors.history" class="text-xs text-red-500 mt-1">{{ formErrors.history }}</p>
            </div>

            <!-- English -->
            <div>
              <label class="form-label font-semibold required">English (0-50)</label>
              <input v-model.number="form.english" type="number" min="0" max="50" class="form-input" :class="{'border-red-500': formErrors.english}" @input="validateField('english')" />
              <p v-if="formErrors.english" class="text-xs text-red-500 mt-1">{{ formErrors.english }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn px-6" @click="closeModal">Cancel</button>
            <button class="btn-primary btn px-6 shadow-lg" @click="addScore">
              {{ editingId ? 'Update Score' : 'Save Score' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn" @click.self="closeDeleteModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md transform animate-slideUp">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <TrashIcon class="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h3 class="text-2xl font-black text-gray-900">Delete Score</h3>
          <p class="text-gray-500 mt-2">
            Are you sure you want to delete this score?
            <br />
            <span class="text-red-500 text-sm">This action cannot be undone.</span>
          </p>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button class="btn-outline btn" @click="closeDeleteModal">Cancel</button>
          <button class="btn bg-red-500 text-white hover:bg-red-600 shadow-md" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import {
  getScores,
  createScore,
  updateScore,
  removeScore,
} from '../services/scoreService'

// Alert Modal State
const alertModal = ref({
  show: false,
  type: 'success', // 'success' or 'error'
  title: '',
  message: ''
})

const showAlertModal = (type, title, message) => {
  alertModal.value = {
    show: true,
    type,
    title,
    message
  }
}

const closeAlertModal = () => {
  alertModal.value.show = false
}

// Data
const scores = ref([])
const search = ref('')
const selectedClass = ref('')
const showModal = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deletingId = ref(null)
const csvInput = ref(null)
const loading = ref(false)
const showExportMenu = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Class list
const classList = ['7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B']

// Reset page when filters change
watch([search, selectedClass], () => {
  currentPage.value = 1
})

// Form errors
const formErrors = ref({
  name: '',
  class: '',
  gender: '',
  math: '',
  khmer: '',
  physics: '',
  chemistry: '',
  biology: '',
  geography: '',
  history: '',
  english: ''
})

// Form
const form = ref({
  name: '',
  class: '',
  gender: '',
  math: 0,
  khmer: 0,
  physics: 0,
  chemistry: 0,
  biology: 0,
  geography: 0,
  history: 0,
  english: 0,
})

// Fetch Scores
const fetchScores = async () => {
  try {
    loading.value = true
    const response = await getScores()
    const fetchedScores = response.data.map((s) => ({
      id: s.id,
      name: s.student_name,
      class: s.class_name,
      gender: s.gender,
      math: Number(s.math),
      khmer: Number(s.khmer),
      physics: Number(s.physics),
      chemistry: Number(s.chemistry),
      biology: Number(s.biology),
      geography: Number(s.geography),
      history: Number(s.history),
      english: Number(s.english),
      total: Number(s.total),
      average: Number(s.average),
      grade: s.grade,
      rank: s.rank,
    }))
    scores.value = fetchedScores
    calculateRanks()
  } catch (error) {
    console.error('Fetch Error:', error)
    showAlertModal('error', 'Error', 'Failed to load scores')
  } finally {
    loading.value = false
  }
}

// Calculate ranks for filtered scores
const calculateRanks = () => {
  const sorted = [...scores.value].sort((a, b) => b.average - a.average)
  sorted.forEach((student, index) => {
    student.rank = index + 1
  })
}

// Computed - Filtered & Sorted
const filtered = computed(() => {
  let result = scores.value.filter((s) => {
    const matchSearch = !search.value || s.name.toLowerCase().includes(search.value.toLowerCase())
    const matchClass = !selectedClass.value || s.class === selectedClass.value
    return matchSearch && matchClass
  })
  
  result.sort((a, b) => a.rank - b.rank)
  return result
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filtered.value.length))
const paginatedScores = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

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

// Get class count
const getClassCount = (className) => {
  return scores.value.filter(s => s.class === className).length
}

// Validation
const validateField = (field) => {
  switch(field) {
    case 'name':
      if (!form.value.name.trim()) formErrors.value.name = 'Student name is required'
      else if (form.value.name.length < 2) formErrors.value.name = 'Name must be at least 2 characters'
      else formErrors.value.name = ''
      break
    case 'class':
      if (!form.value.class) formErrors.value.class = 'Class is required'
      else formErrors.value.class = ''
      break
    case 'gender':
      if (!form.value.gender) formErrors.value.gender = 'Gender is required'
      else formErrors.value.gender = ''
      break
    case 'math':
      if (form.value.math < 0 || form.value.math > 100) formErrors.value.math = 'Math score must be between 0 and 100'
      else formErrors.value.math = ''
      break
    case 'khmer':
      if (form.value.khmer < 0 || form.value.khmer > 100) formErrors.value.khmer = 'Khmer score must be between 0 and 100'
      else formErrors.value.khmer = ''
      break
    case 'physics':
    case 'chemistry':
    case 'biology':
    case 'geography':
    case 'history':
    case 'english':
      if (form.value[field] < 0 || form.value[field] > 50) {
        formErrors.value[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} score must be between 0 and 50`
      } else {
        formErrors.value[field] = ''
      }
      break
  }
}

const validateScores = () => {
  let isValid = true
  const fields = ['name', 'class', 'gender', 'math', 'khmer', 'physics', 'chemistry', 'biology', 'geography', 'history', 'english']
  for (const field of fields) {
    validateField(field)
    if (formErrors.value[field]) isValid = false
  }
  return isValid
}

// Add/Update Score
const addScore = async () => {
  try {
    if (!validateScores()) {
      showAlertModal('error', 'Validation Error', 'Please fix the validation errors before submitting')
      return
    }

    const payload = {
      student_name: form.value.name,
      class_name: form.value.class,
      gender: form.value.gender,
      math: Number(form.value.math),
      khmer: Number(form.value.khmer),
      physics: Number(form.value.physics),
      chemistry: Number(form.value.chemistry),
      biology: Number(form.value.biology),
      geography: Number(form.value.geography),
      history: Number(form.value.history),
      english: Number(form.value.english),
    }

    if (editingId.value) {
      await updateScore(editingId.value, payload)
      showAlertModal('success', 'Success', 'Score updated successfully!')
    } else {
      await createScore(payload)
      showAlertModal('success', 'Success', 'Score added successfully!')
    }
    await fetchScores()
    closeModal()
  } catch (error) {
    console.error('Save Error:', error)
    showAlertModal('error', 'Error', 'Failed to save score')
  }
}

// Calculations
const calculateOverallAverage = () => {
  if (filtered.value.length === 0) return 0
  const sum = filtered.value.reduce((acc, s) => acc + s.average, 0)
  return Math.round(sum / filtered.value.length)
}

const calculatePassRate = () => {
  if (filtered.value.length === 0) return 0
  const passed = filtered.value.filter(s => s.average >= 60).length
  return Math.round((passed / filtered.value.length) * 100)
}

const calculatePreviewTotal = () => {
  const math = form.value.math || 0
  const khmer = form.value.khmer || 0
  const physics = form.value.physics || 0
  const chemistry = form.value.chemistry || 0
  const biology = form.value.biology || 0
  const geography = form.value.geography || 0
  const history = form.value.history || 0
  const english = form.value.english || 0
  return math + khmer + physics + chemistry + biology + geography + history + english
}

const calculatePreviewAverage = () => {
  const total = calculatePreviewTotal()
  const maxScore = 500
  return Math.round((total / maxScore) * 100)
}

const calculatePreviewGrade = () => {
  const avg = calculatePreviewAverage()
  if (avg >= 90) return 'A'
  if (avg >= 80) return 'B'
  if (avg >= 70) return 'C'
  if (avg >= 60) return 'D'
  return 'F'
}

// Export Functions
const downloadCSV = (data, filename) => {
  const headers = ['Student Name', 'Class', 'Gender', 'Math', 'Khmer', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'English', 'Total', 'Average (%)', 'Grade', 'Rank']
  const rows = data.map(student => [
    student.name, student.class, student.gender, student.math, student.khmer,
    student.physics, student.chemistry, student.biology, student.geography,
    student.history, student.english, student.total, student.average, student.grade, student.rank
  ])
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportByClass = (className) => {
  const students = scores.value.filter(s => s.class === className)
  if (students.length === 0) {
    showAlertModal('error', 'No Data', `No students found in class ${className}`)
    return
  }
  const filename = `scores_${className}_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(students, filename)
  showExportMenu.value = false
  showAlertModal('success', 'Export Complete', `Exported ${students.length} students from class ${className}`)
}

const exportAllClasses = () => {
  let totalExported = 0
  for (const className of classList) {
    const students = scores.value.filter(s => s.class === className)
    if (students.length > 0) {
      const filename = `scores_${className}_${new Date().toISOString().split('T')[0]}.csv`
      downloadCSV(students, filename)
      totalExported += students.length
    }
  }
  showExportMenu.value = false
  showAlertModal('success', 'Export Complete', `Exported ${totalExported} students from all classes`)
}

// CSV Import
const importCSV = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.name.endsWith('.csv')) {
    showAlertModal('error', 'Invalid File', 'Please upload a CSV file')
    return
  }

  try {
    const text = await file.text()
    const lines = text.split('\n')
    let imported = 0
    let errors = 0
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(',')
      if (values.length >= 11) {
        const payload = {
          student_name: values[0]?.trim(),
          class_name: values[1]?.trim(),
          gender: values[2]?.trim(),
          math: Number(values[3]) || 0,
          khmer: Number(values[4]) || 0,
          physics: Number(values[5]) || 0,
          chemistry: Number(values[6]) || 0,
          biology: Number(values[7]) || 0,
          geography: Number(values[8]) || 0,
          history: Number(values[9]) || 0,
          english: Number(values[10]) || 0,
        }
        
        if (payload.student_name && payload.class_name) {
          await createScore(payload)
          imported++
        } else {
          errors++
        }
      }
    }
    
    await fetchScores()
    showAlertModal('success', 'Import Complete', `Imported ${imported} student records successfully!${errors > 0 ? ` (${errors} skipped)` : ''}`)
  } catch (error) {
    console.error('CSV Import Error:', error)
    showAlertModal('error', 'Import Failed', 'Failed to import CSV file')
  } finally {
    event.target.value = ''
  }
}

// Modal Functions
const openAddModal = () => {
  editingId.value = null
  form.value = { name: '', class: '', gender: '', math: 0, khmer: 0, physics: 0, chemistry: 0, biology: 0, geography: 0, history: 0, english: 0 }
  Object.keys(formErrors.value).forEach(key => formErrors.value[key] = '')
  showModal.value = true
}

const editScore = (student) => {
  editingId.value = student.id
  form.value = {
    name: student.name,
    class: student.class,
    gender: student.gender,
    math: student.math,
    khmer: student.khmer,
    physics: student.physics,
    chemistry: student.chemistry,
    biology: student.biology,
    geography: student.geography,
    history: student.history,
    english: student.english,
  }
  Object.keys(formErrors.value).forEach(key => formErrors.value[key] = '')
  showModal.value = true
}

const closeModal = () => {
  editingId.value = null
  showModal.value = false
}

const openDeleteModal = (id) => {
  deletingId.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await removeScore(deletingId.value)
    await fetchScores()
    showAlertModal('success', 'Deleted', 'Score deleted successfully!')
    closeDeleteModal()
  } catch (error) {
    console.error('Delete Error:', error)
    showAlertModal('error', 'Error', 'Failed to delete score')
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingId.value = null
}

// UI Helpers
const getScoreColor = (score, max) => {
  const percentage = (score / max) * 100
  if (percentage >= 80) return 'text-green-600 font-bold'
  if (percentage >= 60) return 'text-blue-600'
  if (percentage >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

const getAverageColor = (average) => {
  if (average >= 80) return 'text-green-600 font-bold'
  if (average >= 60) return 'text-blue-600'
  if (average >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

const gradeClass = (grade) => ({
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
}[grade] || 'bg-gray-100 text-gray-700')

// Lifecycle
onMounted(() => {
  fetchScores()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
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
  box-shadow: 0 0 0 2px #e0e7ff;
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

.btn {
  cursor: pointer;
}
</style>