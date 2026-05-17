<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'

const { t } = useI18n()
const store = useGamificationControlStore()

const newQuestTitle = ref('')
const selectedSpace = ref('')
const selectedReward = ref('')

const handleCreate = () => {
  if (!newQuestTitle.value || !selectedSpace.value) return
  
  store.createDynamicQuest({
    titleKey: newQuestTitle.value,
    targetSpaceId: selectedSpace.value,
    rewardId: selectedReward.value || 'reward-badge-set',
    descriptionKey: 'admin.gamification.quests.translationCenter.description' // Mock key
  })

  newQuestTitle.value = ''
  selectedSpace.value = ''
}
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10 h-full flex flex-col">
    <h3 class="font-label-md text-on-surface flex items-center gap-xs mb-lg">
      <span class="material-symbols-outlined text-sm text-primary">add_task</span>
      {{ t('admin.gamification.questControl') }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-lg flex-1">
      <!-- Create Section -->
      <div class="space-y-md border-r border-white/5 pr-lg">
        <div class="space-y-xs">
          <label class="text-[10px] text-on-surface-variant uppercase tracking-widest">{{ t('admin.gamification.quests.title') }}</label>
          <input v-model="newQuestTitle" type="text" :placeholder="t('admin.gamification.quests.placeholder')" class="w-full bg-white/5 border border-white/10 rounded-lg px-md py-sm text-sm outline-none focus:border-primary" />
        </div>
        <div class="grid grid-cols-2 gap-md">
          <div class="space-y-xs">
            <label class="text-[10px] text-on-surface-variant uppercase tracking-widest">{{ t('admin.gamification.quests.targetSpace') }}</label>
            <select v-model="selectedSpace" class="w-full bg-surface-dark border border-white/10 rounded-lg px-md py-sm text-xs outline-none">
              <option value="">{{ t('admin.operations.controls.selectSpace') }}</option>
              <option v-for="spot in store.stampSpotsList" :key="spot.id" :value="spot.id">{{ t(spot.nameKey) }}</option>
            </select>
          </div>
          <div class="space-y-xs">
            <label class="text-[10px] text-on-surface-variant uppercase tracking-widest">{{ t('admin.gamification.quests.reward') }}</label>
            <select v-model="selectedReward" class="w-full bg-surface-dark border border-white/10 rounded-lg px-md py-sm text-xs outline-none">
              <option value="">{{ t('admin.gamification.quests.reward') }}</option>
              <option v-for="reward in store.rewardStocks" :key="reward.id" :value="reward.id">{{ t(reward.nameKey) }}</option>
            </select>
          </div>
        </div>
        <button @click="handleCreate" :disabled="!newQuestTitle || !selectedSpace" class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md shadow-lg disabled:opacity-50 transition-all active:scale-95">
          {{ t('admin.gamification.quests.create') }}
        </button>
      </div>

      <!-- Active Quests List -->
      <div class="space-y-sm overflow-y-auto max-h-48 custom-scrollbar">
        <div v-for="quest in store.dynamicQuests" :key="quest.id" class="p-md bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
          <div class="min-w-0">
            <p class="font-label-md text-on-surface line-clamp-1">{{ quest.titleKey.includes('.') ? t(quest.titleKey) : quest.titleKey }}</p>
            <div class="flex items-center gap-sm mt-1">
              <span class="text-[8px] font-black uppercase px-xs rounded bg-primary/20 text-primary" :class="{ 'bg-white/10 text-on-surface-variant': quest.status !== 'active' }">
                {{ t('admin.gamification.questStatus.' + quest.status) }}
              </span>
              <span class="text-[10px] text-on-surface-variant">{{ quest.participantCount }} Joined</span>
            </div>
          </div>
          <div class="flex gap-xs">
            <button @click="store.toggleQuestStatus(quest.id)" class="p-2 bg-white/5 rounded-lg hover:bg-white/10">
              <span class="material-symbols-outlined text-sm">{{ quest.status === 'active' ? 'pause' : 'play_arrow' }}</span>
            </button>
            <button @click="store.deleteQuest(quest.id)" class="p-2 bg-white/5 rounded-lg hover:bg-security-alert/20 hover:text-security-alert">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
