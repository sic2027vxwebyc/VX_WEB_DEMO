<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['request'])

const { t } = useI18n()

const icon = computed(() => {
  switch (props.type) {
    case 'camera': return 'videocam'
    case 'location': return 'location_on'
    case 'push': return 'notifications'
    default: return 'help'
  }
})

const statusLabel = computed(() => {
  return t(`settings.device.permissions.${props.status}`)
})

const statusColor = computed(() => {
  switch (props.status) {
    case 'granted': return 'text-status-low'
    case 'denied': return 'text-status-high'
    case 'prompt': return 'text-status-moderate'
    case 'unsupported': return 'text-on-surface-variant opacity-50'
    default: return 'text-on-surface-variant'
  }
})
</script>

<template>
  <div class="flex items-center justify-between p-lg bg-white/5 rounded-xl border border-white/10">
    <div class="flex items-center gap-md">
      <div class="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
        <span class="material-symbols-outlined text-xl">{{ icon }}</span>
      </div>
      <div>
        <p class="font-label-lg">{{ t(`settings.device.permissions.${type}`) }}</p>
        <p class="text-sm font-medium" :class="statusColor">{{ statusLabel }}</p>
      </div>
    </div>
    <button 
      v-if="status === 'prompt' || status === 'unknown'"
      @click="emit('request', type)"
      class="px-md py-1.5 rounded-lg bg-primary text-on-primary text-label-sm hover:brightness-110 transition-all"
    >
      {{ t('settings.device.permissions.request') }}
    </button>
  </div>
</template>
