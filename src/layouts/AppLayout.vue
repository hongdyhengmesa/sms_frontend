<template>
  <div class="app-layout min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Sidebar -->
    <AppSidebar 
      :collapsed="sidebarCollapsed" 
      :is-mobile-open="isMobileSidebarOpen"
      @toggle-mobile="handleMobileSidebar"
      @close-mobile="closeMobileSidebar"
    />

    <!-- Mobile Sidebar Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 md:hidden"
        @click="closeMobileSidebar"
      ></div>
    </Transition>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden min-w-0">
      <!-- Topbar -->
      <AppTopbar 
        @toggle-sidebar="toggleSidebar" 
        @toggle-mobile-sidebar="toggleMobileSidebar" 
      />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-3 md:p-6">
        <div class="max-w-full mx-auto">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-3 md:py-4 text-center text-[10px] md:text-xs text-gray-400 border-t border-gray-100 bg-white/50">
        <p>© {{ new Date().getFullYear() }} EduCore. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'

const router = useRouter()

// Sidebar state
const sidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isMobile = ref(false)

// Check if screen is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

// Toggle sidebar (desktop collapse)
const toggleSidebar = () => {
  if (!isMobile.value) {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed.value)
  }
}

// Toggle mobile sidebar
const toggleMobileSidebar = () => {
  if (isMobile.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
    if (isMobileSidebarOpen.value) {
      document.body.classList.add('menu-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('menu-open')
      document.body.style.overflow = ''
    }
  }
}

// Close mobile sidebar
const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
  document.body.classList.remove('menu-open')
  document.body.style.overflow = ''
}

// Handle mobile sidebar from child component
const handleMobileSidebar = (isOpen) => {
  isMobileSidebarOpen.value = isOpen
  if (isOpen) {
    document.body.classList.add('menu-open')
    document.body.style.overflow = 'hidden'
  } else {
    document.body.classList.remove('menu-open')
    document.body.style.overflow = ''
  }
}

// Handle window resize
const handleResize = () => {
  const wasMobile = isMobile.value
  checkMobile()
  
  if (wasMobile && !isMobile.value && isMobileSidebarOpen.value) {
    closeMobileSidebar()
  }
}

// Load saved sidebar preference
const loadSidebarPreference = () => {
  const saved = localStorage.getItem('sidebar_collapsed')
  if (saved !== null) {
    sidebarCollapsed.value = saved === 'true'
  }
}

// Handle escape key to close mobile sidebar
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMobileSidebarOpen.value) {
    closeMobileSidebar()
  }
}

// Listen for route changes to close mobile sidebar - IMPORTANT!
watch(() => router.currentRoute.value.path, () => {
  if (isMobileSidebarOpen.value) {
    closeMobileSidebar()
  }
})

onMounted(() => {
  checkMobile()
  loadSidebarPreference()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleEscape)
  document.body.classList.remove('menu-open')
  document.body.style.overflow = ''
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for main content */
main {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f1f1;
}

main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

main::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Responsive padding adjustments */
@media (max-width: 640px) {
  main {
    padding: 12px;
  }
}
</style>

<style>
/* Global styles for better mobile experience */
* {
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

/* Prevent body scroll when mobile menu is open */
body.menu-open {
  overflow: hidden;
}

/* Better touch targets on mobile */
@media (max-width: 768px) {
  button, 
  a,
  [role="button"],
  .clickable {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Improve focus visibility */
:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Prevent text selection on double-click */
.no-select {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>