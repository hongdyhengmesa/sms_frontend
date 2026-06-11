<template>

  <div class="space-y-5">

    <!-- HEADER -->

    <div
      class="flex items-center justify-between"
    >

      <div>

        <h2
          class="text-xl font-extrabold text-gray-900"
        >
          Settings
        </h2>

        <p
          class="text-sm text-gray-500 mt-0.5"
        >
          Configure your school management system
        </p>

      </div>

      <!-- SAVE BUTTON -->

      <button

        class="btn-primary btn"

        @click="saveSettings"

        :disabled="saving"

      >

        <CheckIcon
          class="w-4 h-4"
        />

        {{ saving ? 'Saving...' : 'Save Changes' }}

      </button>

    </div>

    <!-- LOADING -->

    <div

      v-if="loading"

      class="bg-blue-50 border border-blue-200 rounded-2xl p-4"

    >

      Loading settings...

    </div>

    <!-- CONTENT -->

    <div
      class="grid grid-cols-1 xl:grid-cols-2 gap-6"
    >

      <!-- LEFT -->

      <div class="space-y-6">

        <!-- SCHOOL INFO -->

        <div
          class="card card-shadow p-6"
        >

          <h3
            class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100"
          >
            School Information
          </h3>

          <div class="space-y-4">

            <!-- SCHOOL NAME -->

            <div>

              <label class="form-label">
                School Name
              </label>

              <input

                v-model="school.school_name"

                type="text"

                class="form-input"

              />

            </div>

            <!-- PRINCIPAL -->

            <div>

              <label class="form-label">
                Principal Name
              </label>

              <input

                v-model="school.principal"

                type="text"

                class="form-input"

              />

            </div>

            <!-- EMAIL -->

            <div>

              <label class="form-label">
                School Email
              </label>

              <input

                v-model="school.email"

                type="email"

                class="form-input"

              />

            </div>

            <!-- PHONE -->

            <div>

              <label class="form-label">
                Phone Number
              </label>

              <input

                v-model="school.phone"

                type="text"

                class="form-input"

              />

            </div>

            <!-- ADDRESS -->

            <div>

              <label class="form-label">
                Address
              </label>

              <textarea

                v-model="school.address"

                rows="3"

                class="form-input"

              />

            </div>

          </div>

        </div>

        <!-- ACADEMIC CALENDAR -->

        <div
          class="card card-shadow p-6"
        >

          <h3
            class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100"
          >
            Academic Calendar
          </h3>

          <div class="space-y-4">

            <!-- YEAR -->

            <div>

              <label class="form-label">
                Academic Year
              </label>

              <input

                v-model="school.academic_year"

                class="form-input"

              />

            </div>

            <!-- SEMESTER -->

            <div>

              <label class="form-label">
                Current Semester
              </label>

              <select

                v-model="school.semester"

                class="form-input"

              >

                <option>
                  Semester 1
                </option>

                <option>
                  Semester 2
                </option>

              </select>

            </div>

            <!-- SCALE -->

            <div>

              <label class="form-label">
                Grading Scale
              </label>

              <select

                v-model="school.grading_scale"

                class="form-input"

              >

                <option>
                  100-Point Scale
                </option>

                <option>
                  10.0 GPA Scale
                </option>

                <option>
                  4.0 GPA Scale
                </option>

              </select>

            </div>

            <!-- DATES -->

            <div
              class="grid grid-cols-2 gap-4"
            >

              <div>

                <label class="form-label">
                  Semester Start
                </label>

                <input

                  v-model="school.semester_start"

                  type="date"

                  class="form-input"

                />

              </div>

              <div>

                <label class="form-label">
                  Semester End
                </label>

                <input

                  v-model="school.semester_end"

                  type="date"

                  class="form-input"

                />

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- RIGHT -->

      <div class="space-y-6">

        <!-- NOTIFICATIONS -->

        <div
          class="card card-shadow p-6"
        >

          <h3
            class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100"
          >
            Notifications
          </h3>

          <div
            class="divide-y divide-gray-50"
          >

            <div

              v-for="n in notifications"

              :key="n.key"

              class="flex items-center justify-between py-3.5"

            >

              <div>

                <p
                  class="text-sm font-semibold text-gray-700"
                >

                  {{ n.label }}

                </p>

                <p
                  class="text-xs text-gray-400 mt-0.5"
                >

                  {{ n.desc }}

                </p>

              </div>

              <!-- TOGGLE -->

              <button

                class="relative w-11 h-6 rounded-full transition"

                :class="
                  n.on
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                "

                @click="n.on = !n.on"

              >

                <span

                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"

                  :class="
                    n.on
                      ? 'left-6'
                      : 'left-1'
                  "

                />

              </button>

            </div>

          </div>

        </div>

        <!-- PREFERENCES -->

        <div
          class="card card-shadow p-6"
        >

          <h3
            class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100"
          >
            System Preferences
          </h3>

          <div
            class="divide-y divide-gray-50"
          >

            <div

              v-for="p in preferences"

              :key="p.key"

              class="flex items-center justify-between py-3.5"

            >

              <div>

                <p
                  class="text-sm font-semibold text-gray-700"
                >

                  {{ p.label }}

                </p>

                <p
                  class="text-xs text-gray-400 mt-0.5"
                >

                  {{ p.desc }}

                </p>

              </div>

              <!-- TOGGLE -->

              <button

                class="relative w-11 h-6 rounded-full transition"

                :class="
                  p.on
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                "

                @click="p.on = !p.on"

              >

                <span

                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"

                  :class="
                    p.on
                      ? 'left-6'
                      : 'left-1'
                  "

                />

              </button>

            </div>

          </div>

        </div>

        <!-- ADMIN -->

        <div
          class="card card-shadow p-6"
        >

          <h3
            class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100"
          >
            Administrator Profile
          </h3>

          <div
            class="flex items-center gap-4 mb-4"
          >

            <div

              class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold"

              style="background:linear-gradient(135deg,#3b82f6,#6366f1)"

            >

              AD

            </div>

            <div>

              <p
                class="font-bold text-gray-900"
              >
                Admin User
              </p>

              <p
                class="text-sm text-gray-500"
              >
                admin@educore.edu
              </p>

            </div>

          </div>

          <div class="space-y-3">

            <div>

              <label class="form-label">
                Display Name
              </label>

              <input

                v-model="admin.display_name"

                class="form-input"

              />

            </div>

            <div>

              <label class="form-label">
                New Password
              </label>

              <input

                v-model="admin.password"

                type="password"

                class="form-input"

                placeholder="Leave blank to keep current"

              />

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup>

