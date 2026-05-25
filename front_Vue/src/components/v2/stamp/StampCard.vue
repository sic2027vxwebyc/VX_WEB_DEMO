<script setup>
/**
 * [ 스탬프 정보 카드 ]
 * 개별 스탬프 스팟의 정보와 획득 상태를 표시합니다.
 */
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  spot: { type: Object, required: true },
  isCollected: { type: Boolean, default: false }
})

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="glass-panel p-6 rounded-3xl border transition-all hover:scale-[1.02]"
       :class="isCollected ? 'border-primary/40 bg-primary/5' : 'border-white/5 bg-white/5 opacity-80'">
    <div class="flex justify-between items-start mb-6">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl"
           :class="isCollected ? 'bg-primary/20' : 'bg-white/5 grayscale'">
        {{ spot.stampIcon }}
      </div>
      <div v-if="isCollected" class="px-3 py-1 bg-primary text-on-primary text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">
        Collected
      </div>
      <div v-else class="px-3 py-1 bg-white/10 text-on-surface-variant text-[10px] font-bold rounded-lg uppercase tracking-widest">
        Locked
      </div>
    </div>

    <h3 class="text-lg font-bold mb-1" :class="isCollected ? 'text-on-surface' : 'text-on-surface-variant'">{{ spot.name }}</h3>
    <p class="text-xs text-on-surface-variant mb-6">{{ spot.locationLabel }}</p>

    <div class="flex gap-2">
      <button @click="navigateTo(`/route-guide/${spot.routeDestinationId}`)"
              class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors">
        <span class="material-symbols-outlined text-sm">near_me</span>
      </button>
      <button @click="navigateTo(`/viewer-360/${spot.viewerSpaceId}`)"
              class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors">
        <span class="material-symbols-outlined text-sm">view_in_ar</span>
      </button>
    </div>
  </div>
</template>
