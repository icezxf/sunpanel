<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">全局设置</h3>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">网站名称</label>
          <input v-model="settings.siteName" type="text" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">默认语言</label>
          <select v-model="settings.defaultLanguage" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">默认每行显示数量</label>
          <input v-model.number="settings.defaultItemsPerRow" type="number" min="2" max="12" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-slate-700 dark:text-slate-300">允许新用户注册</p>
            <p class="text-sm text-slate-500">控制是否允许访客注册新账号</p>
          </div>
          <button @click="settings.allowRegistration = !settings.allowRegistration" class="relative w-12 h-6 rounded-full transition-colors" :class="settings.allowRegistration ? 'bg-orange-500' : 'bg-slate-300'">
            <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform" :class="settings.allowRegistration ? 'translate-x-6' : ''" />
          </button>
        </div>
        <div class="flex justify-end">
          <button @click="saveSettings" class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            保存设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const settings = reactive({
  siteName: 'SunPanel',
  defaultLanguage: 'zh-CN',
  defaultItemsPerRow: 6,
  allowRegistration: true
})

const saveSettings = () => {
  localStorage.setItem('globalSettings', JSON.stringify(settings))
  alert('设置已保存')
}
</script>
