<template>
  <div 
    class="min-h-screen transition-colors duration-300"
    :style="backgroundStyle"
  >
    <!-- 顶部工具栏 -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-orange-500">☀️ SunPanel</h1>
          <button 
            v-if="isLoggedIn"
            @click="goAdmin"
            class="text-sm text-slate-500 hover:text-orange-500 transition-colors"
          >
            管理后台
          </button>
        </div>
        <div class="flex items-center gap-3">
          <!-- 搜索框 -->
          <div v-if="settings.showSearchBar" class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="doSearch"
              type="text"
              placeholder="搜索..."
              class="w-48 px-4 py-2 pl-10 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- 主题切换 -->
          <button 
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <!-- 登录/登出 -->
          <button 
            v-if="!isLoggedIn"
            @click="goLogin"
            class="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
          >
            登录
          </button>
          <button 
            v-else
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
          >
            退出
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 空状态 -->
      <div v-if="!isLoading && groups.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">🌞</div>
        <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">欢迎使用 SunPanel</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-6">开始添加您的第一个分组和网站吧</p>
        <button 
          v-if="isLoggedIn"
          @click="goAdmin"
          class="px-6 py-3 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
        >
          前往管理后台
        </button>
        <button 
          v-else
          @click="goLogin"
          class="px-6 py-3 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
        >
          登录后开始配置
        </button>
      </div>

      <!-- 分组列表 -->
      <div v-else class="space-y-8">
        <div 
          v-for="group in groups" 
          :key="group.id"
          class="group-card"
        >
          <!-- 分组标题 -->
          <div v-if="settings.showGroupNames" class="mb-4 flex items-center gap-2">
            <Icon 
              v-if="group.icon" 
              :icon="group.icon" 
              class="w-6 h-6 text-orange-500"
            />
            <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ group.name }}
            </h2>
          </div>

          <!-- 分组内的项目 -->
          <div 
            class="grid gap-4"
            :style="{ gridTemplateColumns: `repeat(${settings.itemsPerRow}, minmax(0, 1fr))` }"
          >
            <a
              v-for="item in getGroupItems(group.id)"
              :key="item.id"
              :href="item.url"
              :target="item.openInNewTab ? '_blank' : '_self'"
              @click.prevent="openItem(item)"
              class="item-card flex flex-col items-center p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              <div class="w-12 h-12 mb-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/30">
                <Icon 
                  v-if="item.icon" 
                  :icon="item.icon" 
                  class="w-7 h-7 text-orange-500"
                />
                <span v-else class="text-2xl">{{ getDefaultIcon(item.name) }}</span>
              </div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 text-center line-clamp-2">
                {{ item.name }}
              </span>
              <span v-if="item.description" class="text-xs text-slate-400 dark:text-slate-500 text-center mt-1 line-clamp-1">
                {{ item.description }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- 小窗口模式 -->
    <div 
      v-if="activeWindow"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeWindow"
    >
      <div 
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
        :style="{ width: `${activeWindow.windowWidth || 800}px`, height: `${activeWindow.windowHeight || 600}px` }"
      >
        <div class="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ activeWindow.name }}</span>
          <button @click="closeWindow" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <iframe :src="activeWindow.url" class="w-full h-[calc(100%-52px)] border-0" />
      </div>
    </div>

    <!-- 自定义样式 -->
    <style v-if="settings.customCSS" v-html="settings.customCSS" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useDataStore } from '@/stores/data'
import type { Item } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const dataStore = useDataStore()

const searchQuery = ref('')
const activeWindow = ref<Item | null>(null)

const isLoggedIn = computed(() => !!authStore.token)
const isDark = computed(() => settingsStore.theme === 'dark')
const settings = computed(() => settingsStore.settings)
const groups = computed(() => dataStore.groups)
const items = computed(() => dataStore.items)
const isLoading = computed(() => dataStore.isLoading)

const backgroundStyle = computed(() => {
  if (settings.value.wallpaperType === 'color') {
    return { backgroundColor: settings.value.wallpaper }
  }
  return { backgroundImage: `url(${settings.value.wallpaper})`, backgroundSize: 'cover' }
})

const getGroupItems = (groupId: string) => {
  return dataStore.getItemsByGroup(groupId)
}

const getDefaultIcon = (name: string) => {
  const icons: Record<string, string> = {
    'G': '🔍', 'B': '🌐', 'M': '📧', 'S': '⚙️', 'W': '🌐'
  }
  return icons[name[0]?.toUpperCase()] || '📁'
}

const openItem = (item: Item) => {
  if (item.showAsWindow) {
    activeWindow.value = item
  } else {
    window.open(item.url, item.openInNewTab ? '_blank' : '_self')
  }
}

const closeWindow = () => {
  activeWindow.value = null
}

const toggleTheme = () => {
  const newTheme = settings.value.theme === 'dark' ? 'light' : 'dark'
  settingsStore.updateSettings({ theme: newTheme })
}

const doSearch = () => {
  if (searchQuery.value.trim()) {
    window.open(settings.value.searchEngine + encodeURIComponent(searchQuery.value), '_blank')
  }
}

const goLogin = () => router.push('/login')
const goAdmin = () => router.push('/admin')
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(async () => {
  await Promise.all([
    settingsStore.loadSettings(),
    authStore.fetchUser(),
    dataStore.fetchAll()
  ])
})
</script>

<style scoped>
.item-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
