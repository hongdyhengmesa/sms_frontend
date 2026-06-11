<template>

  <div class="space-y-5">

    <!-- HEADER -->

    <div
      class="flex items-center justify-between"
    >

      <div>

        <h2
          class="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          GPA Analytics
        </h2>

        <p
          class="text-sm text-gray-500 mt-0.5"
        >
          Academic performance insights and trends
        </p>

      </div>

      <button

        @click="fetchAnalytics"

        class="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition"

      >
        Refresh Analytics
      </button>

    </div>

    <!-- LOADING -->

    <div
      v-if="loading"
      class="bg-blue-50 border border-blue-200 rounded-2xl p-4"
    >

      Loading analytics...

    </div>

    <!-- KPI CARDS -->

    <div
      class="grid grid-cols-2 xl:grid-cols-4 gap-5"
    >

      <!-- SCHOOL GPA -->

      <StatCard

        :icon="ArrowTrendingUpIcon"

        :value="schoolAverage"

        label="School Avg GPA"

        trend="Connected from backend"

        accent="#2563eb"

        bgLight="#eff6ff"

      />

      <!-- PASS RATE -->

      <StatCard

        :icon="CheckCircleIcon"

        :value="passRate + '%'"

        label="Pass Rate"

        trend="Student pass performance"

        accent="#16a34a"

        bgLight="#f0fdf4"

      />

      <!-- ATTENDANCE -->

      <StatCard

        :icon="ClockIcon"

        value="94.2%"

        label="Attendance Rate"

        trend="School attendance"

        accent="#d97706"

        bgLight="#fffbeb"

      />

      <!-- HONOR -->

      <StatCard

        :icon="StarIcon"

        :value="honorStudents"

        label="Honor Students"

        trend="Students above 90%"

        accent="#7c3aed"

        bgLight="#faf5ff"

      />

    </div>

    <!-- CHARTS -->

    <div
      class="grid grid-cols-1 xl:grid-cols-2 gap-5"
    >

      <!-- BAR -->

      <div
        class="card card-shadow"
      >

        <div
          class="px-6 pt-5 mb-4"
        >

          <h3
            class="text-sm font-bold text-gray-900"
          >
            GPA Distribution by Class
          </h3>

          <p
            class="text-xs text-gray-500 mt-0.5"
          >
            Average class GPA from backend
          </p>

        </div>

        <div
          class="px-4 pb-5"
        >

          <Bar

            :data="barData"

            :options="barOpts"

            style="height:240px;"

          />

        </div>

      </div>

      <!-- RADAR -->

      <div
        class="card card-shadow"
      >

        <div
          class="px-6 pt-5 mb-4"
        >

          <h3
            class="text-sm font-bold text-gray-900"
          >
            Subject Performance Radar
          </h3>

          <p
            class="text-xs text-gray-500 mt-0.5"
          >
            Subject analytics from backend
          </p>

        </div>

        <div
          class="px-4 pb-5 flex justify-center"
        >

          <Radar

            :data="radarData"

            :options="radarOpts"

            style="height:240px;width:100%;"

          />

        </div>

      </div>

    </div>

    <!-- TREND -->

    <div
      class="card card-shadow"
    >

      <div
        class="px-6 pt-5 mb-4"
      >

        <h3
          class="text-sm font-bold text-gray-900"
        >
          GPA Trend
        </h3>

        <p
          class="text-xs text-gray-500 mt-0.5"
        >
          GPA trend by classes
        </p>

      </div>

      <div
        class="px-4 pb-5"
      >

        <Line

          :data="trendData"

          :options="trendOpts"

          style="height:220px;"

        />

      </div>

    </div>

    <!-- SUBJECT TABLE -->

    <div
      class="card card-shadow"
    >

      <div
        class="px-6 pt-5 pb-4 border-b border-gray-100"
      >

        <h3
          class="text-sm font-bold text-gray-900"
        >
          Subject Performance Breakdown
        </h3>

      </div>

      <div
        class="overflow-x-auto"
      >

        <table
          class="min-w-full text-sm"
        >

          <thead
            class="bg-gray-50 text-gray-500 uppercase text-xs"
          >

            <tr>

              <th class="px-5 py-4 text-left">
                Subject
              </th>

              <th class="px-5 py-4 text-left">
                Avg Score
              </th>

              <th class="px-5 py-4 text-left">
                Top Score
              </th>

              <th class="px-5 py-4 text-left">
                Students
              </th>

              <th class="px-5 py-4 text-left">
                Trend
              </th>

            </tr>

          </thead>

          <tbody>

            <tr

              v-for="s in subjectStats"

              :key="s.name"

              class="border-t border-gray-100 hover:bg-gray-50"

            >

              <!-- SUBJECT -->

              <td
                class="px-5 py-4 font-semibold text-gray-800"
              >

                {{ s.name }}

              </td>

              <!-- AVG -->

              <td
                class="px-5 py-4"
              >

                <div
                  class="flex items-center gap-2"
                >

                  <div
                    class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"
                  >

                    <div

                      class="h-full rounded-full"

                      :style="{

                        width:
                          s.avg + '%',

                        background:
                          avgColor(s.avg)

                      }"

                    />

                  </div>

                  <span
                    class="font-bold text-gray-800"
                  >

                    {{ s.avg }}%

                  </span>

                </div>

              </td>

              <!-- TOP -->

              <td
                class="px-5 py-4 font-bold text-gray-700"
              >

                {{ s.top }}

              </td>

              <!-- STUDENTS -->

              <td
                class="px-5 py-4"
              >

                {{ s.enrolled }}

              </td>

              <!-- TREND -->

              <td
                class="px-5 py-4"
              >

                <span

                  class="font-bold"

                  :class="
                    s.up
                      ? 'text-green-600'
                      : 'text-red-500'
                  "

                >

                  {{
                    s.up
                      ? '↑'
                      : '↓'
                  }}

                  {{ s.trendVal }}

                </span>

              </td>

            </tr>

          </tbody>

        </table>

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
  Bar,
  Line,
  Radar,
} from 'vue-chartjs'

