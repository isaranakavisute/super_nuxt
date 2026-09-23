<script setup lang="ts">
import axios from 'axios'

useHead({ title: 'Login' })

const api = useApi()
const token = useCookie<string | null>('auth_token')

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true
  try {
    const { data } = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    // Guard against non-API responses (e.g. an HTML page) being treated as success
    if (!data || typeof data !== 'object' || !data.token) {
      throw new Error('Unexpected response from the login endpoint.')
    }

    token.value = data.token
    await navigateTo('/')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.status === 401
        ? 'Invalid email or password.'
        : err.response?.data?.message ?? 'Login failed. Please try again.'
    } else {
      error.value = err instanceof Error ? err.message : 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-2xl font-bold text-gray-900">Sign in</h1>

      <form class="space-y-4" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          >
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          >
        </div>

        <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </main>
</template>
