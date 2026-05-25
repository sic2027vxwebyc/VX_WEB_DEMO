<script setup>
import SecurityTelemetryKpiCards from '../components/SecurityTelemetryKpiCards.vue'
import SecurityLogPanel from '../components/SecurityLogPanel.vue'
import SecurityEventDetailPanel from '../components/SecurityEventDetailPanel.vue'
import DeviceTelemetryPanel from '../components/DeviceTelemetryPanel.vue'
import DeviceStatusControlPanel from '../components/DeviceStatusControlPanel.vue'
import SecurityOperationLogPanel from '../components/SecurityOperationLogPanel.vue'
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 pt-20 md:pt-24 pb-24 md:pb-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Title Section -->
      <div class="mb-2">
        <h1 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">{{ $t('admin.security.title') }}</h1>
        <p class="text-white/40 text-sm">{{ $t('admin.security.subtitle') }}</p>
      </div>

      <!-- KPI Cards -->
      <SecurityTelemetryKpiCards />

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Security Logs (3/12) -->
        <div class="lg:col-span-3 h-[600px]">
          <SecurityLogPanel />
        </div>

        <!-- Middle Column: Detail & Control (5/12) -->
        <div class="lg:col-span-5 flex flex-col gap-6 h-[600px]">
          <div class="flex-1 min-h-0">
            <SecurityEventDetailPanel />
          </div>
          <div class="h-[240px]">
            <DeviceStatusControlPanel />
          </div>
        </div>

        <!-- Right Column: Device Telemetry (4/12) -->
        <div class="lg:col-span-4 h-[600px]">
          <DeviceTelemetryPanel />
        </div>
      </div>

      <!-- Bottom Row: Operation Logs -->
      <SecurityOperationLogPanel />
    </div>
  </div>
</template>

<style>
/* 전역 스크롤바 스타일 (커스텀) */
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
