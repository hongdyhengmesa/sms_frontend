<template>

  <div class="space-y-6">

    <!-- HEADER -->

    <div
      class="flex items-center justify-between"
    >

      <div>

        <h1
          class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          School Dashboard
        </h1>

        <p
          class="text-gray-500 mt-1"
        >
          Overview of students and academic performance
        </p>

      </div>

      <button

        @click="fetchDashboard"

        class="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition"

      >
        Refresh Data
      </button>

    </div>

    <!-- LOADING -->

    <div
      v-if="loading"
      class="bg-blue-50 border border-blue-200 rounded-2xl p-4"
    >

      Loading dashboard...

    </div>

    <!-- STATS -->

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
    >

      <StatCard

        :icon="UserGroupIcon"

        :value="totalStudents"

        label="Students"

        trend="Registered students"

        accent="#2563eb"

        bgLight="#eff6ff"

      />

      <StatCard

        :icon="AcademicCapIcon"

        :value="totalTeachers"

        label="Teachers"

        trend="Teaching staff"

        accent="#4f46e5"

        bgLight="#eef2ff"

      />

      <StatCard

        :icon="TableCellsIcon"

        :value="totalClasses"

        label="Classes"

        trend="Available classes"

        accent="#16a34a"

        bgLight="#f0fdf4"

      />

      <StatCard

        :icon="ChartBarIcon"

        :value="averageScore + '%'"

        label="Average"

        trend="Academic performance"

        accent="#d97706"

        bgLight="#fffbeb"

      />

    </div>

    <!-- CHARTS -->

    <div
      class="grid grid-cols-1 xl:grid-cols-3 gap-5"
    >

      <!-- LINE -->

      <div
        class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 xl:col-span-2"
      >

        <h3
          class="text-xl font-black mb-6"
        >
          Student Performance
        </h3>

        <div class="h-[350px]">

          <Line

            :data="lineData"

            :options="lineOpts"

          />

        </div>

      </div>

      <!-- DONUT -->

      <div
        class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
      >

        <h3
          class="text-xl font-black mb-6"
        >
          Grade Distribution
        </h3>

        <div class="h-[300px]">

          <Doughnut

            :data="donutData"

            :options="donutOpts"

          />

        </div>

        <!-- LEGEND -->

        <div
          class="space-y-3 mt-5"
        >

          <div

            v-for="l in donutLegend"

            :key="l.label"

            class="flex items-center justify-between"

          >

            <div
              class="flex items-center gap-2"
            >

              <span

                class="w-3 h-3 rounded-full"

                :style="{
                  background: l.color
                }"

              />

              <span
                class="text-sm text-gray-700"
              >

                {{ l.label }}

              </span>

            </div>

            <span
              class="font-bold text-gray-900"
            >

              {{ l.pct }}

            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup>

import {

  ref,
  computed,
  onMounted,

} from 'vue'

import axios
from 'axios'

import {
  Line,
  Doughnut,
} from 'vue-chartjs'

import {

  Chart as ChartJS,

  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,

  ArcElement,
  Filler,
  Tooltip,
  Legend,

} from 'chart.js'

import {

  UserGroupIcon,
  AcademicCapIcon,
  TableCellsIcon,
  ChartBarIcon,

} from '@heroicons/vue/24/outline'

import StatCard
from '../components/StatCard.vue'

// ======================
// REGISTER CHART
// ======================

ChartJS.register(

  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,

  ArcElement,
  Filler,
  Tooltip,
  Legend,

)

// ======================
// STATE
// ======================

const loading = ref(false)

const scores = ref([])

const teachers = ref([])

const students = ref([])

const classes = ref([])

// ======================
// FETCH BACKEND
// ======================

const fetchDashboard = async () => {

  try {

    loading.value = true

    const [

      scoreResponse,
      teacherResponse,
      studentResponse,
      classResponse,

    ] = await Promise.all([

      axios.get(
        'http://localhost:3000/scores'
      ),

      axios.get(
        'http://localhost:3000/teachers'
      ),

      axios.get(
        'http://localhost:3000/students'
      ),

      axios.get(
        'http://localhost:3000/classes'
      ),

    ])

    scores.value =
      scoreResponse.data

    teachers.value =
      teacherResponse.data

    students.value =
      studentResponse.data

    classes.value =
      classResponse.data

    console.log(
      'Students:',
      students.value
    )

    console.log(
      'Teachers:',
      teachers.value
    )

    console.log(
      'Classes:',
      classes.value
    )

    console.log(
      'Scores:',
      scores.value
    )

  } catch (error) {

    console.error(
      'Dashboard Error:',
      error
    )

  } finally {

    loading.value = false

  }

}

