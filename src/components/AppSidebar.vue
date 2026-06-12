<template>
  <aside
    class="sidebar flex flex-col bg-white border-r border-gray-100 flex-shrink-0 transition-all duration-300 overflow-hidden z-20"
    :class="{ 'sidebar-collapsed': collapsed, 'sidebar-mobile': isMobileOpen }"
    :style="{ width: collapsed ? '68px' : '256px' }"
    style="box-shadow: 2px 0 12px rgba(0,0,0,0.04);"
  >
    <!-- Logo -->
    <div
      class="flex items-center gap-3 px-4 py-4 md:py-5 border-b border-gray-100 flex-shrink-0"
      :class="collapsed ? 'justify-center' : ''"
    >
      <div
        class="w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
        style="background: linear-gradient(135deg,#2563eb,#4f46e5); box-shadow:0 4px 10px rgba(79,70,229,.35);"
        @click="goToDashboard"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      <span
        v-if="!collapsed"
        class="font-serif text-base md:text-lg text-gray-900 whitespace-nowrap cursor-pointer"
        @click="goToDashboard"
      >
        Edu<span class="text-indigo-600">Core</span>
      </span>
    </div>

    <!-- Mobile Close Button -->
    <button
      v-if="isMobileOpen"
      class="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition z-30"
      @click="closeMobileMenu"
      aria-label="Close menu"
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 md:py-4 px-2 md:px-3 space-y-0.5 custom-scrollbar">
      <template
        v-for="section in navSections"
        :key="section.label"
      >
        <!-- Section Label -->
        <p
          v-if="!collapsed && !isMobileOpen"
          class="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2 pt-3 pb-1"
        >
          {{ section.label }}
        </p>

        <div
          v-else-if="collapsed && !isMobileOpen"
          class="my-2 border-t border-gray-100"
        ></div>

        <!-- Menu Items -->
        <RouterLink
          v-for="item in section.items"
          :key="item.id"
          :to="item.path"
          class="nav-link group"
          :class="{
            'active': route.path === item.path,
            'justify-center': collapsed && !isMobileOpen
          }"
          :title="collapsed && !isMobileOpen ? item.label : ''"
          @click="handleNavClick"
        >
          <div class="nav-icon-wrapper" :class="{ 'active': route.path === item.path }">
            <component
              :is="item.icon"
              class="nav-icon w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
              :class="{ 'text-indigo-600': route.path === item.path }"
            />
          </div>

          <span
            v-if="!collapsed || isMobileOpen"
            class="flex-1 text-left ml-2 md:ml-3"
            :class="{ 'text-indigo-600 font-semibold': route.path === item.path }"
          >
            {{ item.label }}
          </span>

          <span
            v-if="!collapsed && item.badge && !isMobileOpen"
            class="ml-auto bg-indigo-100 text-indigo-600 text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </template>
    </nav>

    <!-- User Section -->
    <div class="p-2 md:p-3 border-t border-gray-100">
      <div
        class="flex items-center gap-2 md:gap-2.5 p-1.5 md:p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        :class="collapsed && !isMobileOpen ? 'justify-center' : ''"
        @click="goToSettings"
      >
        <div
          class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md transition-all duration-300 hover:scale-105"
          style="background:linear-gradient(135deg,#3b82f6,#6366f1)"
        >
          {{ userInitials }}
        </div>

        <div
          v-if="!collapsed || isMobileOpen"
          class="min-w-0 flex-1"
        >
          <p class="text-xs md:text-sm font-semibold text-gray-800 truncate">
            {{ userName }}
          </p>
          <p class="text-[10px] md:text-[11px] text-gray-500">
            {{ userRole }}
          </p>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="w-full mt-2 md:mt-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
        :class="collapsed && !isMobileOpen ? 'px-2' : 'px-3'"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span v-if="!collapsed || isMobileOpen">Logout</span>
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
  Squares2X2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TableCellsIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  collapsed: Boolean,
  isMobileOpen: Boolean,
})

// Emits
const emit = defineEmits(['toggle-mobile', 'close-mobile'])

// Router
const router = useRouter()
const route = useRoute()

// User info
const userName = ref('Admin User')
const userRole = ref('System Admin')
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

// Navigation sections
const navSections = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon, badge: null },
      { id: 'students', label: 'Students', path: '/students', icon: UserGroupIcon, badge: null },
      { id: 'teachers', label: 'Teachers', path: '/teachers', icon: AcademicCapIcon, badge: null },
    ],
  },
  {
    label: 'Academic',
    items: [
      { id: 'subjects', label: 'Subjects', path: '/subjects', icon: BookOpenIcon, badge: null },
      { id: 'classes', label: 'Classes', path: '/classes', icon: TableCellsIcon, badge: null },
      { id: 'attendance', label: 'Attendance', path: '/attendance', icon: CalendarDaysIcon, badge: null },
      { id: 'scores', label: 'Score Management', path: '/scores', icon: ClipboardDocumentListIcon, badge: null },
    ],
  },
  {
    label: 'Reports',
    items: [
      { id: 'report', label: 'Report Cards', path: '/report', icon: DocumentChartBarIcon, badge: null },
      { id: 'analytics', label: 'GPA Analytics', path: '/analytics', icon: ChartBarIcon, badge: null },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'Settings', path: '/settings', icon: Cog6ToothIcon, badge: null },
    ],
  },
]

// Handle navigation click - THIS IS THE KEY FIX!
const handleNavClick = () => {
  // Close mobile sidebar when a navigation link is clicked
  if (props.isMobileOpen) {
    emit('close-mobile')
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  emit('close-mobile')
}

// Go to dashboard
const goToDashboard = () => {
  router.push('/dashboard')
  if (props.isMobileOpen) {
    emit('close-mobile')
  }
}

// Go to settings
const goToSettings = () => {
  router.push('/settings')
  if (props.isMobileOpen) {
    emit('close-mobile')
  }
}

// Fetch user data
const fetchUserData = () => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      userName.value = userData.name || userData.full_name || 'Admin User'
      userRole.value = userData.role || 'System Admin'
    } catch (e) {
      console.error('Failed to parse user data')
    }
  }
}

// Logout
const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('educore_auth')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
/* Sidebar base styles */
.sidebar {
  position: relative;
  height: 100vh;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile sidebar */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar-mobile {
    transform: translateX(0);
    width: 280px !important;
  }
}

/* Navigation link styles */
.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 2px;
}

@media (min-width: 768px) {
  .nav-link {
    padding: 10px 12px;
    font-size: 14px;
  }
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-link.active {
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  color: #4f46e5;
}

.nav-link.justify-center {
  justify-content: center;
  padding: 10px;
}

/* Icon wrapper */
.nav-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
}

.nav-icon {
  color: #6b7280;
}

.nav-link.active .nav-icon {
  color: #4f46e5;
}

.nav-link:hover .nav-icon {
  color: #4f46e5;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>