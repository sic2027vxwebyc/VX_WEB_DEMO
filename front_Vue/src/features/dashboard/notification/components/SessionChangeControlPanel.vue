<script setup>
import { ref, reactive } from 'vue'
import { useNotificationControl } from '../composables/useNotificationControl'
import NotificationTargetSelector from './NotificationTargetSelector.vue'

const { handleSendNotification } = useNotificationControl()

const form = reactive({
  sessionId: 'saturday-morning-01',
  changeType: 'delayed',
  message: '',
  targetLocales: ['ko', 'en']
})

const changeTypes = ['timeChanged', 'speakerChanged', 'hallChanged', 'delayed', 'cancelled', 'resumed']

const mockSessions = [
  { id: 'saturday-morning-01', name: 'Spatial Computing Keynote' },
  { id: 'saturday-afternoon-02', name: 'Next-Gen Web standards' },
  { id: 'sunday-morning-01', name: 'AR/VR UX Workshop' }
]

const isSubmitting = ref(false)

const submitNotification = async () => {
  if (!form.message) return
  
  isSubmitting.value = true
  try {
    await handleSendNotification({
      sessionId: form.sessionId,
      changeType: form.changeType,
      titleKey: `admin.notifications.sessionChanges.items.${form.changeType}.title`,
      messageKey: form.message,
      targetLocales: [...form.targetLocales]
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
      <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.notifications.sessionChange') }}</h3>
    </div>

    <div class="space-y-4 flex-1">
      <!-- Session Selection -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.selectSession') }}</label>
        <select 
          v-model="form.sessionId"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
        >
          <option v-for="s in mockSessions" :key="s.id" :value="s.id" class="bg-slate-900">{{ s.name }}</option>
        </select>
      </div>

      <!-- Change Type -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.changeTypeTitle') }}</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="t in changeTypes" 
            :key="t"
            @click="form.changeType = t"
            :class="[
              'px-2 py-2 rounded-lg text-[10px] font-medium transition-all border text-center',
              form.changeType === t 
                ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20' 
                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
            ]"
          >
            {{ $t(`admin.notifications.changeType.${t}`) }}
          </button>
        </div>
      </div>

      <!-- Message -->
      <div>
        <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.messageLabel') }}</label>
        <textarea 
          v-model="form.message"
          rows="3"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          :placeholder="$t('admin.notifications.sessionMessagePlaceholder')"
        ></textarea>
      </div>

      <!-- Target -->
      <NotificationTargetSelector 
        v-model:scope="form.targetScope"
        v-model:locales="form.targetLocales"
      />
    </div>

    <button 
      @click="submitNotification"
      :disabled="!form.message || isSubmitting"
      class="mt-6 w-full py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      {{ $t('admin.notifications.sendButton') }}
    </button>
  </div>
</template>
