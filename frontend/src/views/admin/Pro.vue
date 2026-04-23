<template>
  <div class="max-w-2xl">
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
      <div class="flex items-center gap-4 mb-4">
        <Icon icon="ph:crown-bold" class="w-12 h-12" />
        <div>
          <h2 class="text-2xl font-bold">SunPanel PRO</h2>
          <p class="opacity-80">解锁更多高级功能</p>
        </div>
      </div>
      <div class="mt-6 space-y-3">
        <div class="flex items-center gap-2">
          <Icon icon="ph:check-circle-fill" class="w-5 h-5" />
          <span>更多主题样式</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:check-circle-fill" class="w-5 h-5" />
          <span>自定义域名绑定</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:check-circle-fill" class="w-5 h-5" />
          <span>数据统计分析</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:check-circle-fill" class="w-5 h-5" />
          <span>API调用限制提升</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:check-circle-fill" class="w-5 h-5" />
          <span>优先技术支持</span>
        </div>
      </div>
    </div>

    <div class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">授权激活</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PRO 许可证密钥</label>
          <input v-model="licenseKey" type="text" placeholder="请输入您的许可证密钥" class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        <button @click="activatePro" class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          激活 PRO
        </button>
      </div>
      <p class="mt-4 text-sm text-slate-500">当前版本：免费版 (v1.0.0)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const licenseKey = ref('')

const activatePro = () => {
  if (!licenseKey.value.trim()) {
    alert('请输入许可证密钥')
    return
  }
  alert('许可证激活功能即将上线')
}
</script>
