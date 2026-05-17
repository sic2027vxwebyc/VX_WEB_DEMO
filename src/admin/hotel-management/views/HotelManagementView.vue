<script setup>
import HotelKpiCards from '../components/HotelKpiCards.vue'
import HotelQrScannerPanel from '../components/HotelQrScannerPanel.vue'
import HotelInventoryPanel from '../components/HotelInventoryPanel.vue'
import HotelReservationTable from '../components/HotelReservationTable.vue'
import HotelCheckInLogPanel from '../components/HotelCheckInLogPanel.vue'
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 pt-20 md:pt-24 pb-24 md:pb-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="mb-2">
        <h1 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">{{ $t('admin.hotel.title') }}</h1>
        <p class="text-white/40 text-sm">{{ $t('admin.hotel.subtitle') }}</p>
      </div>

      <HotelKpiCards />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-5 flex flex-col">
          <HotelQrScannerPanel />
        </div>
        <div class="lg:col-span-7 flex flex-col">
          <HotelInventoryPanel />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 flex flex-col">
          <HotelReservationTable />
        </div>
        <div class="lg:col-span-4 flex flex-col">
          <HotelCheckInLogPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
