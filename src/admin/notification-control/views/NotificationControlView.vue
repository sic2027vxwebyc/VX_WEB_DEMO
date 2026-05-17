<script setup>
import NotificationKpiCards from '../components/NotificationKpiCards.vue'
import EmergencyTickerControlPanel from '../components/EmergencyTickerControlPanel.vue'
import ActiveTickerPreviewPanel from '../components/ActiveTickerPreviewPanel.vue'
import SessionChangeControlPanel from '../components/SessionChangeControlPanel.vue'
import NotificationEventLog from '../components/NotificationEventLog.vue'
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 pt-20 md:pt-24 pb-24 md:pb-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Title & KPI -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ $t('admin.notifications.title') }}</h1>
          <p class="text-white/60">{{ $t('admin.notifications.subtitle') }}</p>
        </div>
      </div>

      <NotificationKpiCards />

      <!-- Main Controls Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Emergency Ticker (4/12) -->
        <div class="lg:col-span-4">
          <EmergencyTickerControlPanel />
        </div>

        <!-- Center: Preview (4/12) -->
        <div class="lg:col-span-4">
          <ActiveTickerPreviewPanel />
        </div>

        <!-- Right: Session Change (4/12) -->
        <div class="lg:col-span-4">
          <SessionChangeControlPanel />
        </div>
      </div>

      <!-- Bottom: Event Log -->
      <NotificationEventLog />
    </div>
  </div>
</template>
