
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'

const LandingPage = () => import('../views/LandingPage.vue')
const LoginView = () => import('../views/LoginView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const StudentsView = () => import('../views/StudentsView.vue')
const TeachersView = () => import('../views/TeachersView.vue')
const SubjectsView = () => import('../views/SubjectsView.vue')
const ClassesView = () => import('../views/ClassesView.vue')
const ScoresView = () => import('../views/ScoresView.vue')
const ReportView = () => import('../views/ReportView.vue')
const AnalyticsView = () => import('../views/AnalyticsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AttendanceView = () => import('../views/AttendanceView.vue')

const routes = [
  {
    path: '/welcome',
    name: 'landing',
    component: LandingPage,
    meta: {
      public: true,
      title: 'Welcome',
    },

  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      public: true,
      title: 'Login',
    },
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
          title: 'Dashboard',
        },
      },

      {
        path: 'students',
        name: 'students',
        component: StudentsView,
        meta: {
          title: 'Student Management',
        },

      },

      {
        path: 'teachers',
        name: 'teachers',
        component: TeachersView,
        meta: {
          title: 'Teacher Management',
        },
      },

      {
        path: 'subjects',
        name: 'subjects',
        component: SubjectsView,
        meta: {
          title: 'Subject Management',
        },
      },

      {
        path: 'classes',
        name: 'classes',
        component: ClassesView,
        meta: {
          title: 'Class Management',
        },
      },

      {
        path: 'attendance',
        name: 'attendance',
        component: AttendanceView,
        meta: {
          title: 'Attendance Management',
        },
      },

      {
        path: 'scores',
        name: 'scores',
        component: ScoresView,
        meta: {
          title: 'Score Management',
        },
      },

      {
        path: 'report',
        name: 'report',
        component: ReportView,
        meta: {
          title: 'Reports',
        },
      },

      {
        path: 'analytics',
        name: 'analytics',
        component: AnalyticsView,
        meta: {
          title: 'Analytics',
        },
      },

      {
        path: 'settings',
        name: 'settings',
        component: SettingsView,
        meta: {
          title: 'Settings',
        },
      },

    ],

  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/welcome',
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

router.beforeEach((to) => {
  const isAuthenticated =
    sessionStorage.getItem(
      'educore_auth'
    ) === 'true'

  document.title = to.meta?.title
    ? `${to.meta.title} | EduCore`
    : 'EduCore'
  if (to.meta?.public) {
    return true
  }

  if (!isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect:
          to.fullPath,
      },
    }
  }
  return true
})

export default router