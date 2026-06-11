<template>
  <div
    class="min-h-screen flex items-center justify-center p-4"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
  >
    <!-- Main Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8">
        
        <!-- Logo Section -->
        <div class="flex flex-col items-center mb-5 md:mb-8">
          <div
            class="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3"
            style="background: linear-gradient(135deg, #667eea, #764ba2);"
          >
            <svg class="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="text-xl md:text-2xl font-bold text-gray-800">
            Edu<span class="text-purple-600">Core</span>
          </span>
          <p class="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">School Management Portal</p>
        </div>

        <!-- Welcome Text -->
        <div class="text-center mb-6 md:mb-8">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-0.5 md:mb-1">Welcome back</h1>
          <p class="text-gray-500 text-xs md:text-sm">Sign in to continue your journey</p>
        </div>

        <!-- Error Alert -->
        <Transition name="slide-down">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 md:px-4 py-2 md:py-3 mb-4 md:mb-6 flex items-start gap-2 md:gap-3 text-sm md:text-base"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span class="flex-1">{{ error }}</span>
            <button @click="error = ''" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
          </div>
        </Transition>

        <!-- Login Form -->
        <form @submit.prevent="submit" class="space-y-4 md:space-y-5">
          <!-- Email Field -->
          <div>
            <label class="text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2 block">Email Address</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                class="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm md:text-base"
                :class="{ 'border-red-400': emailError }"
                placeholder="admin@school.com"
                @input="emailError = false"
              />
            </div>
            <Transition name="fade">
              <p v-if="emailError" class="text-red-500 text-[11px] md:text-xs mt-1">Please enter a valid email address</p>
            </Transition>
          </div>

          <!-- Password Field -->
          <div>
            <label class="text-gray-700 text-xs md:text-sm font-medium mb-1 md:mb-2 block">Password</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                class="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2.5 md:py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm md:text-base"
                :class="{ 'border-red-400': passwordError }"
                placeholder="••••••••"
                @input="passwordError = false"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                @click="showPass = !showPass"
              >
                <svg v-if="!showPass" class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <Transition name="fade">
              <p v-if="passwordError" class="text-red-500 text-[11px] md:text-xs mt-1">Password is required</p>
            </Transition>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <a href="#" class="text-xs md:text-sm text-purple-600 hover:text-purple-700 transition-colors">Forgot password?</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2.5 md:py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            style="background: linear-gradient(135deg, #667eea, #764ba2);"
          >
            <span class="flex items-center justify-center gap-2 text-sm md:text-base">
              <svg v-if="!loading" class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <div v-else class="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ loading ? 'Signing in...' : 'Sign In to Dashboard' }}
            </span>
          </button>

          <!-- Demo Credentials - Responsive Layout -->
          <div class="mt-5 md:mt-6 pt-4 border-t border-gray-200">
            <p class="text-gray-400 text-[10px] md:text-xs text-center mb-2">Demo Credentials</p>
            <div class="flex flex-col xs:flex-row justify-center gap-2 md:gap-4 text-xs">
              <div class="bg-gray-50 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-center">
                <span class="text-gray-500 text-[10px] md:text-xs">Email:</span>
                <span class="text-purple-600 ml-1 text-[10px] md:text-xs font-mono">admin@gmail.com</span>
              </div>
              <div class="bg-gray-50 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-center">
                <span class="text-gray-500 text-[10px] md:text-xs">Password:</span>
                <span class="text-purple-600 ml-1 text-[10px] md:text-xs font-mono">password123</span>
              </div>
            </div>
          </div>

          <!-- Sign Up Link for mobile -->
          <div class="text-center pt-2">
            <p class="text-gray-500 text-xs">
              Don't have an account? 
              <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">Contact Admin</a>
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-4 md:mt-6">
        <p class="text-white/70 text-[10px] md:text-xs">
          © 2025 EduCore. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const showPass = ref(false)
const error = ref('')
const loading = ref(false)
const emailError = ref(false)
const passwordError = ref(false)

// Validation
const validateForm = () => {
  let isValid = true
  
  if (!email.value) {
    emailError.value = true
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = true
    isValid = false
  } else {
    emailError.value = false
  }
  
  if (!password.value) {
    passwordError.value = true
    isValid = false
  } else {
    passwordError.value = false
  }
  
  return isValid
}

// Submit handler
async function submit() {
  error.value = ''
  
  if (!validateForm()) {
    error.value = 'Please fix the errors above'
    return
  }
  
  loading.value = true
  
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    
    // Store auth data
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    sessionStorage.setItem('educore_auth', 'true')
    
    // Optional: Set auth header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
    
    // Redirect with a slight delay for better UX
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (err) {
    console.error('Login error:', err)
    
    // Handle different error scenarios
    if (err.response?.status === 401) {
      error.value = 'Invalid email or password. Please try again.'
    } else if (err.response?.status === 404) {
      error.value = 'Authentication service unavailable. Please try again later.'
    } else if (err.code === 'ERR_NETWORK') {
      error.value = 'Network error. Please check your connection.'
    } else {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
    }
    
    // Shake animation on error
    const form = document.querySelector('form')
    if (form) {
      form.classList.add('animate-shake')
      setTimeout(() => form.classList.remove('animate-shake'), 500)
    }
  } finally {
    loading.value = false
  }
}

// Optional: Auto-fill demo credentials for testing
const fillDemoCredentials = () => {
  email.value = 'admin@gmail.com'
  password.value = 'password123'
}
</script>

<style scoped>
/* Custom breakpoint for extra small screens (480px) */
@media (min-width: 480px) {
  .xs\:flex-row {
    flex-direction: row;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Smooth focus ring */
input:focus {
  outline: none;
}

/* Disable button hover effects when disabled */
button:disabled {
  cursor: not-allowed;
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button, 
  input,
  .relative button {
    min-height: 44px;
  }
}
</style>