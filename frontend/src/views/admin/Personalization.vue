<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">主题设置</h3>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">主题模式</label>
          <div class="flex gap-3">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="updateSetting('theme', theme.value)"
              class="px-4 py-3 rounded-lg border-2 transition-all"
              :class="settings.theme === theme.value ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'"
            >
              <Icon :icon="theme.icon" class="w-6 h-6 mb-1" :class="settings.theme === theme.value ? 'text-orange-500' : 'text-slate-400'" />
              <p class="text-sm">{{ theme.label }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">背景设置</h3>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">背景类型</label>
          <div class="flex gap-3">
            <button
              @click="updateSetting('wallpaperType', 'color')"
              class="px-4 py-3 rounded-lg border-2 transition-all"
              :class="settings.wallpaperType === 'color' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-slate-200 dark:border-slate-700'"
            >
              <p class="text-sm">纯色背景</p>
            </button>
            <button
              @click="updateSetting('wallpaperType', 'image')"
              class="px-4 py-3 rounded-lg border-2 transition-all"
              :class="settings.wallpaperType === 'image' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-slate-200 dark:border-slate-700'"
            >
              <p class="text-sm">图片背景</p>
            </button>
          </div>
        </div>

        <div v-if="settings.wallpaperType === 'color'">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">选择颜色</label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              :value="settings.wallpaper"
              @input="updateSetting('wallpaper', ($event.target as HTMLInputElement).value)"
              class="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              :value="settings.wallpaper"
              @change="updateSetting('wallpaper', ($event.target as HTMLInputElement).value)"
              class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div v-else>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">图片URL</label>
          <input
            v-model="wallpaperUrl"
            @change="updateSetting('wallpaper', wallpaperUrl)"
            type="text"
            placeholder="输入图片URL"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">显示设置</h3>
      </div>
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-slate-700 dark:text-slate-300">显示搜索栏</p>
            <p class="text-sm text-slate-500">在顶部显示搜索框</p>
          </div>
          <button
            @click="updateSetting('showSearchBar', !settings.showSearchBar)"
            class="relative w-12 h-6 rounded-full transition-colors"
            :class="settings.showSearchBar ? 'bg-orange-500' : 'bg-slate-300'"
          >
            <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform" :class="settings.showSearchBar ? 'translate-x-6' : ''" />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-slate-700 dark:text-slate-300">显示分组名称</p>
            <p class="text-sm text-slate-500">在分组上方显示名称</p>
          </div>
          <button
            @click="updateSetting('showGroupNames', !settings.showGroupNames)"
            class="relative w-12 h-6 rounded-full transition-colors"
            :class="settings.showGroupNames ? 'bg-orange-500' : 'bg-slate-300'"
          >
            <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform" :class="settings.showGroupNames ? 'translate-x-6' : ''" />
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">每行显示数量</label>
          <input
            type="range"
            min="2"
            max="12"
            :value="settings.itemsPerRow"
            @input="updateSetting('itemsPerRow', Number(($event.target as HTMLInputElement).value))"
            class="w-full"
          />
          <p class="text-sm text-slate-500 mt-1">{{ settings.itemsPerRow }} 个</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">搜索引擎</label>
          <select
            :value="settings.searchEngine"
            @change="updateSetting('searchEngine', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="https://www.google.com/search?q=">Google</option>
            <option value="https://www.bing.com/search?q=">Bing</option>
            <option value="https://www.baidu.com/s?wd=">百度</option>
            <option value="https://search.yahoo.com/search?p=">Yahoo</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">自定义代码</h3>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">自定义 CSS</label>
          <textarea
            v-model="customCSS"
            @change="updateSetting('customCSS', customCSS)"
            rows="6"
            placeholder="/* 在此处添加自定义样式 */"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">自定义 JavaScript</label>
          <textarea
            v-model="customJS"
            @change="updateSetting('customJS', customJS)"
            rows="6"
            placeholder="// 在此处添加自定义脚本"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

const wallpaperUrl = ref('')
if (settings.value.wallpaperType === 'image') {
  wallpaperUrl.value = settings.value.wallpaper
}

const themes = [
  { value: 'light', label: '浅色', icon: 'ph:sun-bold' },
  { value: 'dark', label: '深色', icon: 'ph:moon-bold' },
  { value: 'auto', label: '跟随系统', icon: 'ph:desktop-bold' },
]

const customCSS = ref(settings.value.customCSS || '')
const customJS = ref(settings.value.customJS || '')

const updateSetting = (key: string, value: any) => {
  settingsStore.updateSettings({ [key]: value })
}
</script>
