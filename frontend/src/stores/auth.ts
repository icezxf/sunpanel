import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { userApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const fetchUser = async () => {
    if (!token.value) return null
    try {
      const res = await userApi.getProfile()
      user.value = res.data
      return user.value
    } catch {
      logout()
      return null
    }
  }

  return {
    user,
    token,
    setToken,
    setUser,
    logout,
    fetchUser
  }
})
