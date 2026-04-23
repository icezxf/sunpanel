<template>
  <div :class="{ dark: isDark }">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.theme === 'dark')
</script>
