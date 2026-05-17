<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  scope: String,
  locales: Array
})

const emit = defineEmits(['update:scope', 'update:locales'])

const scopes = [
  { id: 'all', labelKey: 'admin.notifications.target.all' },
  { id: 'hall_a', labelKey: 'admin.notifications.target.hallA' },
  { id: 'hall_b', labelKey: 'admin.notifications.target.hallB' },
  { id: 'vip', labelKey: 'admin.notifications.target.vip' }
]

const availableLocales = ['ko', 'en', 'ja', 'zh-TW', 'es', 'ru']

const toggleLocale = (locale) => {
  const newLocales = [...props.locales]
  const index = newLocales.indexOf(locale)
  if (index > -1) {
    if (newLocales.length > 1) newLocales.splice(index, 1)
  } else {
    newLocales.push(locale)
  }
  emit('update:locales', newLocales)
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.targetScope') }}</label>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="s in scopes" 
          :key="s.id"
          @click="emit('update:scope', s.id)"
          :class="[
            'px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left',
            props.scope === s.id 
              ? 'bg-white/20 text-white border-white/40' 
              : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
          ]"
        >
          {{ $t(s.labelKey) }}
        </button>
      </div>
    </div>

    <div>
      <label class="block text-sm text-white/60 mb-2">{{ $t('admin.notifications.targetLocales') }}</label>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="locale in availableLocales" 
          :key="locale"
          @click="toggleLocale(locale)"
          :class="[
            'w-10 h-8 rounded-lg text-[10px] font-bold transition-all border uppercase',
            props.locales.includes(locale)
              ? 'bg-blue-500/30 text-blue-100 border-blue-500/50' 
              : 'bg-white/5 text-white/40 border-white/10'
          ]"
        >
          {{ locale }}
        </button>
      </div>
    </div>
  </div>
</template>
