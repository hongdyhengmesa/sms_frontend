<template>
  <header
    class="flex items-center gap-2 md:gap-4 px-3 md:px-6 h-14 md:h-16 bg-white border-b border-gray-100 flex-shrink-0 sticky top-0 z-30"
    style="box-shadow:0 1px 6px rgba(0,0,0,0.04);"
  >
    <!-- Sidebar Toggle - Mobile friendly -->
    <button
      class="btn-ghost p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition"
      @click="$emit('toggle-sidebar')"
      aria-label="Toggle sidebar"
    >
      <Bars3Icon class="w-5 h-5 text-gray-500" />
    </button>

    <!-- PAGE TITLE -->
    <div class="flex-1 min-w-0">
      <h1 class="text-sm md:text-base font-bold text-gray-900 truncate">
        {{ pageTitle }}
      </h1>
      <p class="hidden lg:block text-xs text-gray-400 mt-0.5 truncate">
        Welcome back, {{ admin.name }}
      </p>
    </div>

    <!-- SEARCH - Hidden on mobile, visible on md+ -->
    <div class="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all min-w-[200px]">
      <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
      <input
        v-model="search"
        class="bg-transparent border-0 outline-none text-sm text-gray-700 w-36 lg:w-48 placeholder-gray-400"
        placeholder="Search students..."
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- Mobile Search Button -->
    <button
      class="md:hidden p-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition"
      @click="showMobileSearch = true"
      aria-label="Search"
    >
      <MagnifyingGlassIcon class="w-4 h-4 text-gray-600" />
    </button>

    <!-- Mobile Search Modal -->
    <Teleport to="body">
      <Transition name="slide-down">
        <div v-if="showMobileSearch" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-12 px-4" @click.self="showMobileSearch = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4 animate-slideUp">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-900">Search</h3>
              <button @click="showMobileSearch = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
              <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
              <input
                v-model="search"
                class="bg-transparent border-0 outline-none text-sm text-gray-700 flex-1 placeholder-gray-400"
                placeholder="Search students, scores..."
                @keyup.enter="handleSearchMobile"
                autofocus
              />
            </div>
            <button
              @click="handleSearchMobile"
              class="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-medium text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- NOTIFICATION -->
    <button
      class="relative p-1.5 md:p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
      @click="toggleNotifications"
      aria-label="Notifications"
    >
      <BellIcon class="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
      <span
        v-if="notifications > 0"
        class="absolute -top-1 -right-1 min-w-[16px] md:min-w-[18px] h-4 md:h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] md:text-[10px] flex items-center justify-center font-bold border-2 border-white"
      >
        {{ notifications > 9 ? '9+' : notifications }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showNotifications" class="fixed inset-0 z-40" @click="showNotifications = false"></div>
      </Transition>
      <Transition name="slide-down">
        <div v-if="showNotifications" class="absolute top-14 md:top-16 right-3 md:right-6 z-50 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp">
          <div class="p-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
            <p class="text-xs text-gray-400 mt-0.5">You have {{ notifications }} unread notifications</p>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div v-for="i in Math.min(notifications, 5)" :key="i" class="p-4 hover:bg-gray-50 transition border-b border-gray-50">
              <p class="text-sm text-gray-700">New student enrolled in Grade 7A</p>
              <p class="text-xs text-gray-400 mt-1">2 minutes ago</p>
            </div>
          </div>
          <div class="p-3 bg-gray-50 text-center">
            <button class="text-xs text-indigo-600 font-medium">View all notifications</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- PROFILE -->
    <RouterLink
      to="/settings"
      class="flex items-center gap-1 md:gap-2 pl-1 md:pl-2"
    >
      <!-- AVATAR -->
      <div
        class="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow"
        style="background:linear-gradient(135deg,#3b82f6,#6366f1)"
      >
        {{ initials }}
      </div>

      <!-- INFO - Hidden on small screens -->
      <div class="hidden lg:block">
        <p class="text-sm font-semibold text-gray-800 leading-none">
          {{ truncateName(admin.name, 20) }}
        </p>
        <p class="text-xs text-gray-400 mt-1">Administrator</p>
      </div>
    </RouterLink>

    <!-- LOGOUT -->
    <button
      class="btn-ghost btn-sm text-gray-500 gap-1 flex items-center hover:text-red-500 transition p-1.5 md:p-2 rounded-lg hover:bg-red-50"
      @click="logout"
      aria-label="Logout"
    >
      <ArrowRightOnRectangleIcon class="w-4 h-4 md:w-5 md:h-5" />
      <span class="hidden sm:inline text-[11px] md:text-xs font-medium">
        Logout
      </span>
    </button>
  </header>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()

const search = ref('')
const showMobileSearch = ref(false)
const showNotifications = ref(false)
const admin = ref({
  name: 'Administrator',
  email: 'admin@educore.edu',
})
const notifications = ref(3)

// Helper to truncate text
const truncateName = (text, length) => {
  if (!text) return '—'
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Page title mapping
const titles = {
  '/dashboard': 'Dashboard Overview',
  '/students': 'Student Management',
  '/teachers': 'Teacher Management',
  '/subjects': 'Subject Catalogue',
  '/classes': 'Class Management',
  '/attendance': 'Attendance Management',
  '/scores': 'Score Management',
  '/report': 'Report Cards',
  '/analytics': 'GPA Analytics',
  '/settings': 'System Settings',
  '/welcome': 'Welcome',
}

const pageTitle = computed(() => titles[route.path] || 'EduCore')

const initials = computed(() => {
  return admin.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

// Fetch admin from localStorage
const fetchAdmin = () => {
  const user = localStorage.getItem('user')
  if (user) {
    const data = JSON.parse(user)
    admin.value.name = data.name || 'Administrator'
    admin.value.email = data.email || 'admin@educore.edu'
  }
}

// Handle search
const handleSearch = () => {
  if (!search.value.trim()) return
  console.log('Searching:', search.value)
  // Implement search navigation/API call here
  showMobileSearch.value = false
}

const handleSearchMobile = () => {
  handleSearch()
}

// Toggle notifications dropdown
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

// Click outside to close notifications
const handleClickOutside = (event) => {
  const notificationBtn = event.target.closest('[aria-label="Notifications"]')
  const notificationDropdown = event.target.closest('.absolute.top-14')
  if (!notificationBtn && !notificationDropdown && showNotifications.value) {
    showNotifications.value = false
  }
}

// Logout
const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('educore_auth')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/welcome')
  }
}

// Close notifications on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && showNotifications.value) {
    showNotifications.value = false
  }
  if (event.key === 'Escape' && showMobileSearch.value) {
    showMobileSearch.value = false
  }
}

onMounted(() => {
  fetchAdmin()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Custom animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slideUp {
  animation: slideUp 0.2s ease-out;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hover transitions */
.btn-ghost {
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  button:active {
    transform: scale(0.96);
  }
}

/* Smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>