onMounted(() => {

  fetchDashboard()

})

// ======================
// UNIQUE STUDENTS
// ======================

const uniqueStudents =
  computed(() => {

    const map = new Map()

    scores.value.forEach((s) => {

      if (
        !map.has(
          s.student_name
        )
      ) {

        map.set(
          s.student_name,
          s
        )

      }

    })

    return [...map.values()]

  })

// ======================
// STATS
// ======================

const totalStudents =
  computed(() => {

    return students.value.length

  })

const totalTeachers =
  computed(() => {

    return teachers.value.length

  })

const totalClasses =
  computed(() => {

    return classes.value.length

  })

const averageScore =
  computed(() => {

    if (!scores.value.length)
      return 0

    const total =
      scores.value.reduce(

        (sum, s) =>

          sum +
          Number(s.average),

        0

      )

    return (

      total /
      scores.value.length

    ).toFixed(2)

  })

// ======================
// TOP STUDENTS
// ======================

const topStudents =
  computed(() => {

    return [...uniqueStudents.value]

      .sort(

        (a, b) =>
          b.total - a.total

      )

      .slice(0, 5)

      .map((s) => ({

        id: s.id,

        name:
          s.student_name,

        class:
          s.class_name,

        gpa:
          s.average + '%',

        initials:
          s.student_name
            .charAt(0),

        color:
          '#6366f1',

      }))

  })

// ======================
// ACTIVITIES
// ======================

const activities =
  computed(() => {

    return [...scores.value]

      .slice(0, 5)

      .map((s) => ({

        id: s.id,

        text:
          `${s.student_name} received Grade ${s.grade}`,

        time:
          new Date(
            s.created_at
          ).toLocaleDateString(),

        color:
          '#3b82f6',

      }))

  })

// ======================
// LINE CHART
// ======================

const lineData =
  computed(() => ({

    labels:
      topStudents.value.map(
        s => s.name
      ),

    datasets: [

      {

        label:
          'Average Score',

        data:
          topStudents.value.map(
            s => Number(
              s.gpa.replace('%', '')
            )
          ),

        borderColor:
          '#6366f1',

        backgroundColor:
          'rgba(99,102,241,.1)',

        tension: .4,

        fill: true,

        pointRadius: 4,

        pointHoverRadius: 6,

        borderWidth: 3,

      }

    ]

  }))

const lineOpts = {

  responsive: true,

  maintainAspectRatio: false,

  plugins: {

    legend: {

      position: 'top',

    }

  },

  scales: {

    y: {

      min: 0,

      max: 100,

    }

  }

}

// ======================
// DONUT CHART
// ======================

const gradeCounts =
  computed(() => {

    const counts = {

      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,

    }

    scores.value.forEach((s) => {

      if (
        counts[s.grade]
        !== undefined
      ) {

        counts[s.grade]++

      }

    })

    return counts

  })

const donutData =
  computed(() => ({

    labels: [

      'Grade A',
      'Grade B',
      'Grade C',
      'Grade D',
      'Grade F',

    ],

    datasets: [

      {

        data: [

          gradeCounts.value.A,
          gradeCounts.value.B,
          gradeCounts.value.C,
          gradeCounts.value.D,
          gradeCounts.value.F,

        ],

        backgroundColor: [

          '#22c55e',
          '#3b82f6',
          '#f59e0b',
          '#f97316',
          '#ef4444',

        ],

        borderWidth: 0,

      }

    ]

  }))

const donutOpts = {

  responsive: true,

  maintainAspectRatio: false,

  cutout: '70%',

  plugins: {

    legend: {

      display: false,

    }

  }

}

const donutLegend =
  computed(() => [

    {

      label: 'Grade A',
      color: '#22c55e',
      pct:
        gradeCounts.value.A,

    },

    {

      label: 'Grade B',
      color: '#3b82f6',
      pct:
        gradeCounts.value.B,

    },

    {

      label: 'Grade C',
      color: '#f59e0b',
      pct:
        gradeCounts.value.C,

    },

    {

      label: 'Grade D',
      color: '#f97316',
      pct:
        gradeCounts.value.D,

    },

    {

      label: 'Grade F',
      color: '#ef4444',
      pct:
        gradeCounts.value.F,

    },

  ])

</script>
