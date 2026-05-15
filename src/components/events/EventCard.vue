<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  showDayDivider: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add-schedule'])

const { t } = useI18n()
</script>

<template>
  <div class="relative group">
    <!-- 요일 구분선 -->
    <div v-if="showDayDivider" 
         class="absolute -left-[41px] -top-8 w-max px-3 py-1 bg-surface-container rounded-full border border-white/10 text-[10px] font-bold text-primary mb-4">
      {{ item.dayLabel }}
    </div>

    <!-- 타임라인 포인트 -->
    <div 
      class="absolute -left-[41px] top-6 w-4 h-4 rounded-full border-2 border-surface-dark z-10 transition-all duration-500"
      :class="{
        'bg-on-surface-variant opacity-30 scale-75': item.runtimeStatus === 'completed',
        'bg-primary shadow-[0_0_15px_#00dbe9] animate-pulse scale-110': item.runtimeStatus === 'ongoing',
        'bg-white/20': item.runtimeStatus === 'upcoming'
      }"
    ></div>

    <!-- 이벤트 카드 -->
    <div 
      class="glass-panel p-lg rounded-3xl transition-all duration-300 hover:translate-x-2"
      :class="[
        item.runtimeStatus === 'ongoing' ? 'bg-primary/10 border-primary/30 shadow-[0_8px_32px_rgba(0,219,233,0.1)]' : 'opacity-80',
        item.runtimeStatus === 'completed' ? 'grayscale-[0.5] opacity-50' : ''
      ]"
      :data-status="item.runtimeStatus"
    >
      <div class="flex flex-col md:flex-row justify-between md:items-start gap-md mb-sm">
        <div class="flex flex-col">
          <span class="font-display-md text-display-md leading-none" :class="item.runtimeStatus === 'ongoing' ? 'text-primary' : 'text-on-surface'">
            {{ item.displayTime }}
          </span>
          <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">{{ item.period }}</span>
        </div>
        
        <div class="flex flex-wrap items-center gap-sm">
          <span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-on-surface-variant uppercase">
            {{ t(`events.filters.${item.category}`) }}
          </span>
          <span 
            class="flex items-center gap-xs px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors"
            :class="{
              'text-status-low bg-status-low/10': item.runtimeStatus === 'ongoing',
              'text-on-surface-variant bg-white/5': item.runtimeStatus === 'completed',
              'text-primary bg-primary/10': item.runtimeStatus === 'upcoming'
            }"
          >
            <span v-if="item.runtimeStatus === 'ongoing'" class="w-1.5 h-1.5 rounded-full bg-status-low animate-ping"></span>
            {{ t(`events.status.${item.runtimeStatus}`) }}
          </span>
        </div>
      </div>
      
      <h3 class="font-headline-md text-headline-md mb-sm leading-snug group-hover:text-primary transition-colors">{{ item.title }}</h3>
      
      <ul v-if="item.subItems && item.subItems.length > 0" class="mb-md space-y-1.5 pl-1">
        <li v-for="(sub, idx) in item.subItems" :key="idx" class="flex items-start gap-2 text-body-sm text-on-surface-variant">
          <span class="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0"></span>
          <span class="leading-relaxed">{{ sub }}</span>
        </li>
      </ul>

      <p class="font-label-md text-on-surface-variant mb-lg flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">person</span>
        {{ item.speaker }}
      </p>
      
      <div class="flex items-center justify-between pt-md border-t border-white/5">
        <div class="flex items-center gap-xs text-label-sm text-on-surface-variant">
          <span class="material-symbols-outlined text-sm">location_on</span>
          <span>{{ item.location }}</span>
        </div>
        <button 
          @click="$emit('add-schedule', item)"
          class="flex items-center gap-xs text-primary font-bold text-label-sm hover:scale-105 transition-transform active:scale-95"
        >
          <span class="material-symbols-outlined text-sm">calendar_add_on</span>
          {{ t('events.actions.addToMySchedule') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
