<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Docker 容器管理</h3>
        <button @click="fetchContainers" class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2">
          <Icon icon="ph:arrow-clockwise-bold" class="w-5 h-5" />
          刷新
        </button>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-12">
          <Icon icon="ph:circle-notch-bold" class="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p class="mt-2 text-slate-500">加载中...</p>
        </div>
        <div v-else-if="containers.length === 0" class="text-center py-12 text-slate-500">
          暂无容器信息
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="container in containers" 
            :key="container.id"
            class="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="container.status === 'running' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-200 dark:bg-slate-600'">
              <Icon icon="ph:container-bold" class="w-5 h-5" :class="container.status === 'running' ? 'text-green-500' : 'text-slate-400'" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-700 dark:text-slate-300">{{ container.name }}</p>
              <p class="text-sm text-slate-500">{{ container.image }}</p>
            </div>
            <div class="px-3 py-1 rounded-full text-xs font-medium" :class="container.status === 'running' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-400'">
              {{ container.status === 'running' ? '运行中' : '已停止' }}
            </div>
            <div class="flex items-center gap-2">
              <button 
                v-if="container.status !== 'running'"
                @click="startContainer(container.id)"
                class="px-3 py-1 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
              >
                启动
              </button>
              <button 
                v-if="container.status === 'running'"
                @click="stopContainer(container.id)"
                class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded"
              >
                停止
              </button>
              <button 
                @click="restartContainer(container.id)"
                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
              >
                重启
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { dockerApi } from '@/api'

const containers = ref<any[]>([])
const loading = ref(false)

const fetchContainers = async () => {
  loading.value = true
  try {
    const res = await dockerApi.getContainers()
    containers.value = res.data || []
  } catch {
    containers.value = []
  } finally {
    loading.value = false
  }
}

const startContainer = async (id: string) => {
  await dockerApi.startContainer(id)
  await fetchContainers()
}

const stopContainer = async (id: string) => {
  await dockerApi.stopContainer(id)
  await fetchContainers()
}

const restartContainer = async (id: string) => {
  await dockerApi.restartContainer(id)
  await fetchContainers()
}

fetchContainers()
</script>
