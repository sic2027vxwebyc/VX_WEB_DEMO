<script setup>
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'

const { t } = useI18n()
const store = useOperationalIntelligenceStore()

const getCongestionColor = (level) => {
  switch (level) {
    case 'low': return 'bg-status-low shadow-[0_0_20px_rgba(0,255,102,0.4)]'
    case 'moderate': return 'bg-status-moderate shadow-[0_0_20px_rgba(255,214,0,0.4)]'
    case 'high': return 'bg-status-high shadow-[0_0_20px_rgba(255,122,0,0.4)]'
    case 'critical': return 'bg-security-alert shadow-[0_0_20px_rgba(255,0,51,0.4)]'
    default: return 'bg-white/20'
  }
}
</script>

<template>
  <div class="glass-panel rounded-xl overflow-hidden h-full border-primary/20 relative min-h-[300px]">
    <div class="absolute top-md left-md z-10">
      <div class="bg-surface-dark/80 backdrop-blur-md px-md py-sm rounded-lg border border-white/10">
        <h3 class="font-label-md text-primary">{{ t('admin.operations.heatmap') }}</h3>
        <p class="text-[10px] text-on-surface-variant flex items-center gap-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-status-low animate-pulse"></span>
          {{ t('admin.operations.liveMonitoring') }}
        </p>
      </div>
    </div>

    <!-- Heatmap Overlay Simulation -->
    <div class="w-full h-full bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center p-lg">
      <!-- 추상화된 지도 배경 (그리드 형태) -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, rgba(0, 219, 233, 0.2) 1px, transparent 0); background-size: 32px 32px;"></div>
      
      <!-- 공간별 히트맵 포인트 -->
      <div v-for="zone in store.effectiveZones" :key="zone.id" 
           class="absolute transition-all duration-1000 ease-in-out"
           :style="{ left: `${zone.coords.x}%`, top: `${zone.coords.y}%` }">
        
        <!-- 히트맵 광원 효과 -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-24 h-24 rounded-full mix-blend-screen opacity-20 blur-xl transition-all duration-500"
               :class="getCongestionColor(zone.congestionLevel)"></div>
          <div class="absolute w-12 h-12 rounded-full mix-blend-screen opacity-40 blur-md transition-all duration-500"
               :class="getCongestionColor(zone.congestionLevel)"></div>
          <div class="w-3 h-3 rounded-full border border-white/50 z-10 transition-all duration-500"
               :class="getCongestionColor(zone.congestionLevel)"></div>
          
          <!-- 공간 이름 툴팁 -->
          <div class="absolute top-6 left-1/2 -translate-x-1/2 bg-surface-dark/90 px-xs py-0.5 rounded text-[9px] text-white border border-white/10 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            {{ t(zone.nameKey) }} ({{ zone.density }}%)
          </div>
        </div>
      </div>
    </div>

    <!-- 범례 -->
    <div class="absolute bottom-md right-md z-10 flex items-center gap-sm bg-surface-dark/80 backdrop-blur-md px-md py-xs rounded-full border border-white/10">
      <div class="flex items-center gap-xs">
        <div class="w-2 h-2 rounded-full bg-status-low"></div>
        <span class="text-[9px] text-on-surface-variant uppercase">{{ t('admin.operations.congestion.low') }}</span>
      </div>
      <div class="flex items-center gap-xs">
        <div class="w-2 h-2 rounded-full bg-status-moderate"></div>
        <span class="text-[9px] text-on-surface-variant uppercase">{{ t('admin.operations.congestion.moderate') }}</span>
      </div>
      <div class="flex items-center gap-xs">
        <div class="w-2 h-2 rounded-full bg-status-high"></div>
        <span class="text-[9px] text-on-surface-variant uppercase">{{ t('admin.operations.congestion.high') }}</span>
      </div>
      <div class="flex items-center gap-xs">
        <div class="w-2 h-2 rounded-full bg-security-alert"></div>
        <span class="text-[9px] text-on-surface-variant uppercase">{{ t('admin.operations.congestion.critical') }}</span>
      </div>
    </div>
  </div>
</template>
