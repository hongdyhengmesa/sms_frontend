<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-slate-700 font-medium">Loading...</span>
        </div>
      </div>

      <!-- Header with stats cards -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
        <div class="relative">
          <div class="absolute -top-4 -left-4 w-20 h-20 md:w-24 md:h-24 bg-indigo-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div class="flex items-center gap-2 md:gap-3">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-clipboard-list text-white text-base md:text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Attendance Management
              </h1>
              <p class="text-slate-500 text-xs md:text-sm mt-0.5 flex items-center gap-2">
                <i class="fas fa-chart-line text-indigo-400 text-xs"></i>
                Real-time tracking & reporting
              </p>
            </div>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="flex gap-2 flex-wrap">
          <div class="bg-white rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
            <p class="text-[10px] md:text-xs text-slate-500 font-medium">Total</p>
            <p class="text-lg md:text-2xl font-bold text-slate-700">{{ totalStudentsCount }}</p>
          </div>
          <div class="bg-white rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
            <p class="text-[10px] md:text-xs text-slate-500 font-medium">Present</p>
            <p class="text-lg md:text-2xl font-bold text-emerald-600">{{ presentCount }}</p>
          </div>
          <div class="bg-white rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
            <p class="text-[10px] md:text-xs text-slate-500 font-medium">Late</p>
            <p class="text-lg md:text-2xl font-bold text-amber-600">{{ lateCount }}</p>
          </div>
          <div class="bg-white rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
            <p class="text-[10px] md:text-xs text-slate-500 font-medium">Absent</p>
            <p class="text-lg md:text-2xl font-bold text-rose-500">{{ absentCount }}</p>
          </div>
        </div>
      </div>

      <!-- Class Grid View -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center justify-between mb-3 md:mb-4">
          <h2 class="text-xs md:text-sm font-semibold text-slate-600">
            <i class="fas fa-layer-group text-indigo-500 mr-1 md:mr-2"></i>
            Select Class
          </h2>
          <span class="text-[10px] md:text-xs text-slate-400 bg-slate-100 px-2 py-0.5 md:py-1 rounded-full">{{ classOptions.length }} classes</span>
        </div>
        
        <!-- Class Grid Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
          <button
            v-for="classItem in classOptions"
            :key="classItem.id"
            @click="selectClass(classItem.id)"
            :class="[
              currentClassId === classItem.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300' 
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md hover:scale-105',
              'transition-all duration-300 rounded-lg md:rounded-xl p-2 md:p-4 text-center border border-slate-200 group'
            ]"
          >
            <i class="fas fa-graduation-cap text-xl md:text-2xl mb-1 md:mb-2 block" :class="currentClassId === classItem.id ? 'text-white' : 'text-indigo-500 group-hover:text-indigo-600'"></i>
            <div class="font-bold text-sm md:text-base lg:text-lg">{{ classItem.name }}</div>
            <div class="text-[10px] md:text-xs mt-0.5 md:mt-1" :class="currentClassId === classItem.id ? 'text-white/80' : 'text-slate-500'">
              {{ classStudentCounts[classItem.id] || 0 }} students
            </div>
          </button>
        </div>
      </div>

      <!-- Current Class Banner -->
      <div class="mb-4 md:mb-6">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg md:rounded-xl p-3 md:p-4 text-white shadow-lg">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <i class="fas fa-chalkboard text-white text-base md:text-lg"></i>
              </div>
              <div>
                <p class="text-white/70 text-[10px] md:text-xs">Currently viewing</p>
                <p class="font-bold text-base md:text-xl">{{ currentClassName || 'Select a class' }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 md:gap-2">
              <div class="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-sm flex items-center gap-0.5 md:gap-1">
                <i class="fas fa-users"></i> {{ students.length }} Students
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-sm flex items-center gap-0.5 md:gap-1">
                <i class="fas fa-chart-line"></i> {{ gradeAttendanceRate }}% Rate
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-sm flex items-center gap-0.5 md:gap-1">
                <i class="fas fa-check-circle"></i> {{ gradePresentCount }} Present
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Panel -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-3 md:p-5 mb-4 md:mb-6 border border-slate-100 transition-all hover:shadow-xl">
        <div class="flex flex-col lg:flex-row gap-3 md:gap-4 justify-between items-end">
          <div class="flex flex-wrap items-end gap-2 md:gap-3 flex-1">
            <!-- Add Student Button -->
            <button 
              @click="openAddStudentModal" 
              class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 md:gap-2 transform hover:scale-105 text-xs md:text-sm"
            >
              <i class="fas fa-plus-circle"></i> Add Student
            </button>
            <button 
              @click="resetCurrentClassAttendance" 
              class="border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl flex items-center gap-1 md:gap-2 transition-all duration-300 hover:shadow-md text-xs md:text-sm"
            >
              <i class="fas fa-undo-alt"></i> Reset
            </button>
            <div class="relative w-36 md:w-48 group">
              <i class="fas fa-search absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm group-focus-within:text-indigo-500 transition-colors"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search..." 
                class="pl-8 md:pl-9 pr-2 md:pr-3 py-1.5 md:py-2.5 w-full rounded-lg md:rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm md:text-base"
              >
            </div>
          </div>
          <button 
            @click="exportAttendanceToExcel" 
            class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 md:gap-2 transform hover:scale-105 text-xs md:text-sm"
          >
            <i class="fas fa-file-excel"></i> Export
          </button>
        </div>
      </div>

      <!-- Date & Quick Actions -->
      <div class="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div class="flex items-center gap-2 md:gap-4 bg-white p-1.5 md:p-2 pl-2 md:pl-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100">
          <i class="fas fa-calendar-alt text-indigo-500 text-base md:text-lg"></i>
          <span class="text-xs md:text-sm font-semibold text-slate-600">Date:</span>
          <input 
            type="date" 
            v-model="attendanceDate" 
            @change="loadAttendance" 
            class="border border-slate-200 rounded-lg px-2 md:px-3 py-1 text-xs md:text-sm bg-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          >
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="bg-amber-50 px-2 md:px-4 py-1 md:py-2 rounded-full text-amber-700 text-[10px] md:text-sm flex items-center gap-1 md:gap-2 shadow-inner">
            <i class="fas fa-clock animate-pulse"></i> Late after <strong>09:00 AM</strong>
          </div>
          <button 
            v-if="students.length > 0"
            @click="markAllPresentInClass" 
            class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1 font-medium transition-all duration-300 hover:shadow-md"
          >
            <i class="fas fa-check-double"></i> Mark All Present
          </button>
        </div>
      </div>

      <!-- Alert Toast -->
      <Transition name="slide-down">
        <div 
          v-if="alertMessage" 
          class="mb-4 md:mb-5 p-3 md:p-4 rounded-lg md:rounded-xl shadow-lg flex justify-between items-center backdrop-blur-sm text-sm md:text-base" 
          :class="alertType === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800' : 'bg-amber-50 border-l-4 border-amber-500 text-amber-800'"
        >
          <div class="flex items-center gap-2 md:gap-3">
            <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center" :class="alertType === 'success' ? 'bg-emerald-200' : 'bg-amber-200'">
              <i :class="alertType === 'success' ? 'fas fa-check-circle text-emerald-600' : 'fas fa-exclamation-triangle text-amber-600'"></i>
            </div>
            <span class="font-medium">{{ alertMessage }}</span>
          </div>
          <button @click="alertMessage = null" class="text-slate-400 hover:text-slate-600 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </Transition>

      <!-- Data Table Section -->
      <div class="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <!-- Empty State -->
        <div v-if="students.length === 0" class="text-center py-10 md:py-16">
          <div class="flex flex-col items-center justify-center">
            <div class="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-3 md:mb-4 animate-bounce">
              <i class="fas fa-user-graduate text-3xl md:text-5xl text-slate-400"></i>
            </div>
            <h3 class="text-base md:text-xl font-semibold text-slate-700 mb-1 md:mb-2">No Students Yet</h3>
            <p class="text-xs md:text-sm text-slate-500 mb-3 md:mb-4">This class doesn't have any students enrolled.</p>
            <div class="text-[11px] md:text-sm text-slate-400 bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg">
              <i class="fas fa-info-circle mr-1 text-indigo-500"></i>
              Use the "Add Student" button to get started
            </div>
          </div>
        </div>
        
        <!-- Table Content -->
        <div v-else>
          <!-- Table Header -->
          <div class="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-200">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-3">
              <div class="flex flex-wrap items-center gap-2 md:gap-4">
                <div class="flex items-center gap-1 md:gap-2">
                  <i class="fas fa-table text-indigo-500 text-xs md:text-sm"></i>
                  <span class="text-xs md:text-sm font-semibold text-slate-700">Student List</span>
                </div>
                <div class="hidden sm:block h-3 md:h-4 w-px bg-slate-300"></div>
                <div class="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-slate-500">
                  <i class="fas fa-users text-xs"></i>
                  <span>{{ filteredStudents.length }} of {{ students.length }} students</span>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-1.5 md:gap-2">
                <div class="flex items-center gap-0.5 md:gap-1">
                  <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-[10px] md:text-xs text-slate-500">Present: {{ gradePresentCount }}</span>
                </div>
                <div class="flex items-center gap-0.5 md:gap-1">
                  <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500"></span>
                  <span class="text-[10px] md:text-xs text-slate-500">Late: {{ gradeLateCount }}</span>
                </div>
                <div class="flex items-center gap-0.5 md:gap-1">
                  <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500"></span>
                  <span class="text-[10px] md:text-xs text-slate-500">Absent: {{ gradeAbsentCount }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-[800px] md:min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-3 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in Time</th>
                  <th class="px-2 md:px-6 py-2 md:py-4 text-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="(student, idx) in filteredStudents" 
                  :key="student.id" 
                  class="hover:bg-slate-50/80 transition-all duration-200 group"
                >
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-[11px] md:text-sm font-mono text-slate-500">{{ idx + 1 }}</td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span class="font-mono text-[10px] md:text-xs bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-slate-600">{{ truncateText(student.student_code, 12) }}</span>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 md:gap-3">
                      <div class="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs md:text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {{ student.full_name.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-semibold text-slate-700 text-xs md:text-sm">{{ truncateText(student.full_name, 20) }}</span>
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span class="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-semibold">
                      <i class="fas fa-graduation-cap text-[8px] md:text-xs"></i>
                      {{ currentClassName }}
                    </span>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span 
                      v-if="student.status === 'present'" 
                      class="inline-flex items-center gap-1 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 shadow-sm"
                    >
                      <i class="fas fa-check-circle text-[8px] md:text-xs"></i> Present
                    </span>
                    <span 
                      v-else-if="student.status === 'late'" 
                      class="inline-flex items-center gap-1 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-amber-100 text-amber-700"
                    >
                      <i class="fas fa-clock text-[8px] md:text-xs"></i> Late
                    </span>
                    <span 
                      v-else 
                      class="inline-flex items-center gap-1 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold bg-rose-100 text-rose-600"
                    >
                      <i class="fas fa-user-slash text-[8px] md:text-xs"></i> Absent
                    </span>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-[10px] md:text-sm font-mono text-slate-500">
                    {{ student.checkInTime || '—' }}
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-center">
                    <div class="flex justify-center gap-1 md:gap-2">
                      <button 
                        v-if="student.status !== 'present'"
                        @click="markPresent(student.id)" 
                        class="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-0.5 md:gap-1 shadow-sm transition-all duration-300 hover:scale-105"
                        title="Mark Present"
                      >
                        <i class="fas fa-fingerprint"></i>
                        <span class="hidden sm:inline">Present</span>
                      </button>
                      <button 
                        v-if="student.status !== 'late'"
                        @click="markLate(student.id)" 
                        class="bg-amber-500 hover:bg-amber-600 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-0.5 md:gap-1 transition-all duration-300 hover:scale-105"
                        title="Mark Late"
                      >
                        <i class="fas fa-hourglass-half"></i>
                        <span class="hidden sm:inline">Late</span>
                      </button>
                      <button 
                        @click="markAbsent(student.id)" 
                        class="bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 text-sm w-7 h-7 md:w-8 md:h-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                        title="Mark Absent"
                      >
                        <i class="fas fa-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Table Footer -->
          <div class="px-4 md:px-6 py-3 md:py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div class="text-[11px] md:text-xs text-slate-500">
              Showing {{ filteredStudents.length }} of {{ students.length }} students
            </div>
            <div class="flex gap-1.5 md:gap-2">
              <button class="px-2 md:px-3 py-0.5 md:py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs md:text-sm hover:bg-slate-100 transition-all disabled:opacity-50" :disabled="currentPage === 1" @click="currentPage--">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="px-2 md:px-3 py-0.5 md:py-1 rounded-lg bg-indigo-600 text-white text-xs md:text-sm shadow-sm">{{ currentPage }}</button>
              <button class="px-2 md:px-3 py-0.5 md:py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs md:text-sm hover:bg-slate-100 transition-all" @click="currentPage++">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Stats -->
      <div v-if="students.length > 0" class="mt-4 md:mt-6">
        <div class="bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm shadow-sm">
          <div class="flex flex-wrap justify-between items-center text-xs md:text-sm gap-3">
            <div class="flex flex-wrap gap-3 md:gap-6">
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-chalkboard-user text-indigo-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong class="text-indigo-700">{{ currentClassName }}</strong></span>
              </div>
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-users text-slate-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong>{{ students.length }}</strong> Total</span>
              </div>
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-check-circle text-emerald-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong class="text-emerald-600">{{ gradePresentCount }}</strong> Present</span>
              </div>
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-clock text-amber-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong class="text-amber-600">{{ gradeLateCount }}</strong> Late</span>
              </div>
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-ban text-rose-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong class="text-rose-600">{{ gradeAbsentCount }}</strong> Absent</span>
              </div>
              <div class="flex items-center gap-1.5 md:gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-chart-line text-purple-600 text-[10px] md:text-sm"></i>
                </div>
                <span class="text-slate-600"><strong class="text-purple-600">{{ gradeAttendanceRate }}%</strong> Rate</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 md:gap-2 text-slate-400 text-[10px] md:text-xs">
              <i class="fas fa-database"></i>
              <span>Live Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 md:p-4" @click.self="closeAddModal">
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 md:p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-900">Add Student</h3>
              <p class="text-xs md:text-sm text-gray-500 mt-0.5">Fill in the details to add a new student</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 text-xl p-1" @click="closeAddModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label class="form-label required">Student Name</label>
              <input v-model="studentForm.name" type="text" class="form-input text-sm md:text-base" placeholder="Full name" />
              <p v-if="formErrors.name" class="text-red-500 text-xs mt-1">{{ formErrors.name }}</p>
            </div>

            <div>
              <label class="form-label required">Email</label>
              <input v-model="studentForm.email" type="email" class="form-input text-sm md:text-base" placeholder="student@school.com" />
              <p v-if="formErrors.email" class="text-red-500 text-xs mt-1">{{ formErrors.email }}</p>
            </div>

            <div>
              <label class="form-label">Student ID</label>
              <input :value="generatedStudentId" type="text" class="form-input bg-gray-100 text-sm md:text-base" readonly />
            </div>

            <div>
              <label class="form-label">Enrollment Year</label>
              <input v-model.number="studentForm.enrollYear" type="number" class="form-input text-sm md:text-base" />
            </div>

            <div>
              <label class="form-label required">Class</label>
              <select v-model="studentForm.class_id" class="form-input text-sm md:text-base">
                <option value="">Select Class</option>
                <option v-for="c in classOptions" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
              <p v-if="formErrors.class_id" class="text-red-500 text-xs mt-1">{{ formErrors.class_id }}</p>
            </div>

            <div>
              <label class="form-label">GPA (0-4)</label>
              <input v-model.number="studentForm.gpa" type="number" step="0.1" min="0" max="4" class="form-input text-sm md:text-base" />
            </div>

            <div>
              <label class="form-label">Status</label>
              <select v-model="studentForm.status" class="form-input text-sm md:text-base">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <!-- Preview Card -->
          <div v-if="studentForm.name && studentForm.class_id" class="mt-5 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl">
            <p class="text-[10px] md:text-xs text-gray-500 mb-2">Preview</p>
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white flex items-center justify-center text-base md:text-xl shadow-sm">
                <i class="fas fa-user-graduate text-indigo-500"></i>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 text-sm md:text-base">{{ studentForm.name || 'Student Name' }}</p>
                <p class="text-[10px] md:text-xs text-gray-500">{{ getSelectedClassName() }} • {{ studentForm.status || 'Active' }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] md:text-xs text-gray-500">GPA</p>
                <p class="text-base md:text-xl font-bold" :class="getGpaColor(studentForm.gpa)">{{ studentForm.gpa || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-6 md:mt-8 pt-4 border-t border-gray-100">
            <button class="btn-outline btn text-sm md:text-base" @click="closeAddModal">Cancel</button>
            <button class="btn-primary btn text-sm md:text-base" @click="saveNewStudent">Save Student</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import attendanceAPI from '../services/attendanceService'
import * as studentService from '../services/studentService'
import * as classService from '../services/classService'

// Helper to truncate text
const truncateText = (text, length) => {
  if (!text) return '—'
  return text.length > length ? text.substring(0, length) + '...' : text
}

export default {
  name: 'AttendanceView',
  setup() {
    // State
    const students = ref([])
    const classOptions = ref([])
    const classStudentCounts = ref({})
    const currentClassId = ref(null)
    const currentClassName = ref('')
    const attendanceDate = ref('')
    const alertMessage = ref('')
    const alertType = ref('success')
    const searchQuery = ref('')
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    
    // Modal state
    const showAddModal = ref(false)
    const studentForm = ref({
      name: '',
      email: '',
      enrollYear: new Date().getFullYear(),
      class_id: '',
      gpa: 0,
      status: 'Active',
    })
    const formErrors = ref({
      name: '',
      email: '',
      class_id: '',
    })
    
    const stats = ref({
      total: 0,
      present: 0,
      late: 0,
      absent: 0
    })

    // Computed Student ID
    const generatedStudentId = computed(() => {
      const random = String(Math.floor(1000 + Math.random() * 9000))
      return `STU${studentForm.value.enrollYear}${random}`
    })

    const showAlert = (msg, type = 'success') => {
      alertMessage.value = msg
      alertType.value = type
      setTimeout(() => {
        if (alertMessage.value === msg) alertMessage.value = null
      }, 3000)
    }

    // Get selected class name
    const getSelectedClassName = () => {
      const selected = classOptions.value.find(c => c.id === Number(studentForm.value.class_id))
      return selected ? selected.name : ''
    }

    // Get GPA color
    const getGpaColor = (gpa) => {
      if (gpa >= 3.5) return 'text-green-600'
      if (gpa >= 3.0) return 'text-blue-600'
      if (gpa >= 2.5) return 'text-yellow-600'
      return 'text-red-600'
    }

    // Validate form
    const validateForm = () => {
      let isValid = true
      formErrors.value = { name: '', email: '', class_id: '' }
      
      if (!studentForm.value.name.trim()) {
        formErrors.value.name = 'Student name is required'
        isValid = false
      }
      
      if (!studentForm.value.email.trim()) {
        formErrors.value.email = 'Email is required'
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(studentForm.value.email)) {
        formErrors.value.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!studentForm.value.class_id) {
        formErrors.value.class_id = 'Please select a class'
        isValid = false
      }
      
      return isValid
    }

    // Open add modal
    const openAddStudentModal = () => {
      studentForm.value = {
        name: '',
        email: '',
        enrollYear: new Date().getFullYear(),
        class_id: currentClassId.value || '',
        gpa: 0,
        status: 'Active',
      }
      formErrors.value = { name: '', email: '', class_id: '' }
      showAddModal.value = true
    }

    // Close add modal
    const closeAddModal = () => {
      showAddModal.value = false
    }

    // Save new student
    const saveNewStudent = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        const nameParts = studentForm.value.name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''
        
        const studentData = {
          first_name: firstName,
          last_name: lastName,
          student_code: generatedStudentId.value,
          gender: 'Male',
          email: studentForm.value.email.trim(),
          phone: '000000000',
          address: 'School',
          class_id: Number(studentForm.value.class_id),
          gpa: Number(studentForm.value.gpa),
          status: studentForm.value.status,
        }
        
        await studentService.createStudent(studentData)
        await loadAttendance()
        
        // Update class student count
        const allStudentsResponse = await studentService.getStudents()
        const allStudents = allStudentsResponse.data || []
        const newCount = allStudents.filter(s => Number(s.class_id) === Number(studentForm.value.class_id)).length
        classStudentCounts.value[studentForm.value.class_id] = newCount
        
        closeAddModal()
        showAlert(`Student added to ${getSelectedClassName()}`, 'success')
      } catch (error) {
        console.error('Failed to add student:', error)
        showAlert('Failed to add student', 'warning')
      } finally {
        loading.value = false
      }
    }

    // Load classes
    const loadClasses = async () => {
      try {
        loading.value = true
        const response = await classService.getClasses()
        let classes = response.data || []
        
        console.log('All classes from backend:', classes)
        
        // Default classes if none exist
        if (classes.length === 0) {
          console.warn('No classes found, using default classes')
          classes = [
            { id: 1, name: '7A', grade_level: 7 },
            { id: 2, name: '7B', grade_level: 7 },
            { id: 3, name: '7C', grade_level: 7 },
            { id: 4, name: '8A', grade_level: 8 },
            { id: 5, name: '8B', grade_level: 8 },
            { id: 6, name: '8C', grade_level: 8 },
            { id: 7, name: '9A', grade_level: 9 },
            { id: 8, name: '9B', grade_level: 9 },
          ]
        }
        
        const allowedClasses = ['7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B']
        classes = classes.filter(c => allowedClasses.includes(c.name))
        
        classOptions.value = classes.sort((a, b) => a.name.localeCompare(b.name))
        
        console.log('Class options:', classOptions.value)
        
        const allStudentsResponse = await studentService.getStudents()
        const allStudents = allStudentsResponse.data || []
        
        const counts = {}
        for (const classItem of classOptions.value) {
          counts[classItem.id] = allStudents.filter(s => Number(s.class_id) === Number(classItem.id)).length
        }
        classStudentCounts.value = counts
        
        let defaultClass = classOptions.value.find(c => counts[c.id] > 0)
        if (!defaultClass && classOptions.value.length > 0) {
          defaultClass = classOptions.value[0]
        }
        
        if (defaultClass && !currentClassId.value) {
          currentClassId.value = defaultClass.id
          currentClassName.value = defaultClass.name
        }
        
      } catch (error) {
        console.error('Failed to load classes:', error)
        showAlert('Failed to load classes', 'warning')
      } finally {
        loading.value = false
      }
    }

    // Load attendance for current class
    const loadAttendance = async () => {
      if (!currentClassId.value) return
      
      loading.value = true
      try {
        const allStudentsResponse = await studentService.getStudents()
        const allStudents = allStudentsResponse.data || []
        
        const classStudents = allStudents.filter(student => 
          Number(student.class_id) === Number(currentClassId.value)
        )
        
        if (classStudents.length === 0) {
          students.value = []
          stats.value = { total: 0, present: 0, late: 0, absent: 0 }
          return
        }
        
        const studentsWithAttendance = await Promise.all(
          classStudents.map(async (student) => {
            try {
              const historyResponse = await attendanceAPI.getStudentHistory(student.id, 30)
              const attendanceRecords = historyResponse.data || []
              const todaysAttendance = attendanceRecords.find(a => a.date === attendanceDate.value)
              
              return {
                id: student.id,
                student_code: student.student_code,
                first_name: student.first_name,
                last_name: student.last_name,
                full_name: `${student.first_name} ${student.last_name}`,
                status: todaysAttendance ? todaysAttendance.status : 'absent',
                checkInTime: todaysAttendance ? todaysAttendance.checkInTime : null
              }
            } catch (error) {
              return {
                id: student.id,
                student_code: student.student_code,
                first_name: student.first_name,
                last_name: student.last_name,
                full_name: `${student.first_name} ${student.last_name}`,
                status: 'absent',
                checkInTime: null
              }
            }
          })
        )
        
        students.value = studentsWithAttendance
        
        stats.value = {
          total: students.value.length,
          present: students.value.filter(s => s.status === 'present').length,
          late: students.value.filter(s => s.status === 'late').length,
          absent: students.value.filter(s => s.status === 'absent').length
        }
        
      } catch (error) {
        console.error('Failed to load attendance:', error)
        showAlert('Failed to load attendance data', 'warning')
      } finally {
        loading.value = false
      }
    }

    const selectClass = async (classId) => {
      if (currentClassId.value === classId) return
      
      currentClassId.value = classId
      const selectedClass = classOptions.value.find(c => c.id === classId)
      if (selectedClass) {
        currentClassName.value = selectedClass.name
      }
      searchQuery.value = ''
      currentPage.value = 1
      await loadAttendance()
    }

    const markPresent = async (studentId) => {
      loading.value = true
      try {
        const nowTime = attendanceAPI.getCurrentFormattedTime()
        const isLate = attendanceAPI.isLateTime(nowTime)
        const status = isLate ? 'late' : 'present'
        
        await attendanceAPI.markAttendance(studentId, status, nowTime, attendanceDate.value)
        await loadAttendance()
        
        const student = students.value.find(s => s.id === studentId)
        showAlert(`${student?.full_name} marked as ${status.toUpperCase()}`, 'success')
      } catch (error) {
        console.error('Failed to mark attendance:', error)
        showAlert('Failed to mark attendance', 'warning')
      } finally {
        loading.value = false
      }
    }

    const markLate = async (studentId) => {
      loading.value = true
      try {
        const nowTime = attendanceAPI.getCurrentFormattedTime()
        await attendanceAPI.markAttendance(studentId, 'late', nowTime, attendanceDate.value)
        await loadAttendance()
        
        const student = students.value.find(s => s.id === studentId)
        showAlert(`${student?.full_name} marked as LATE`, 'success')
      } catch (error) {
        console.error('Failed to mark attendance:', error)
        showAlert('Failed to mark attendance', 'warning')
      } finally {
        loading.value = false
      }
    }

    const markAbsent = async (studentId) => {
      loading.value = true
      try {
        await attendanceAPI.markAttendance(studentId, 'absent', null, attendanceDate.value)
        await loadAttendance()
        
        const student = students.value.find(s => s.id === studentId)
        showAlert(`${student?.full_name} marked as ABSENT`, 'success')
      } catch (error) {
        console.error('Failed to mark attendance:', error)
        showAlert('Failed to mark attendance', 'warning')
      } finally {
        loading.value = false
      }
    }

    const resetCurrentClassAttendance = async () => {
      if (students.value.length === 0) {
        showAlert('No students to reset', 'warning')
        return
      }
      
      if (!confirm(`Reset all attendance for ${currentClassName.value} on ${attendanceDate.value}?`)) return
      
      loading.value = true
      try {
        for (const student of students.value) {
          await attendanceAPI.markAttendance(student.id, 'absent', null, attendanceDate.value)
        }
        await loadAttendance()
        showAlert(`Attendance reset for ${currentClassName.value}`, 'success')
      } catch (error) {
        console.error('Failed to reset attendance:', error)
        showAlert('Failed to reset attendance', 'warning')
      } finally {
        loading.value = false
      }
    }

    const markAllPresentInClass = async () => {
      if (students.value.length === 0) {
        showAlert('No students to mark', 'warning')
        return
      }
      
      if (!confirm(`Mark all students in ${currentClassName.value} as present?`)) return
      
      loading.value = true
      try {
        const nowTime = attendanceAPI.getCurrentFormattedTime()
        const isLate = attendanceAPI.isLateTime(nowTime)
        const status = isLate ? 'late' : 'present'
        
        for (const student of students.value) {
          await attendanceAPI.markAttendance(student.id, status, nowTime, attendanceDate.value)
        }
        await loadAttendance()
        showAlert(`All students marked as ${status.toUpperCase()}`, 'success')
      } catch (error) {
        console.error('Failed to mark all students:', error)
        showAlert('Failed to mark all students', 'warning')
      } finally {
        loading.value = false
      }
    }

    const exportAttendanceToExcel = async () => {
      if (students.value.length === 0) {
        showAlert('No students to export', 'warning')
        return
      }
      
      try {
        const XLSX = await import('xlsx')
        const className = currentClassName.value
        const exportDate = attendanceDate.value
        
        const worksheetData = [
          [`ATTENDANCE REPORT - ${className}`],
          [`Date: ${exportDate}`],
          [`Late threshold: After 09:00 AM`],
          [`Generated: ${new Date().toLocaleString()}`],
          [],
          ['#', 'Student Code', 'Student Name', 'Class', 'Status', 'Check-in Time']
        ]
        
        paginatedFilteredStudents.value.forEach((s, idx) => {
          const statusText = s.status === 'present' ? 'Present' : (s.status === 'late' ? 'Late' : 'Absent')
          worksheetData.push([
            idx + 1,
            s.student_code || '-',
            s.full_name,
            currentClassName.value,
            statusText,
            s.checkInTime || '—'
          ])
        })
        
        worksheetData.push([])
        worksheetData.push([
          `Total Students: ${paginatedFilteredStudents.value.length}`,
          `Present: ${gradePresentCount.value}`,
          `Late: ${gradeLateCount.value}`,
          `Absent: ${gradeAbsentCount.value}`,
          `Attendance Rate: ${gradeAttendanceRate.value}%`
        ])
        
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(worksheetData)
        ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 8 }, { wch: 12 }, { wch: 15 }]
        XLSX.utils.book_append_sheet(wb, ws, `${className}_Attendance`)
        XLSX.writeFile(wb, `Attendance_${className}_${exportDate}.xlsx`)
        showAlert(`Exported attendance to Excel`, 'success')
      } catch (error) {
        console.error('Failed to export:', error)
        showAlert('Failed to export', 'warning')
      }
    }

    // Computed properties
    const filteredStudents = computed(() => {
      if (!searchQuery.value.trim()) return students.value
      const query = searchQuery.value.toLowerCase()
      return students.value.filter(s => 
        s.full_name?.toLowerCase().includes(query) ||
        s.student_code?.toLowerCase().includes(query)
      )
    })
    
    const paginatedFilteredStudents = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return filteredStudents.value.slice(start, start + pageSize.value)
    })

    const totalStudentsCount = computed(() => stats.value.total)
    const presentCount = computed(() => stats.value.present)
    const lateCount = computed(() => stats.value.late)
    const absentCount = computed(() => stats.value.absent)
    
    const gradePresentCount = computed(() => 
      paginatedFilteredStudents.value.filter(s => s.status === 'present').length
    )
    const gradeLateCount = computed(() => 
      paginatedFilteredStudents.value.filter(s => s.status === 'late').length
    )
    const gradeAbsentCount = computed(() => 
      paginatedFilteredStudents.value.filter(s => s.status === 'absent').length
    )
    const gradeAttendanceRate = computed(() => {
      const total = paginatedFilteredStudents.value.length
      if (total === 0) return 0
      const attended = gradePresentCount.value + gradeLateCount.value
      return ((attended / total) * 100).toFixed(1)
    })

    // Reset page when search changes
    watch(searchQuery, () => {
      currentPage.value = 1
    })

    // Watchers
    watch(currentClassId, () => {
      if (currentClassId.value) {
        loadAttendance()
      }
    })
    
    watch(attendanceDate, () => {
      if (currentClassId.value) {
        loadAttendance()
      }
    })

    // Lifecycle
    onMounted(async () => {
      if (!attendanceDate.value) {
        attendanceDate.value = attendanceAPI.getTodayDate()
      }
      await loadClasses()
      if (currentClassId.value) {
        await loadAttendance()
      }
    })

    return {
      classOptions,
      classStudentCounts,
      currentClassId,
      currentClassName,
      attendanceDate,
      alertMessage,
      alertType,
      searchQuery,
      students,
      filteredStudents,
      paginatedFilteredStudents,
      totalStudentsCount,
      presentCount,
      lateCount,
      absentCount,
      gradePresentCount,
      gradeLateCount,
      gradeAbsentCount,
      gradeAttendanceRate,
      currentPage,
      truncateText,
      selectClass,
      markPresent,
      markLate,
      markAbsent,
      resetCurrentClassAttendance,
      markAllPresentInClass,
      exportAttendanceToExcel,
      loading,
      // Modal properties
      showAddModal,
      studentForm,
      formErrors,
      generatedStudentId,
      openAddStudentModal,
      closeAddModal,
      saveNewStudent,
      getSelectedClassName,
      getGpaColor
    }
  }
}
</script>

<style scoped>
/* Custom breakpoint utilities */
@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slide Down Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Hover Effects */
button:active {
  transform: scale(0.96);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
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

/* Form Styles */
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

/* Table Row Hover */
tbody tr:hover {
  background-color: #f8fafc;
}

/* Checkbox Styling */
input[type="checkbox"] {
  cursor: pointer;
}
</style>