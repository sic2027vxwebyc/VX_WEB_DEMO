<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 메인 App 컴포넌트
 * 전체적인 레이아웃 구조(상단바, 사이드바, 하단바)를 정의합니다.
 */
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from './stores/theme'
import TopAppBar from './components/layout/TopAppBar.vue'
import SideNavBar from './components/layout/SideNavBar.vue'
import BottomNavBar from './components/layout/BottomNavBar.vue'
import WebXRDiagnosticsPanel from './components/debug/WebXRDiagnosticsPanel.vue'
import { logger } from './utils/logger'

const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

/**
 * 전역 타이틀 업데이트 핸들러
 * 언어 변경 또는 라우트 변경 시 호출됩니다.
 */
const updateTitle = () => {
  const titleKey = route.meta?.titleKey
  if (titleKey) {
    const title = t(titleKey)
    document.title = `${title} | VX Web Demo`
  }
}

/**
 * 전역 네비게이션 핸들러
 * 하위 컴포넌트에서 발생한 이동 요청을 처리합니다.
 */
const handleNavigation = ({ path, name }) => {
  logger.info('App', `페이지 이동 요청 수신: ${name} (${path})`)
  router.push(path)
}

// 언어 변경 감지
watch(locale, () => {
  logger.info('App', `언어 변경 감지됨: ${locale.value}. 타이틀을 업데이트합니다.`)
  updateTitle()
})

// 라우트 변경 감지
watch(() => route.path, () => {
  updateTitle()
})

onMounted(() => {
  themeStore.applyTheme()
  updateTitle()
  logger.info('App', 'App 컴포넌트가 마운트되었습니다.')
})
</script>

<template>
  <div class="min-h-screen bg-surface-light dark:bg-background text-surface-dark dark:text-on-surface transition-colors duration-300">
    <!-- 상단 앱 바 -->
    <TopAppBar @navigate="handleNavigation" />

    <!-- 사이드 네비게이션 바 (데스크톱) -->
    <SideNavBar @navigate="handleNavigation" />

    <!-- 메인 컨텐츠 영역 -->
    <main class="lg:ml-64 pt-16 min-h-screen transition-all duration-300">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
          @before-enter="logger.debug('App', '페이지 전환 시작')"
          @after-enter="logger.debug('App', '페이지 전환 완료')"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 하단 네비게이션 바 (모바일) -->
    <BottomNavBar @navigate="handleNavigation" />

    <!-- 플로팅 액션 버튼 (모바일) -->
    <button 
      @click="handleNavigation({ path: '/map', name: t('navigation.explore') })"
      class="fixed bottom-20 right-4 lg:hidden bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-95 transition-transform"
    >
      <span class="material-symbols-outlined">add_location</span>
    </button>
    <!-- WebXR 진단 패널 -->
    <!-- <WebXRDiagnosticsPanel /> -->
  </div>
</template>

<style>
/* 페이지 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
