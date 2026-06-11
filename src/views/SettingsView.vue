<template>
  <div class="space-y-4 md:space-y-5">
    <!-- HEADER - Responsive -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900">
          Settings
        </h2>
        <p class="text-xs md:text-sm text-gray-500 mt-0.5">
          Configure your school management system
        </p>
      </div>

      <!-- SAVE BUTTON - Mobile friendly -->
      <button
        class="btn-primary btn gap-2 text-sm md:text-base"
        @click="saveSettings"
        :disabled="saving"
      >
        <CheckIcon class="w-4 h-4" />
        <span class="hidden xs:inline">{{ saving ? 'Saving...' : 'Save Changes' }}</span>
        <span class="xs:hidden">{{ saving ? 'Saving' : 'Save' }}</span>
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm md:text-base">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Loading settings...
      </div>
    </div>

    <!-- CONTENT - Responsive Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
      <!-- LEFT COLUMN -->
      <div class="space-y-4 md:space-y-6">
        <!-- SCHOOL INFO -->
        <div class="card card-shadow p-4 md:p-6">
          <h3 class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">
            School Information
          </h3>

          <div class="space-y-3 md:space-y-4">
            <!-- SCHOOL NAME -->
            <div>
              <label class="form-label">School Name</label>
              <input
                v-model="school.school_name"
                type="text"
                class="form-input text-sm md:text-base"
                placeholder="Enter school name"
              />
            </div>

            <!-- PRINCIPAL -->
            <div>
              <label class="form-label">Principal Name</label>
              <input
                v-model="school.principal"
                type="text"
                class="form-input text-sm md:text-base"
                placeholder="Enter principal name"
              />
            </div>

            <!-- EMAIL -->
            <div>
              <label class="form-label">School Email</label>
              <input
                v-model="school.email"
                type="email"
                class="form-input text-sm md:text-base"
                placeholder="school@example.com"
              />
            </div>

            <!-- PHONE -->
            <div>
              <label class="form-label">Phone Number</label>
              <input
                v-model="school.phone"
                type="text"
                class="form-input text-sm md:text-base"
                placeholder="+855 12 345 678"
              />
            </div>

            <!-- ADDRESS -->
            <div>
              <label class="form-label">Address</label>
              <textarea
                v-model="school.address"
                rows="3"
                class="form-input text-sm md:text-base resize-none"
                placeholder="School address"
              />
            </div>
          </div>
        </div>

        <!-- ACADEMIC CALENDAR -->
        <div class="card card-shadow p-4 md:p-6">
          <h3 class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">
            Academic Calendar
          </h3>

          <div class="space-y-3 md:space-y-4">
            <!-- YEAR -->
            <div>
              <label class="form-label">Academic Year</label>
              <input
                v-model="school.academic_year"
                class="form-input text-sm md:text-base"
                placeholder="2024-2025"
              />
            </div>

            <!-- SEMESTER -->
            <div>
              <label class="form-label">Current Semester</label>
              <select v-model="school.semester" class="form-input text-sm md:text-base">
                <option>Semester 1</option>
                <option>Semester 2</option>
              </select>
            </div>

            <!-- GRADING SCALE -->
            <div>
              <label class="form-label">Grading Scale</label>
              <select v-model="school.grading_scale" class="form-input text-sm md:text-base">
                <option>100-Point Scale</option>
                <option>10.0 GPA Scale</option>
                <option>4.0 GPA Scale</option>
              </select>
            </div>

            <!-- DATES - Responsive Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label class="form-label">Semester Start</label>
                <input
                  v-model="school.semester_start"
                  type="date"
                  class="form-input text-sm md:text-base"
                />
              </div>
              <div>
                <label class="form-label">Semester End</label>
                <input
                  v-model="school.semester_end"
                  type="date"
                  class="form-input text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="space-y-4 md:space-y-6">
        <!-- NOTIFICATIONS -->
        <div class="card card-shadow p-4 md:p-6">
          <h3 class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">
            Notifications
          </h3>

          <div class="divide-y divide-gray-50">
            <div
              v-for="n in notifications"
              :key="n.key"
              class="flex flex-col xs:flex-row xs:items-center justify-between py-3 md:py-3.5 gap-2 xs:gap-3"
            >
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-700">{{ n.label }}</p>
                <p class="text-[11px] md:text-xs text-gray-400 mt-0.5">{{ n.desc }}</p>
              </div>

              <!-- TOGGLE SWITCH -->
              <button
                class="relative w-11 h-6 rounded-full transition flex-shrink-0"
                :class="n.on ? 'bg-indigo-600' : 'bg-gray-200'"
                @click="n.on = !n.on"
              >
                <span
                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                  :class="n.on ? 'left-6' : 'left-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- SYSTEM PREFERENCES -->
        <div class="card card-shadow p-4 md:p-6">
          <h3 class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">
            System Preferences
          </h3>

          <div class="divide-y divide-gray-50">
            <div
              v-for="p in preferences"
              :key="p.key"
              class="flex flex-col xs:flex-row xs:items-center justify-between py-3 md:py-3.5 gap-2 xs:gap-3"
            >
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-700">{{ p.label }}</p>
                <p class="text-[11px] md:text-xs text-gray-400 mt-0.5">{{ p.desc }}</p>
              </div>

              <!-- TOGGLE SWITCH -->
              <button
                class="relative w-11 h-6 rounded-full transition flex-shrink-0"
                :class="p.on ? 'bg-indigo-600' : 'bg-gray-200'"
                @click="p.on = !p.on"
              >
                <span
                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                  :class="p.on ? 'left-6' : 'left-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- ADMINISTRATOR PROFILE -->
        <div class="card card-shadow p-4 md:p-6">
          <h3 class="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">
            Administrator Profile
          </h3>

          <div class="flex flex-col xs:flex-row xs:items-center gap-3 md:gap-4 mb-4">
            <div
              class="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white text-base md:text-lg font-bold flex-shrink-0"
              style="background:linear-gradient(135deg,#3b82f6,#6366f1)"
            >
              AD
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm md:text-base">Admin User</p>
              <p class="text-xs md:text-sm text-gray-500 break-all">admin@educore.edu</p>
            </div>
          </div>

          <div class="space-y-3 md:space-y-4">
            <div>
              <label class="form-label">Display Name</label>
              <input
                v-model="admin.display_name"
                class="form-input text-sm md:text-base"
                placeholder="Display name"
              />
            </div>
            <div>
              <label class="form-label">New Password</label>
              <input
                v-model="admin.password"
                type="password"
                class="form-input text-sm md:text-base"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Floating Save Button (optional, appears when scrolling) -->
    <div
      v-if="!saving && !loading"
      class="fixed bottom-4 right-4 z-40 md:hidden"
    >
      <button
        @click="saveSettings"
        class="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        <CheckIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { CheckIcon } from '@heroicons/vue/24/outline'

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
  display_name: 'Admin User',
  password: '',
})