import {

  ref,
  onMounted,

} from 'vue'

import axios
from 'axios'

import {
  CheckIcon
} from '@heroicons/vue/24/outline'

// ======================
// STATE
// ======================

const loading = ref(false)

const saving = ref(false)

// ======================
// SCHOOL
// ======================

const school = ref({

  school_name: '',
  principal: '',
  email: '',
  phone: '',
  address: '',

  academic_year: '',
  semester: '',
  grading_scale: '',

  semester_start: '',
  semester_end: '',

})

// ======================
// ADMIN
// ======================

const admin = ref({

  display_name:
    'Admin User',

  password: '',

})

// ======================
// NOTIFICATIONS
// ======================

const notifications = ref([

  {

    key: 'email',

    label:
      'Email Notifications',

    desc:
      'Send reports and alerts via email',

    on: true,

  },

  {

    key: 'sms',

    label:
      'SMS Alerts',

    desc:
      'Send critical alerts via SMS',

    on: false,

  },

  {

    key: 'grade',

    label:
      'Grade Published Alerts',

    desc:
      'Notify students when grades are posted',

    on: true,

  },

])

// ======================
// PREFERENCES
// ======================

const preferences = ref([

  {

    key: '2fa',

    label:
      'Two-Factor Authentication',

    desc:
      'Require 2FA for admin logins',

    on: true,

  },

  {

    key: 'archive',

    label:
      'Auto Archive Students',

    desc:
      'Archive graduated students automatically',

    on: false,

  },

])

// ======================
// FETCH SETTINGS
// ======================

const fetchSettings =
  async () => {

    try {

      loading.value = true

      const response =
        await axios.get(
          'http://localhost:3000/settings/1'
        )

      school.value =
        response.data

    } catch (error) {

      console.error(
        'Settings Error:',
        error
      )

    } finally {

      loading.value = false

    }

  }

// ======================
// SAVE SETTINGS
// ======================

const saveSettings =
  async () => {

    try {

      saving.value = true

      await axios.patch(

        'http://localhost:3000/settings/1',

        school.value

      )

      alert(
        '✅ Settings saved successfully'
      )

    } catch (error) {

      console.error(
        'Save Error:',
        error
      )

      alert(
        '❌ Failed to save settings'
      )

    } finally {

      saving.value = false

    }

  }

// ======================
// MOUNT
// ======================

onMounted(() => {

  fetchSettings()

})

</script>