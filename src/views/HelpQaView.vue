<script setup>
/**
 * [ 페이지 컴포넌트 ]
 * 도움말 및 Q&A 화면
 * QA.md를 Source of Truth로 사용하여 실시간 렌더링 및 검색 기능을 제공합니다.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { logger } from '@/utils/logger'

// QA.md를 Raw 텍스트로 임포트 (Vite 기능)
import qaMarkdown from '@/../QA.md?raw'

const router = useRouter()
const { t } = useI18n()
const scope = 'HelpQaView'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

// 검색어 및 카테고리 상태
const searchQuery = ref('')
const activeCategory = ref('all')

// Q&A 데이터 상태
const qaSections = ref([])

// Q&A 데이터 구조화를 위한 파싱 로직
const parseMarkdown = () => {
  const sections = []
  const lines = qaMarkdown.split('\n')
  let currentCategory = null
  let currentQA = null

  lines.forEach(line => {
    const trimmed = line.trim()
    
    // 카테고리 감지 (## 01. 카테고리명)
    if (trimmed.startsWith('## ') && !trimmed.includes('00.')) {
      const categoryName = trimmed.replace(/## \d+\.\s+/, '').split('(')[0].trim()
      currentCategory = {
        id: sections.length + 1,
        title: categoryName,
        items: []
      }
      sections.push(currentCategory)
    } 
    // 질문 감지 (### Q1. 질문내용)
    else if (trimmed.startsWith('### Q')) {
      if (currentCategory) {
        currentQA = {
          question: trimmed.replace(/### Q\d+\.\s+/, '').trim(),
          answerRaw: '',
          isOpen: false
        }
        currentCategory.items.push(currentQA)
      }
    }
    // 답변 내용 누적
    else if (currentQA && trimmed !== '---' && !trimmed.startsWith('#')) {
      currentQA.answerRaw += line + '\n'
    }
  })

  qaSections.value = sections
}

// 검색 및 필터링된 결과
const filteredSections = computed(() => {
  const query = searchQuery.value.toLowerCase()
  
  return qaSections.value.map(section => {
    // 카테고리 필터링
    if (activeCategory.value !== 'all' && section.title.toLowerCase() !== activeCategory.value.toLowerCase()) {
      if (!section.title.includes(activeCategory.value)) return null
    }

    const filteredItems = section.items.filter(item => {
      const matchSearch = item.question.toLowerCase().includes(query) || 
                          item.answerRaw.toLowerCase().includes(query)
      return matchSearch
    })

    if (filteredItems.length === 0) return null

    return {
      ...section,
      items: filteredItems
    }
  }).filter(Boolean)
})

// 카테고리 목록 추출
const categories = computed(() => {
  const list = [{ id: 'all', name: t('help.categories.all') }]
  qaSections.value.forEach(s => {
    list.push({ id: s.title, name: s.title })
  })
  return list
})

const navigateTo = (path) => {
  logger.info(scope, `페이지 이동: ${path}`)
  router.push(path)
}

const handleBack = () => {
  router.back()
}

const toggleItem = (item) => {
  item.isOpen = !item.isOpen
}

onMounted(() => {
  parseMarkdown()
  logger.info(scope, '도움말 페이지 마운트 완료')
})
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark pb-20 overflow-x-hidden">
    <!-- 상단 Hero 영역 -->
    <header class="relative pt-20 pb-16 px-6 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent z-0"></div>
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] z-0"></div>
      
      <div class="relative z-10 max-w-4xl mx-auto">
        <button 
          @click="handleBack"
          class="flex items-center gap-2 text-primary font-bold mb-6 hover:translate-x--1 transition-transform"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          {{ t('help.backHome') }}
        </button>
        
        <h1 class="text-display-md font-display-md text-on-surface mb-4 tracking-tight">
          {{ t('help.title') }}
        </h1>
        <p class="text-headline-sm text-on-surface-variant max-w-2xl leading-relaxed">
          {{ t('help.subtitle') }}
        </p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 relative z-10">
      <!-- 검색바 영역 -->
      <div class="sticky top-4 z-30 mb-12">
        <div class="glass-card p-2 rounded-[2rem] shadow-2xl flex items-center gap-3 border border-white/20 dark:border-white/5">
          <span class="material-symbols-outlined ml-4 text-primary">search</span>
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t('help.searchPlaceholder')"
            class="flex-1 bg-transparent border-none outline-none py-4 text-lg font-medium text-on-surface placeholder:text-on-surface-variant/50"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="p-2 hover:bg-black/5 rounded-full"
          >
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
      </div>

      <!-- 카테고리 필터 칩 -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-6 py-2.5 rounded-full font-bold text-sm transition-all shrink-0 border whitespace-nowrap',
            activeCategory === cat.id 
              ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/50'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Q&A 리스트 -->
      <div v-if="filteredSections.length > 0" class="space-y-12">
        <section v-for="section in filteredSections" :key="section.id" class="animate-fade-in">
          <h2 class="text-headline-md font-bold text-on-surface mb-6 flex items-center gap-3">
            <span class="w-1.5 h-8 bg-primary rounded-full"></span>
            {{ section.title }}
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="(item, idx) in section.items" 
              :key="idx"
              class="group bg-surface-container-low dark:bg-surface-container-high/40 rounded-[2rem] border border-outline-variant/10 overflow-hidden transition-all duration-300"
              :class="item.isOpen ? 'shadow-xl border-primary/20 ring-1 ring-primary/10' : 'hover:border-primary/30'"
            >
              <button 
                @click="toggleItem(item)"
                class="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
              >
                <span class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {{ item.question }}
                </span>
                <span 
                  class="material-symbols-outlined text-primary transition-transform duration-500"
                  :class="{ 'rotate-180': item.isOpen }"
                >
                  expand_more
                </span>
              </button>
              
              <div 
                v-show="item.isOpen" 
                class="px-8 pb-8 animate-slide-down"
              >
                <div class="h-[1px] w-full bg-outline-variant/10 mb-6"></div>
                <div 
                  class="qa-content text-lg text-on-surface-variant leading-relaxed font-medium"
                  v-html="md.render(item.answerRaw)"
                ></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 검색 결과 없음 -->
      <div v-else class="py-20 text-center">
        <div class="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-20">search_off</span>
        </div>
        <p class="text-xl font-bold text-on-surface mb-2">{{ t('help.noResults') }}</p>
        <button @click="searchQuery = ''; activeCategory = 'all'" class="text-primary font-bold hover:underline">
          초기화 후 전체 보기
        </button>
      </div>
    </main>

    <!-- 하단 퀵 액션 (PC 전용 레이아웃 최적화) -->
    <div class="mt-20 max-w-4xl mx-auto px-6 hidden lg:block">
      <div class="grid grid-cols-3 gap-6">
        <button @click="navigateTo('/')" class="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col items-center gap-4 hover:bg-primary/10 transition-all">
          <span class="material-symbols-outlined text-primary text-4xl">home</span>
          <span class="font-bold text-on-surface">{{ t('navigation.home') }}</span>
        </button>
        <button @click="navigateTo('/map')" class="p-8 bg-secondary/5 rounded-[2.5rem] border border-secondary/10 flex flex-col items-center gap-4 hover:bg-secondary/10 transition-all">
          <span class="material-symbols-outlined text-secondary text-4xl">map</span>
          <span class="font-bold text-on-surface">{{ t('navigation.map') }}</span>
        </button>
        <button @click="navigateTo('/events')" class="p-8 bg-tertiary/5 rounded-[2.5rem] border border-tertiary/10 flex flex-col items-center gap-4 hover:bg-tertiary/10 transition-all">
          <span class="material-symbols-outlined text-tertiary text-4xl">calendar_today</span>
          <span class="font-bold text-on-surface">{{ t('navigation.events') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  @apply bg-white/70 dark:bg-surface-container-high/60 backdrop-blur-[30px];
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-down {
  animation: slideDown 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.qa-content p) {
  margin-bottom: 1.5rem;
}

:deep(.qa-content p:last-child) {
  margin-bottom: 0;
}

:deep(.qa-content strong) {
  @apply text-primary font-black;
}

:deep(.qa-content ul) {
  @apply list-disc list-inside space-y-2 mb-4;
}

:deep(.qa-content li) {
  @apply pl-2;
}
</style>
