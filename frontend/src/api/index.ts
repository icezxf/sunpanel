import axios from 'axios'
import type { APIResponse, LoginRequest, LoginResponse, User, Group, Item, Settings } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: LoginRequest) => api.post<APIResponse<LoginResponse>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<APIResponse<User>>('/auth/me'),
  register: (data: LoginRequest & { nickname: string }) => api.post('/auth/register', data)
}

export const userApi = {
  getProfile: () => api.get<APIResponse<User>>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put('/users/profile', data),
  changePassword: (oldPassword: string, newPassword: string) => 
    api.post('/users/change-password', { oldPassword, newPassword })
}

export const groupApi = {
  getList: () => api.get<APIResponse<Group[]>>('/groups'),
  create: (data: Partial<Group>) => api.post('/groups', data),
  update: (id: string, data: Partial<Group>) => api.put(`/groups/${id}`, data),
  delete: (id: string) => api.delete(`/groups/${id}`),
  reorder: (ids: string[]) => api.post('/groups/reorder', { ids })
}

export const itemApi = {
  getList: (groupId?: string) => 
    api.get<APIResponse<Item[]>>('/items', { params: { groupId } }),
  create: (data: Partial<Item>) => api.post('/items', data),
  update: (id: string, data: Partial<Item>) => api.put(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
  reorder: (ids: string[]) => api.post('/items/reorder', { ids })
}

export const settingsApi = {
  get: () => api.get<APIResponse<Settings>>('/settings'),
  update: (data: Partial<Settings>) => api.put('/settings', data)
}

export const dockerApi = {
  getContainers: () => api.get('/docker/containers'),
  startContainer: (id: string) => api.post(`/docker/containers/${id}/start`),
  stopContainer: (id: string) => api.post(`/docker/containers/${id}/stop`),
  restartContainer: (id: string) => api.post(`/docker/containers/${id}/restart`)
}

export const galleryApi = {
  getImages: (type: 'public' | 'user') => api.get(`/gallery/${type}`),
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteImage: (id: string) => api.delete(`/gallery/${id}`)
}

export const exportImportApi = {
  exportData: () => api.get('/export', { responseType: 'blob' }),
  importData: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default api
