<script setup>
/**
 * [ WebXR 진단 패널 ]
 * 개발 및 디버깅을 위해 WebXR 지원 상태를 화면에 표시합니다.
 */
import { ref, onMounted } from 'vue'
import { getWebXRDiagnostics } from '@/utils/webxrDiagnostics'

const diagnostics = ref(null)
const isOpen = ref(false)

const refresh = async () => {
  diagnostics.value = await getWebXRDiagnostics()
}

onMounted(refresh)
</script>

<template>
  <div class="fixed bottom-4 left-4 z-[9999] pointer-events-none">
    <button 
      @click="isOpen = !isOpen"
      class="pointer-events-auto bg-black/80 text-white p-2 rounded-lg text-[10px] font-mono border border-white/20 hover:bg-black transition-colors"
    >
      {{ isOpen ? 'CLOSE DIAGNOSTICS' : 'WEBXR DIAGNOSTICS' }}
    </button>

    <div v-if="isOpen && diagnostics" class="mt-2 pointer-events-auto bg-black/95 text-green-400 p-4 rounded-xl border border-white/10 w-80 max-h-[400px] overflow-auto text-[11px] font-mono shadow-2xl">
      <h3 class="text-white border-b border-white/10 pb-2 mb-2 font-bold">SYSTEM STATUS</h3>
      
      <div class="space-y-1">
        <p class="flex justify-between">
          <span>Secure Context:</span>
          <span :class="diagnostics.isSecureContext ? 'text-green-400' : 'text-red-400'">{{ diagnostics.isSecureContext }}</span>
        </p>
        <p class="flex justify-between">
          <span>navigator.xr:</span>
          <span :class="diagnostics.hasNavigatorXR ? 'text-green-400' : 'text-red-400'">{{ diagnostics.hasNavigatorXR }}</span>
        </p>
        <p class="flex justify-between">
          <span>WebGL Ready:</span>
          <span :class="diagnostics.webglAvailable ? 'text-green-400' : 'text-red-400'">{{ diagnostics.webglAvailable }}</span>
        </p>
        <div class="h-[1px] bg-white/10 my-2"></div>
        <p class="flex justify-between">
          <span>Immersive VR:</span>
          <span :class="diagnostics.supportsImmersiveVR ? 'text-green-400' : 'text-red-400'">{{ diagnostics.supportsImmersiveVR }}</span>
        </p>
        <p class="flex justify-between">
          <span>Immersive AR:</span>
          <span :class="diagnostics.supportsImmersiveAR ? 'text-green-400' : 'text-red-400'">{{ diagnostics.supportsImmersiveAR }}</span>
        </p>
        <p class="flex justify-between">
          <span>Inline XR:</span>
          <span :class="diagnostics.supportsInline ? 'text-green-400' : 'text-red-400'">{{ diagnostics.supportsInline }}</span>
        </p>
      </div>

      <div v-if="diagnostics.errors.length > 0" class="mt-4">
        <h3 class="text-red-400 border-b border-red-900/50 pb-1 mb-1 font-bold uppercase">Errors</h3>
        <div v-for="(err, idx) in diagnostics.errors" :key="idx" class="text-red-300 mb-2">
          [{{ err.type }}] {{ err.message }}
        </div>
      </div>

      <div class="mt-4 text-white/40 text-[9px] break-all border-t border-white/10 pt-2">
        UA: {{ diagnostics.userAgent }}
      </div>

      <button 
        @click="refresh"
        class="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-1 rounded transition-colors"
      >
        REFRESH
      </button>
    </div>
  </div>
</template>