import {

  Chart as ChartJS,

  BarElement,
  LineElement,
  PointElement,

  RadialLinearScale,
  LinearScale,
  CategoryScale,

  Filler,
  Tooltip,
  Legend,

} from 'chart.js'

import {

  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,

} from '@heroicons/vue/24/outline'

import StatCard
from '../components/StatCard.vue'

// ======================
// REGISTER
// ======================

ChartJS.register(

  BarElement,
  LineElement,
  PointElement,

  RadialLinearScale,
  LinearScale,
  CategoryScale,

  Filler,
  Tooltip,
  Legend,

)

// ======================
// STATE
// ======================

const loading = ref(false)

const scores = ref([])

// ======================
// FETCH BACKEND
// ======================

const fetchAnalytics =
  async () => {

    try {

      loading.value = true

      const response =
        await axios.get(
          'http://localhost:3000/scores'
        )

      scores.value =
        response.data

    } catch (error) {

      console.error(
        'Analytics Error:',
        error
      )

    } finally {

      loading.value = false

    }

  }

onMounted(() => {

  fetchAnalytics()

})

// ======================
// KPI
// ======================

const schoolAverage =
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

const passRate =
  computed(() => {

    if (!scores.value.length)
      return 0

    const passed =
      scores.value.filter(

        s =>
          Number(s.average) >= 50

      ).length

    return (
      (passed /
        scores.value.length) *
      100
    ).toFixed(1)

  })

const honorStudents =
  computed(() => {

    return scores.value.filter(

      s =>
        Number(s.average) >= 90

    ).length

  })

// ======================
// CLASS GPA
// ======================

const classGroups =
  computed(() => {

    const map = {}

    scores.value.forEach((s) => {

      if (!map[s.class_name]) {

        map[s.class_name] = []

      }

      map[s.class_name].push(
        Number(s.average)
      )

    })

    return map

  })

const classLabels =
  computed(() =>
    Object.keys(
      classGroups.value
    )
  )

const classAverages =
  computed(() =>

    Object.values(
      classGroups.value
    ).map((arr) => {

      const total =
        arr.reduce(
          (a, b) => a + b,
          0
        )

      return (
        total / arr.length
      ).toFixed(1)

    })

  )

// ======================
// BAR CHART
// ======================

const barData =
  computed(() => ({

    labels:
      classLabels.value,

    datasets: [

      {

        label:
          'Class GPA',

        data:
          classAverages.value,

        backgroundColor:
          'rgba(99,102,241,.75)',

        borderRadius: 8,

      }

    ]

  }))

const barOpts = {

  responsive: true,

  maintainAspectRatio: false,

}

// ======================
// SUBJECT ANALYTICS
// ======================

const avgSubject =
  (subject) => {

    if (!scores.value.length)
      return 0

    const total =
      scores.value.reduce(

        (sum, s) =>
          sum +
          Number(s[subject]),

        0

      )

    return (
      total /
      scores.value.length
    ).toFixed(1)

  }

// ======================
// RADAR
// ======================

const radarData =
  computed(() => ({

    labels: [

      'Math',
      'Khmer',
      'Physics',
      'Chemistry',
      'Biology',
      'English',

    ],

    datasets: [

      {

        label:
          'School Average',

        data: [

          avgSubject('math'),
          avgSubject('khmer'),
          avgSubject('physics'),
          avgSubject('chemistry'),
          avgSubject('biology'),
          avgSubject('english'),

        ],

        borderColor:
          '#6366f1',

        backgroundColor:
          'rgba(99,102,241,.15)',

        borderWidth: 2,

      }

    ]

  }))

const radarOpts = {

  responsive: true,

  maintainAspectRatio: false,

}

// ======================
// TREND
// ======================

const trendData =
  computed(() => ({

    labels:
      classLabels.value,

    datasets: [

      {

        label:
          'Average GPA',

        data:
          classAverages.value,

        borderColor:
          '#3b82f6',

        tension: .4,

        borderWidth: 3,

        fill: false,

      }

    ]

  }))

const trendOpts = {

  responsive: true,

  maintainAspectRatio: false,

}

// ======================
// SUBJECT TABLE
// ======================

const subjectStats =
  computed(() => [

    {

      name: 'Mathematics',

      avg:
        avgSubject('math'),

      pass: 88,

      top:
        Math.max(

          ...scores.value.map(
            s => s.math
          )

        ),

      enrolled:
        scores.value.length,

      up: true,

      trendVal: '2.1%',

    },

    {

      name: 'Khmer',

      avg:
        avgSubject('khmer'),

      pass: 85,

      top:
        Math.max(

          ...scores.value.map(
            s => s.khmer
          )

        ),

      enrolled:
        scores.value.length,

      up: true,

      trendVal: '1.5%',

    },

    {

      name: 'Physics',

      avg:
        avgSubject('physics'),

      pass: 82,

      top:
        Math.max(

          ...scores.value.map(
            s => s.physics
          )

        ),

      enrolled:
        scores.value.length,

      up: false,

      trendVal: '0.8%',

    },

  ])

// ======================
// COLORS
// ======================

const avgColor =
  (v) =>

    v >= 82

      ? '#22c55e'

      : v >= 72

        ? '#3b82f6'

        : '#f59e0b'

</script>