// ======================
// NOTIFICATIONS
// ======================

const notifications = ref([
  {
    key: 'email',
    label: 'Email Notifications',
    desc: 'Send reports and alerts via email',
    on: true,
  },
  {
    key: 'sms',
    label: 'SMS Alerts',
    desc: 'Send critical alerts via SMS',
    on: false,
  },
  {
    key: 'grade',
    label: 'Grade Published Alerts',
    desc: 'Notify students when grades are posted',
    on: true,
  },
])

// ======================
// PREFERENCES
// ======================

const preferences = ref([
  {
    key: '2fa',
    label: 'Two-Factor Authentication',
    desc: 'Require 2FA for admin logins',
    on: true,
  },
  {
    key: 'archive',
    label: 'Auto Archive Students',
    desc: 'Archive graduated students automatically',
    on: false,
  },
])

// ======================
// FETCH SETTINGS
// ======================

const fetchSettings = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3000/settings/1')
    school.value = response.data
  } catch (error) {
    console.error('Settings Error:', error)
  } finally {
    loading.value = false
  }
}

// ======================
// SAVE SETTINGS
// ======================

const saveSettings = async () => {
  try {
    saving.value = true
    await axios.patch('http://localhost:3000/settings/1', school.value)
    alert('✅ Settings saved successfully')
  } catch (error) {
    console.error('Save Error:', error)
    alert('❌ Failed to save settings')
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

<style scoped>
/* Custom breakpoint for extra small screens (480px) */
@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
  .xs\:items-center {
    align-items: center;
  }
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

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  ring: 2px solid #e0e7ff;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.card {
  background-color: white;
  border-radius: 1rem;
}

.card-shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>