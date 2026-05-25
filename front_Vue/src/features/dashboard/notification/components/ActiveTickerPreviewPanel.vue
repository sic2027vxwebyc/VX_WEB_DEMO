<script setup>
import { useNotificationControl } from '../composables/useNotificationControl'

const { activeTickers, expireTicker } = useNotificationControl()

const getSeverityClass = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-rose-600 text-white'
    case 'emergency': return 'bg-rose-500 text-white'
    case 'warning': return 'bg-amber-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ $t('admin.notifications.activeTickerPreview') }}</h3>
      </div>
      <span class="text-xs text-white/40">{{ activeTickers.length }} {{ $t('admin.notifications.itemsCount') }}</span>
    </div>

    <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      <div v-if="activeTickers.length === 0" class="h-full flex flex-col items-center justify-center text-white/30 space-y-2 py-12">
        <svg class="w-12 h-12 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
        <p class="text-sm">{{ $t('admin.notifications.noActiveTickers') }}</p>
      </div>

      <div 
        v-for="ticker in activeTickers" 
        :key="ticker.id"
        class="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', getSeverityClass(ticker.severity)]">
            {{ $t(`admin.notifications.severity.${ticker.severity}`) }}
          </span>
          <button 
            @click="expireTicker(ticker.id)"
            class="text-white/40 hover:text-rose-400 transition-colors p-1"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        
        <p class="text-white text-sm font-medium mb-1 line-clamp-2">
          {{ ticker.titleKey.startsWith('admin.') ? $t(ticker.titleKey) : ticker.titleKey }}
        </p>
        <p class="text-white/60 text-xs mb-3 line-clamp-3 leading-relaxed">
          {{ ticker.messageKey.startsWith('admin.') ? $t(ticker.messageKey) : ticker.messageKey }}
        </p>
        
        <div class="flex items-center justify-between text-[10px] text-white/30">
          <div class="flex items-center gap-2">
            <span>{{ ticker.targetScope === 'all' ? $t('admin.notifications.target.all') : ticker.targetScope }}</span>
            <span class="w-1 h-1 bg-white/10 rounded-full"></span>
            <span>{{ ticker.targetLocales.join(', ') }}</span>
          </div>
          <span>{{ new Date(ticker.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} {{ $t('admin.notifications.until') }}</span>
        </div>
      </div>
    </div>

    <!-- Live Preview Simulator -->
    <div v-if="activeTickers.length > 0" class="mt-6 pt-6 border-t border-white/10">
      <p class="text-xs text-white/40 mb-3">{{ $t('admin.notifications.liveSimulation') }}</p>
      <div class="relative h-10 bg-slate-900 rounded-lg border border-white/10 overflow-hidden flex items-center">
        <div :class="['absolute left-0 top-0 bottom-0 w-1', getSeverityClass(activeTickers[0].severity)]"></div>
        <div class="px-4 flex items-center gap-3 w-full animate-pulse-slow">
          <span :class="['text-[10px] font-bold uppercase', `text-${activeTickers[0].severity === 'critical' || activeTickers[0].severity === 'emergency' ? 'rose' : 'amber'}-400`]">
            {{ $t(`admin.notifications.severity.${activeTickers[0].severity}`) }}
          </span>
          <p class="text-white text-[11px] truncate flex-1">
            {{ activeTickers[0].messageKey.startsWith('admin.') ? $t(activeTickers[0].messageKey) : activeTickers[0].messageKey }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
