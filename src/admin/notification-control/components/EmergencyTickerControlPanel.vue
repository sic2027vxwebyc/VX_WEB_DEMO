<script setup>
import { ref, reactive } from 'vue'
import { useNotificationControl } from '../composables/useNotificationControl'
import NotificationTargetSelector from './NotificationTargetSelector.vue'

const { handleBroadcastTicker, isMockBroadcasting } = useNotificationControl()

const form = reactive({
  titleKey: 'admin.notifications.tickers.items.manual.title',
  message: '',
  severity: 'emergency',
  targetScope: 'all',
  targetLocales: ['ko', 'en'],
  expiresInMinutes: 60
})

const severities = ['info', 'warning', 'emergency', 'critical']

const isSubmitting = ref(false)

const submitTicker = async () => {
  if (!form.message) return
  
  isSubmitting.value = true
  try {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + form.expiresInMinutes)
    
    await handleBroadcastTicker({
      titleKey: form.titleKey,
      messageKey: form.message, // mock에서는 직접 메시지를 넣거나 key를 넣음
      severity: form.severity,
      targetScope: form.targetScope,
      targetLocales: [...form.targetLocales],
      expiresAt: expiresAt.toISOString()
    })
    
    form.message = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 h-full flex flex-col">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.notifications.emergencyTicker') }}</h3>
    </div>

    <div class="space-y-4 flex-1">
      <!-- Severity Selection -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.severityTitle') }}</label>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="s in severities" 
            :key="s"
            @click="form.severity = s"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              form.severity === s 
                ? 'bg-white text-black border-white' 
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
            ]"
          >
            {{ $t(`admin.notifications.severity.${s}`) }}
          </button>
        </div>
      </div>

      <!-- Message Input -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.messageLabel') }}</label>
        <textarea 
          v-model="form.message"
          rows="3"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          :placeholder="$t('admin.notifications.messagePlaceholder')"
        ></textarea>
      </div>

      <!-- Target Selector -->
      <NotificationTargetSelector 
        v-model:scope="form.targetScope"
        v-model:locales="form.targetLocales"
      />

      <!-- Expiration -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.expiresIn') }}</label>
        <select 
          v-model="form.expiresInMinutes"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
        >
          <option :value="10" class="bg-slate-900">10{{ $t('common.minutes') }}</option>
          <option :value="30" class="bg-slate-900">30{{ $t('common.minutes') }}</option>
          <option :value="60" class="bg-slate-900">1{{ $t('common.hour') }}</option>
          <option :value="180" class="bg-slate-900">3{{ $t('common.hours') }}</option>
        </select>
      </div>
    </div>

    <button 
      @click="submitTicker"
      :disabled="!form.message || isSubmitting"
      class="mt-6 w-full py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
    >
      <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      {{ $t('admin.notifications.broadcastButton') }}
    </button>
  </div>
</template>
