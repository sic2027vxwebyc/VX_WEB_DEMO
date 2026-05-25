<script setup>
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { devices, selectedDeviceId } = useSecurityTelemetry()

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
    case 'degraded': return 'bg-amber-500'
    case 'offline': return 'bg-rose-500'
    default: return 'bg-white/20'
  }
}

const getNetworkIcon = (status) => {
  switch (status) {
    case 'good': return 'wifi'
    case 'unstable': return 'wifi_2_bar'
    case 'disconnected': return 'wifi_off'
    default: return 'wifi'
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ $t('admin.security.deviceTelemetry') }}</h3>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      <div 
        v-for="device in devices" 
        :key="device.id"
        @click="selectedDeviceId = device.id"
        :class="[
          'p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group',
          selectedDeviceId === device.id 
            ? 'bg-white/10 border-white/30' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        ]"
      >
        <div :class="['absolute left-0 top-0 bottom-0 w-1 transition-all', getStatusColor(device.status)]"></div>
        
        <div class="flex items-center justify-between mb-2">
          <span class="text-white text-sm font-bold truncate pr-4">
            {{ device.nameKey.startsWith('admin.') ? $t(device.nameKey) : device.nameKey }}
          </span>
          <span class="material-symbols-outlined text-white/40 text-sm">{{ getNetworkIcon(device.networkStatus) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-[10px] text-white/30 font-mono">{{ device.id }}</span>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-white/60 font-mono">{{ device.batteryPercent }}%</span>
              <div class="w-6 h-3 bg-white/10 rounded-[2px] p-[1px] relative overflow-hidden">
                <div 
                  class="h-full rounded-[1px] transition-all" 
                  :class="device.batteryPercent > 20 ? 'bg-emerald-500' : 'bg-rose-500'"
                  :style="{ width: `${device.batteryPercent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Usage Pulse (Small) -->
        <div class="mt-3 grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-[8px] text-white/40 font-bold uppercase">
              <span>CPU</span>
              <span>{{ device.cpuUsage }}%</span>
            </div>
            <div class="h-1 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-blue-400" :style="{ width: `${device.cpuUsage}%` }"></div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-[8px] text-white/40 font-bold uppercase">
              <span>MEM</span>
              <span>{{ device.memoryUsage }}%</span>
            </div>
            <div class="h-1 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-purple-400" :style="{ width: `${device.memoryUsage}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
