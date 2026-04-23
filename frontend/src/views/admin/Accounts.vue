<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">账号管理</h3>
        <button @click="showAddModal = true" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Icon icon="ph:user-plus-bold" class="w-5 h-5" />
          添加账号
        </button>
      </div>
      <div class="p-6">
        <div class="space-y-3">
          <div 
            v-for="user in users" 
            :key="user.id"
            class="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
              {{ user.nickname?.charAt(0) || user.username.charAt(0) }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-700 dark:text-slate-300">{{ user.nickname || user.username }}</p>
              <p class="text-sm text-slate-500">{{ user.email }}</p>
            </div>
            <div class="px-3 py-1 rounded-full text-xs font-medium" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-400'">
              {{ user.role === 'admin' ? '管理员' : '用户' }}
            </div>
            <div class="flex items-center gap-2">
              <button @click="editUser(user)" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                <Icon icon="ph:pencil-bold" class="w-4 h-4 text-slate-500" />
              </button>
              <button v-if="user.id !== currentUserId" @click="deleteUser(user.id)" class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                <Icon icon="ph:trash-bold" class="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑用户弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ editingUser ? '编辑账号' : '添加账号' }}
          </h3>
        </div>
        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
            <input v-model="userForm.username" type="text" required :disabled="!!editingUser" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">昵称</label>
            <input v-model="userForm.nickname" type="text" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">邮箱</label>
            <input v-model="userForm.email" type="email" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">密码</label>
            <input v-model="userForm.password" type="password" required class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">角色</label>
            <select v-model="userForm.role" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
              <option value="user">用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">取消</button>
            <button type="submit" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

const users = ref<any[]>([])
const showAddModal = ref(false)
const editingUser = ref<any>(null)

const userForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  role: 'user'
})

const editUser = (user: any) => {
  editingUser.value = user
  userForm.username = user.username
  userForm.nickname = user.nickname
  userForm.email = user.email
  userForm.password = ''
  userForm.role = user.role
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingUser.value = null
  Object.assign(userForm, { username: '', nickname: '', email: '', password: '', role: 'user' })
}

const saveUser = async () => {
  // 实际项目中这里应该调用API
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userForm }
    }
  } else {
    users.value.push({
      id: Date.now().toString(),
      ...userForm
    })
  }
  closeModal()
}

const deleteUser = (id: string) => {
  if (confirm('确定要删除这个账号吗？')) {
    users.value = users.value.filter(u => u.id !== id)
  }
}

onMounted(() => {
  if (authStore.user) {
    users.value = [authStore.user]
  }
})
</script>
