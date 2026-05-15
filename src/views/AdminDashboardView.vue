<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 관리자 대시보드(커맨드 센터) 뷰
 * 전체 시스템 상태, 실시간 방문자 통계, 혼잡도 히트맵 및 보안 알림을 모니터링합니다.
 */
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const scope = 'AdminDashboard'

/**
 * 컴포넌트 마운트 시 로그 기록 및 실시간 텔레메트리 연결 시뮬레이션
 */
onMounted(() => {
  logger.info(scope, '관리자 대시보드(커맨드 센터)가 마운트되었습니다.')
  logger.info(scope, '실시간 텔레메트리 데이터를 수신하기 시작합니다.')
})

/**
 * 컴포넌트 언마운트 시 로그 기록
 */
onUnmounted(() => {
  logger.info(scope, '관리자 대시보드 연결을 종료합니다.')
})

/**
 * 글로벌 시스템 점검 실행
 */
const initiateSweep = () => {
  logger.warn(scope, '전체 시스템 점검(Sweep)을 시작합니다.')
}
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-margin-desktop pt-8">
    <!-- 대시보드 헤더 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
      <div>
        <h1 class="font-display-lg text-display-lg text-on-surface">{{ t('admin.title') }}</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">{{ t('admin.subtitle') }}</p>
      </div>
      <div class="flex gap-md">
        <div class="flex items-center gap-sm bg-status-low/10 border border-status-low/30 px-md py-xs rounded-full">
          <span class="w-2 h-2 rounded-full bg-status-low animate-pulse"></span>
          <span class="font-label-sm text-status-low uppercase tracking-wider">{{ t('admin.status.normal') }}</span>
        </div>
        <button 
          @click="initiateSweep"
          class="bg-primary text-on-primary font-label-lg px-lg py-sm rounded-lg shadow-[0_0_20px_rgba(0,219,233,0.4)] active:scale-95 transition-all"
        >
          {{ t('admin.status.sweep') }}
        </button>
      </div>
    </div>

    <!-- 벤토 그리드 레이아웃 -->
    <div class="grid grid-cols-12 gap-lg h-auto">
      <!-- 실시간 통계 위젯 -->
      <div class="col-span-12 lg:col-span-4 space-y-lg">
        <!-- 방문객 수 카드 -->
        <div class="glass-panel rounded-xl p-lg flex flex-col justify-between h-40">
          <div class="flex justify-between items-start">
            <span class="font-label-lg text-on-surface-variant">{{ t('admin.stats.activeVisitors') }}</span>
            <span class="material-symbols-outlined text-primary-fixed-dim">groups</span>
          </div>
          <div class="flex items-end gap-md">
            <span class="font-display-lg text-primary">12,842</span>
            <div class="flex items-center text-status-low font-label-sm mb-base">
              <span class="material-symbols-outlined text-sm">arrow_upward</span>
              <span>12%</span>
            </div>
          </div>
          <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-sm">
            <div class="bg-primary h-full w-4/5 shadow-[0_0_8px_rgba(0,219,233,0.8)]"></div>
          </div>
        </div>

        <!-- 패스 인증율 카드 -->
        <div class="glass-panel rounded-xl p-lg flex flex-col justify-between h-40">
          <div class="flex justify-between items-start">
            <span class="font-label-lg text-on-surface-variant">{{ t('admin.stats.passAuth') }}</span>
            <span class="material-symbols-outlined text-primary-fixed-dim">qr_code_2</span>
          </div>
          <div class="flex items-end gap-md">
            <span class="font-display-lg text-primary">342</span>
            <div class="flex items-center text-status-moderate font-label-sm mb-base">
              <span class="material-symbols-outlined text-sm">trending_up</span>
              <span>{{ t('admin.stats.peakTime') }}</span>
            </div>
          </div>
          <div class="flex gap-xs items-end h-8">
            <div class="flex-1 bg-primary/20 h-2 rounded-t-sm"></div>
            <div class="flex-1 bg-primary/40 h-4 rounded-t-sm"></div>
            <div class="flex-1 bg-primary/30 h-3 rounded-t-sm"></div>
            <div class="flex-1 bg-primary/60 h-6 rounded-t-sm"></div>
            <div class="flex-1 bg-primary/80 h-8 rounded-t-sm"></div>
            <div class="flex-1 bg-primary h-7 rounded-t-sm shadow-[0_0_5px_rgba(0,219,233,0.5)]"></div>
            <div class="flex-1 bg-primary/50 h-5 rounded-t-sm"></div>
          </div>
        </div>

        <!-- 인프라 상태 -->
        <div class="glass-panel rounded-xl p-lg flex flex-col gap-md">
          <div class="flex justify-between items-center">
            <span class="font-label-lg text-on-surface-variant">{{ t('admin.stats.infrastructure') }}</span>
            <span class="font-label-sm text-status-low">{{ t('admin.stats.upTime', { percent: 99.8 }) }}</span>
          </div>
          <div class="grid grid-cols-4 gap-sm">
            <div class="h-10 bg-status-low/20 border border-status-low/40 rounded flex items-center justify-center">
              <span class="material-symbols-outlined text-status-low" style="font-variation-settings: 'FILL' 1;">router</span>
            </div>
            <div class="h-10 bg-status-low/20 border border-status-low/40 rounded flex items-center justify-center">
              <span class="material-symbols-outlined text-status-low" style="font-variation-settings: 'FILL' 1;">dns</span>
            </div>
            <div class="h-10 bg-status-moderate/20 border border-status-moderate/40 rounded flex items-center justify-center">
              <span class="material-symbols-outlined text-status-moderate" style="font-variation-settings: 'FILL' 1;">cloud_done</span>
            </div>
            <div class="h-10 bg-status-low/20 border border-status-low/40 rounded flex items-center justify-center">
              <span class="material-symbols-outlined text-status-low" style="font-variation-settings: 'FILL' 1;">security</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 혼잡도 히트맵 -->
      <div class="col-span-12 lg:col-span-8 relative rounded-xl overflow-hidden glass-panel border border-primary/20 min-h-[420px]">
        <div class="absolute top-lg left-lg z-10 flex flex-col gap-sm">
          <div class="bg-surface-dark/80 backdrop-blur-md p-md rounded-lg border border-white/10">
            <h3 class="font-label-lg text-primary mb-xs">{{ t('admin.heatmap.title', { level: '02' }) }}</h3>
            <p class="font-label-sm text-on-surface-variant">{{ t('admin.heatmap.alert', { zone: '4' }) }}</p>
          </div>
          <div class="flex gap-sm">
            <button class="bg-white/10 hover:bg-white/20 px-md py-xs rounded text-label-sm border border-white/5">{{ t('admin.heatmap.floors.1f') }}</button>
            <button class="bg-primary/20 text-primary px-md py-xs rounded text-label-sm border border-primary/40">{{ t('admin.heatmap.floors.2f') }}</button>
            <button class="bg-white/10 hover:bg-white/20 px-md py-xs rounded text-label-sm border border-white/5">{{ t('admin.heatmap.floors.3f') }}</button>
          </div>
        </div>
        
        <div class="absolute bottom-lg right-lg z-10 flex items-center gap-md bg-surface-dark/80 backdrop-blur-md p-md rounded-lg border border-white/10">
          <div class="flex items-center gap-xs">
            <div class="w-3 h-3 rounded-full bg-status-low"></div>
            <span class="text-[10px] text-on-surface-variant">{{ t('admin.heatmap.levels.low') }}</span>
          </div>
          <div class="flex items-center gap-xs">
            <div class="w-3 h-3 rounded-full bg-status-moderate"></div>
            <span class="text-[10px] text-on-surface-variant">{{ t('admin.heatmap.levels.moderate') }}</span>
          </div>
          <div class="flex items-center gap-xs">
            <div class="w-3 h-3 rounded-full bg-status-high"></div>
            <span class="text-[10px] text-on-surface-variant">{{ t('admin.heatmap.levels.high') }}</span>
          </div>
        </div>

        <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmw6oiXrnC5hls0_Yn7eOUC-gmjEU7S076L8nVFJqD6Y6aL_ASBD-yl9iHF9e-o7ugkCb5JRJ2YEkYL9fAZWfibC2iWFKLJRDsvtnxGi-hfiprgf2eFkUtIDpJ4GM6m8MjK-IMnTMmSETgLw3_bODX9bMWj1_U7Ma1zHwhFRM-cg4TMk1GznIv_tTxPg9MbndErROzqwvmJEHa7CSvjW7V0h8VF3shwMbLvyZTFmKQ6lYDeeFEcApwHgQ0oICwZmGjD0vXp6MCqXIC')">
          <div class="w-full h-full bg-primary/5 mix-blend-overlay"></div>
        </div>
      </div>

      <!-- 시스템 알림 섹션 -->
      <div class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div class="bg-security-alert/10 border border-security-alert/40 rounded-xl p-lg flex items-center gap-md relative overflow-hidden">
          <div class="bg-security-alert p-md rounded-lg shadow-[0_0_15px_rgba(255,0,51,0.5)] z-10">
            <span class="material-symbols-outlined text-white">warning</span>
          </div>
          <div class="z-10">
            <h4 class="font-label-lg text-on-surface font-bold">{{ t('admin.alerts.security.title', { gate: '4C' }) }}</h4>
            <p class="font-label-sm text-on-surface-variant">{{ t('admin.alerts.security.desc') }}</p>
          </div>
        </div>

        <div class="bg-status-moderate/10 border border-status-moderate/40 rounded-xl p-lg flex items-center gap-md">
          <div class="bg-status-moderate p-md rounded-lg shadow-[0_0_15px_rgba(255,214,0,0.5)]">
            <span class="material-symbols-outlined text-surface-dark">electric_bolt</span>
          </div>
          <div>
            <h4 class="font-label-lg text-on-surface font-bold">{{ t('admin.alerts.power.title', { wing: 'B' }) }}</h4>
            <p class="font-label-sm text-on-surface-variant">{{ t('admin.alerts.power.desc', { load: 15 }) }}</p>
          </div>
        </div>

        <div class="glass-panel border border-white/10 rounded-xl p-lg flex items-center gap-md">
          <div class="bg-surface-container-highest p-md rounded-lg">
            <span class="material-symbols-outlined text-primary">chat_bubble</span>
          </div>
          <div>
            <h4 class="font-label-lg text-on-surface font-bold">{{ t('admin.alerts.support.title') }}</h4>
            <p class="font-label-sm text-on-surface-variant">{{ t('admin.alerts.support.desc', { hall: 'F' }) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 플로팅 액션 버튼 (글로벌 경보) -->
    <button 
      @click="logger.error(scope, '글로벌 경보 발령 요청')"
      class="fixed bottom-lg right-8 lg:right-margin-desktop bg-primary-container text-on-primary-container p-lg rounded-full shadow-[0_10px_40px_rgba(0,219,233,0.3)] hover:scale-110 active:scale-95 transition-all z-50 flex items-center gap-sm"
    >
      <span class="material-symbols-outlined">add_alert</span>
      <span class="font-label-lg pr-base">{{ t('admin.globalAlert') }}</span>
    </button>
  </div>
</template>
