<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 관리자 루트 대시보드 뷰
 * 핵심 제어 항목과 주요 통계 지표만으로 구성된 미니멀 대시보드입니다.
 */
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n({ useScope: 'global' })
const scope = 'AdminRoot'

onMounted(() => {
  logger.info(scope, '관리자 루트 대시보드가 마운트되었습니다.')
})

onUnmounted(() => {
  logger.info(scope, '관리자 루트 대시보드 연결을 종료합니다.')
})
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-margin-desktop pt-24">
    <!-- 대시보드 헤더 -->
    <div class="mb-lg">
      <h1 class="font-display-lg text-display-lg text-on-surface">{{ t('admin.root.title') }}</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant">{{ t('admin.root.subtitle') }}</p>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="flex flex-col gap-lg">
      <!-- 1. 핵심 제어 카드 (6개) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        <!-- 운영 관제 -->
        <router-link to="/admin/operations" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-primary-fixed-dim/30 bg-primary-fixed-dim/5 hover:bg-primary-fixed-dim/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-primary-fixed-dim transition-colors">{{ t('admin.operations.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>

        <!-- 리워드 관리 -->
        <router-link to="/admin/gamification" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-status-low/30 bg-status-low/5 hover:bg-status-low/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-status-low/20 flex items-center justify-center text-status-low group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">featured_seasonal_and_gifts</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-status-low transition-colors">{{ t('admin.gamification.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>

        <!-- 실시간 공지 관리 -->
        <router-link to="/admin/notifications" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-status-moderate/30 bg-status-moderate/5 hover:bg-status-moderate/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-status-moderate/20 flex items-center justify-center text-status-moderate group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">notifications_active</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-status-moderate transition-colors">{{ t('admin.notifications.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>

        <!-- 도시락 배부 관리 -->
        <router-link to="/admin/meals" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-status-high/30 bg-status-high/5 hover:bg-status-high/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-status-high/20 flex items-center justify-center text-status-high group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">restaurant</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-status-high transition-colors">{{ t('admin.meals.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>

        <!-- 호텔 체크인 관리 -->
        <router-link to="/admin/hotels" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-primary-fixed-dim/30 bg-primary-fixed-dim/5 hover:bg-primary-fixed-dim/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">hotel</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-primary-fixed-dim transition-colors">{{ t('admin.hotel.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>

        <!-- 보안 및 인프라 모니터링 -->
        <router-link to="/admin/security" class="glass-panel rounded-xl p-lg flex items-center justify-between border border-security-alert/30 bg-security-alert/5 hover:bg-security-alert/10 transition-all group">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-lg bg-security-alert/20 flex items-center justify-center text-security-alert group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">policy</span>
            </div>
            <h3 class="font-label-lg text-on-surface group-hover:text-security-alert transition-colors">{{ t('admin.security.title') }}</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
        </router-link>
      </div>

      <!-- 2. 핵심 통계 위젯 (2개) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <!-- 운영 구역 (KPI) -->
        <div class="glass-panel rounded-xl p-lg flex flex-col justify-between h-40">
          <div class="flex justify-between items-start">
            <span class="font-label-lg text-on-surface-variant">{{ t('admin.operations.kpi.activeZones') }}</span>
            <span class="material-symbols-outlined text-primary-fixed-dim">groups</span>
          </div>
          <div class="flex items-end gap-md">
            <span class="font-display-lg text-primary-fixed-dim">12,842</span>
            <div class="flex items-center text-status-low font-label-sm mb-base">
              <span class="material-symbols-outlined text-sm">arrow_upward</span>
              <span>12%</span>
            </div>
          </div>
          <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-sm">
            <div class="bg-primary-fixed-dim h-full w-4/5 shadow-[0_0_8px_rgba(0,219,233,0.8)]"></div>
          </div>
        </div>

        <!-- PASS AUTH (통계) -->
        <div class="glass-panel rounded-xl p-lg flex flex-col justify-between h-40">
          <div class="flex justify-between items-start">
            <span class="font-label-lg text-on-surface-variant">PASS AUTH</span>
            <span class="material-symbols-outlined text-primary-fixed-dim">qr_code_2</span>
          </div>
          <div class="flex items-end gap-md">
            <span class="font-display-lg text-primary-fixed-dim">342</span>
            <div class="flex items-center text-status-moderate font-label-sm mb-base">
              <span class="material-symbols-outlined text-sm">trending_up</span>
              <span>PEAK</span>
            </div>
          </div>
          <div class="flex gap-xs items-end h-8">
            <div class="flex-1 bg-primary-fixed-dim/20 h-2 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed-dim/40 h-4 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed-dim/30 h-3 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed-dim/60 h-6 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed-dim/80 h-8 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed-dim h-7 rounded-t-sm shadow-[0_0_5px_rgba(0,219,233,0.5)]"></div>
            <div class="flex-1 bg-primary-fixed-dim/50 h-5 rounded-t-sm"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
