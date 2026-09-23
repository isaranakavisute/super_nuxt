import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  })

  const token = useCookie<string | null>('auth_token')

  api.interceptors.request.use((request) => {
    if (token.value) {
      request.headers.Authorization = `Bearer ${token.value}`
    }
    return request
  })

  api.interceptors.response.use(
    response => response,
    (error) => {
      if (error.response?.status === 401) {
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: { api }
  }
})
