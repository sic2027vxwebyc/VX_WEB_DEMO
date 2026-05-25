<script setup>
import MealInventoryKpiCards from '../components/MealInventoryKpiCards.vue'
import MealQrScannerPanel from '../components/MealQrScannerPanel.vue'
import MealPickupPreviewPanel from '../components/MealPickupPreviewPanel.vue'
import MealReservationTable from '../components/MealReservationTable.vue'
import MealPickupLogPanel from '../components/MealPickupLogPanel.vue'
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 pt-20 md:pt-24 pb-24 md:pb-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Title Section -->
      <div class="mb-2">
        <h1 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">{{ $t('admin.meals.title') }}</h1>
        <p class="text-white/40 text-sm">{{ $t('admin.meals.subtitle') }}</p>
      </div>

      <!-- KPI Cards -->
      <MealInventoryKpiCards />

      <!-- Top Row: Scanner & Preview (Grid: 5 / 7) -->
      <!-- 고정 높이 제거 및 유연한 높이 적용 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-5 w-full">
          <MealQrScannerPanel />
        </div>
        <div class="lg:col-span-7 w-full">
          <MealPickupPreviewPanel />
        </div>
      </div>

      <!-- Bottom Row: Table & Logs (Grid: 8 / 4) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 w-full">
          <MealReservationTable />
        </div>
        <div class="lg:col-span-4 w-full">
          <MealPickupLogPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 전역 스크롤바 스타일 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
