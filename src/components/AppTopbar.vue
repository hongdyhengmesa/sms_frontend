<template>

  <header
    class="flex items-center gap-4 px-6 h-16 bg-white border-b border-gray-100 flex-shrink-0"
    style="box-shadow:0 1px 6px rgba(0,0,0,0.04);"
  >

    <!-- Sidebar Toggle -->

    <button
      class="btn-ghost p-2 rounded-lg hover:bg-gray-100 transition"
      @click="$emit('toggle-sidebar')"
    >

      <Bars3Icon
        class="w-5 h-5 text-gray-500"
      />

    </button>

    <!-- PAGE TITLE -->

    <div class="flex-1">

      <h1
        class="text-base font-bold text-gray-900"
      >

        {{ pageTitle }}

      </h1>

      <p
        class="hidden lg:block text-xs text-gray-400 mt-0.5"
      >

        Welcome back,
        {{ admin.name }}

      </p>

    </div>

    <!-- SEARCH -->

    <div
      class="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all"
    >

      <MagnifyingGlassIcon
        class="w-4 h-4 text-gray-400"
      />

      <input

        v-model="search"

        class="bg-transparent border-0 outline-none text-sm text-gray-700 w-48 placeholder-gray-400"

        placeholder="Search students, scores..."

        @keyup.enter="handleSearch"

      />

    </div>

    <!-- NOTIFICATION -->

    <button
      class="relative p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
    >

      <BellIcon
        class="w-5 h-5 text-gray-600"
      />

      <span

        v-if="notifications > 0"

        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white"

      >

        {{ notifications }}

      </span>

    </button>

    <!-- PROFILE -->

    <RouterLink

      to="/settings"

      class="flex items-center gap-2 pl-2"

    >

      <!-- AVATAR -->

      <div

        class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow"

        style="background:linear-gradient(135deg,#3b82f6,#6366f1)"

      >

        {{ initials }}

      </div>

      <!-- INFO -->

      <div
        class="hidden lg:block"
      >

        <p
          class="text-sm font-semibold text-gray-800 leading-none"
        >

          {{ admin.name }}

        </p>

        <p
          class="text-xs text-gray-400 mt-1"
        >

          Administrator

        </p>

      </div>

    </RouterLink>

    <!-- LOGOUT -->

    <button

      class="btn-ghost btn-sm text-gray-500 gap-1 flex items-center hover:text-red-500 transition"

      @click="logout"

    >

      <ArrowRightOnRectangleIcon
        class="w-4 h-4"
      />

      <span
        class="hidden sm:inline text-xs font-medium"
      >

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

defineEmits([

  'toggle-sidebar',

])

const route = useRoute()

const router = useRouter()

const search = ref('')

const admin = ref({

  name: 'Administrator',

  email: 'admin@educore.edu',

})

const notifications = ref(3)

const titles = {

  '/dashboard':
    'Dashboard Overview',

  '/students':
    'Student Management',

  '/teachers':
    'Teacher Management',

  '/subjects':
    'Subject Catalogue',

  '/classes':
    'Class Management',
  
  '/attendance':
     'Attendance Management',

  '/scores':
    'Score Management',

  '/report':
    'Report Cards',

  '/analytics':
    'GPA Analytics',

  '/settings':
    'System Settings',

}

const pageTitle = computed(() =>

  titles[route.path]
  || 'EduCore'

)

const initials = computed(() => {

  return admin.value.name

    .split(' ')

    .map(
      n => n[0]
    )

    .join('')

    .substring(0, 2)

    .toUpperCase()

})

const fetchAdmin = () => {

  const user =
    localStorage.getItem('user')

  if (user) {

    const data =
      JSON.parse(user)

    admin.value.name =
      data.name ||
      'Administrator'

    admin.value.email =
      data.email ||
      'admin@educore.edu'

  }

}

const handleSearch = () => {

  if (!search.value)
    return

  console.log(
    'Searching:',
    search.value
  )

}

const logout = () => {

  sessionStorage.removeItem(
    'educore_auth'
  )

  localStorage.removeItem(
    'token'
  )

  localStorage.removeItem(
    'user'
  )

  router.replace(
    '/welcome'
  )

}

onMounted(() => {

  fetchAdmin()

})

</script>