<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const scope = 'BookingConfirmed'

onMounted(() => {
  logger.info(scope, '예약 확인 화면 진입')
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark p-safe-top">
    <div class="max-w-md mx-auto px-lg py-xl">
      <div class="glass-panel rounded-[32px] overflow-hidden border border-primary/20">
        <!-- 티켓 헤더 -->
        <div class="bg-primary/10 p-lg text-center border-b border-primary/20">
          <span class="font-label-sm text-primary uppercase tracking-[0.2em]">{{ t('booking.confirmed') }}</span>
          <h1 class="font-headline-md text-headline-md mt-xs">{{ t('booking.mock.podName') }}</h1>
        </div>

        <!-- 티켓 상세 -->
        <div class="p-lg space-y-lg">
          <div class="grid grid-cols-2 gap-lg">
            <div>
              <p class="text-[10px] text-on-surface-variant uppercase mb-xs">{{ t('booking.details.date') }}</p>
              <p class="font-label-lg">2026. 05. 14</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-on-surface-variant uppercase mb-xs">{{ t('booking.details.time') }}</p>
              <p class="font-label-lg">14:00 - 16:00</p>
            </div>
          </div>

          <div class="flex justify-between items-center py-md border-y border-white/5">
            <div>
              <p class="text-[10px] text-on-surface-variant uppercase mb-xs">{{ t('booking.details.location') }}</p>
              <p class="font-label-lg">{{ t('booking.mock.locationName') }}</p>
            </div>
            <span class="material-symbols-outlined text-primary text-3xl">meeting_room</span>
          </div>

          <!-- QR 코드 영역 (시뮬레이션) -->
          <div class="flex flex-col items-center py-xl">
            <div class="w-48 h-48 bg-white p-4 rounded-2xl relative">
              <div class="w-full h-full border-[8px] border-surface-dark/10 relative">
                <!-- QR 패턴 모사 -->
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-surface-dark"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-surface-dark"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-surface-dark"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-surface-dark"></div>
                <div class="absolute inset-8 border-2 border-surface-dark/20 grid grid-cols-4 grid-rows-4 gap-1">
                  <div v-for="i in 16" :key="i" class="bg-surface-dark" :class="Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'"></div>
                </div>
              </div>
            </div>
            <p class="mt-lg font-label-sm text-on-surface-variant tracking-widest uppercase">VX-RES-88240-X</p>
          </div>
        </div>

        <!-- 하단 안내 -->
        <div class="p-lg bg-white/5">
          <p class="text-[12px] text-on-surface-variant leading-relaxed">
            {{ t('booking.instructions') }}
          </p>
        </div>
      </div>
      
      <button class="w-full mt-xl text-primary font-label-lg py-md border border-primary/30 rounded-2xl hover:bg-primary/5 transition-all">
        {{ t('booking.actions.changeOrCancel') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}
</style>
