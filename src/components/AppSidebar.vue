<template>
  <aside
    class="flex flex-col bg-white border-r border-gray-100 flex-shrink-0 transition-all duration-300 overflow-hidden"
    :style="{ width: collapsed ? '68px' : '256px' }"
    style="box-shadow: 2px 0 12px rgba(0,0,0,0.04);"
  >

    <!-- Logo -->
    <div
      class="flex items-center gap-3 px-4 py-5 border-b border-gray-100 flex-shrink-0"
      :class="collapsed ? 'justify-center' : ''"
    >

      <div
        class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
        style="background: linear-gradient(135deg,#2563eb,#4f46e5); box-shadow:0 4px 10px rgba(79,70,229,.35);"
      >

        <svg
          width="18"
          height="18"
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
        class="font-serif text-lg text-gray-900 whitespace-nowrap"
      >

        Edu<span class="text-indigo-600">Core</span>

      </span>

    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

      <template
        v-for="section in navSections"
        :key="section.label"
      >

        <!-- Section Label -->
        <p
          v-if="!collapsed"
          class="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2 pt-3 pb-1"
        >

          {{ section.label }}

        </p>

        <div
          v-else
          class="my-2 border-t border-gray-100"
        ></div>

        <!-- Menu -->
        <RouterLink
          v-for="item in section.items"
          :key="item.id"
          :to="item.path"
          class="nav-link"
          :class="{
            active: route.path === item.path
          }"
          :title="collapsed ? item.label : ''"
        >

          <!-- Icon -->
          <component
            :is="item.icon"
            class="w-4 h-4 flex-shrink-0"
          />

          <!-- Label -->
          <span
            v-if="!collapsed"
            class="flex-1"
          >

            {{ item.label }}

          </span>

          <!-- Badge -->
          <span
            v-if="!collapsed && item.badge"
            class="ml-auto bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full"
          >

            {{ item.badge }}

          </span>

        </RouterLink>

      </template>

    </nav>

    <!-- User -->
    <div class="p-3 border-t border-gray-100">

      <div
        class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors"
        :class="collapsed ? 'justify-center' : ''"
      >

        <div
          class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
          style="background:linear-gradient(135deg,#3b82f6,#6366f1)"
        >
          AD
        </div>

        <div
          v-if="!collapsed"
          class="min-w-0 flex-1"
        >

          <p class="text-xs font-semibold text-gray-800 truncate">
            Admin User
          </p>

          <p class="text-[11px] text-gray-500">
            System Admin
          </p>

        </div>

      </div>

      <!-- Logout -->
      <button
        @click="logout"
        class="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
      >

        Logout

      </button>

    </div>

  </aside>
</template>

<script setup>
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
defineProps({

  collapsed: Boolean,

})

// Router
const router = useRouter()

const route = useRoute()

// Navigation
const navSections = [

  {
    label: 'Main',

    items: [

      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: Squares2X2Icon,
        badge: null,
      },

      {
        id: 'students',
        label: 'Students',
        path: '/students',
        icon: UserGroupIcon,
        // badge: '1,284',
      },

      {
        id: 'teachers',
        label: 'Teachers',
        path: '/teachers',
        icon: AcademicCapIcon,
        // badge: '86',
      },

    ],

  },

  {
    label: 'Academic',

    items: [

      {
        id: 'subjects',
        label: 'Subjects',
        path: '/subjects',
        icon: BookOpenIcon,
        badge: null,
      },

      {
        id: 'classes',
        label: 'Classes',
        path: '/classes',
        icon: TableCellsIcon,
        badge: null,
      },

      {
      id: 'attendance',
      label: 'Attendance',
      path: '/attendance',
      icon: CalendarDaysIcon,
      badge: null,
     },

      {
        id: 'scores',
        label: 'Score Management',
        path: '/scores',
        icon: ClipboardDocumentListIcon,
        badge: null,
      },

    ],

  },

  {
    label: 'Reports',

    items: [

      {
        id: 'report',
        label: 'Report Cards',
        path: '/report',
        icon: DocumentChartBarIcon,
        badge: null,
      },

      {
        id: 'analytics',
        label: 'GPA Analytics',
        path: '/analytics',
        icon: ChartBarIcon,
        badge: null,
      },

    ],

  },

  {
    label: 'System',

    items: [

      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Cog6ToothIcon,
        badge: null,
      },

    ],

  },

]

// Logout
const logout = () => {

  // Remove auth
  sessionStorage.removeItem(
    'educore_auth'
  )

  localStorage.removeItem('token')

  localStorage.removeItem('user')

  // Redirect
  router.push('/login')

}
</script>