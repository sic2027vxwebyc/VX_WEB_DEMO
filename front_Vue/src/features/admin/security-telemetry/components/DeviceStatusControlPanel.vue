<script setup>
import { ref, watch } from 'vue'
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { selectedDevice, handleControlDevice, refreshHeartbeat } = useSecurityTelemetry()

const statusOptions = ['online', 'degraded', 'offline', 'maintenance']
const networkOptions = ['good', 'unstable', 'disconnected']

const form = ref({
  status: 'online',
  networkStatus: 'good',
  batteryPercent: 100
})

watch(selectedDevice, (newVal) => {
  if (newVal) {
    form.value = {
      status: newVal.status,
      networkStatus: newVal.networkStatus,
      batteryPercent: newVal.batteryPercent
    }
  }
}, { immediate: true })

const isUpdating = ref(false)

const applyChanges = async () => {
  if (!selectedDevice.value) return
  isUpdating.value = true
  try {
    await handleControlDevice(selectedDevice.value.id, { ...form.value })
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full flex flex-col">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-2 h-6 bg-blue-400 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.security.deviceControl') }}</h3>
    </div>

    <div v-if="!selectedDevice" class="flex-1 flex flex-col items-center justify-center text-white/20 space-y-4">
      <svg class="w-16 h-16 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      <p class="text-sm text-center px-8">{{ $t('admin.security.selectDeviceToControl') }}</p>
    </div>

    <div v-else class="flex-1 space-y-5">
      <div>
        <label class="block text-[10px] text-white/40 mb-2 uppercase font-bold tracking-wider">{{ $t('admin.security.deviceStatusTitle') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="opt in statusOptions" 
            :key="opt"
            @click="form.status = opt"
            :class="[
              'px-2 py-2 rounded-lg text-[10px] font-medium transition-all border text-center uppercase',
              form.status === opt 
                ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
            ]"
          >
            {{ $t(`admin.security.deviceStatus.${opt}`) }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-[10px] text-white/40 mb-2 uppercase font-bold tracking-wider">{{ $t('admin.security.networkStatusTitle') }}</label>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="opt in networkOptions" 
            :key="opt"
            @click="form.networkStatus = opt"
            :class="[
              'px-3 py-2 rounded-lg text-[10px] font-medium transition-all border uppercase',
              form.networkStatus === opt 
                ? 'bg-white/20 text-white border-white/40' 
                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
            ]"
          >
            {{ $t(`admin.security.networkStatus.${opt}`) }}
          </button>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-[10px] text-white/40 uppercase font-bold tracking-wider">{{ $t('admin.security.fields.battery') }}</label>
          <span class="text-xs text-white font-mono">{{ form.batteryPercent }}%</span>
        </div>
        <input 
          type="range" 
          v-model.number="form.batteryPercent" 
          min="0" max="100"
          class="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div class="pt-4 space-y-3">
        <button 
          @click="applyChanges"
          :disabled="isUpdating"
          class="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
        >
          <span v-if="isUpdating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ $t('admin.security.applyDeviceChanges') }}
        </button>
        <button 
          @click="refreshHeartbeat(selectedDevice.id)"
          class="w-full py-3 rounded-xl bg-white/5 text-white/60 font-bold border border-white/10 hover:bg-white/10 transition-all text-sm"
        >
          {{ $t('admin.security.refreshHeartbeat') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
</style>
