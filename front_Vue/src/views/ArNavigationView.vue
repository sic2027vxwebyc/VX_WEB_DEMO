<template>
  <div class="ar-container relative w-full h-screen bg-black">
    <video ref="video" autoplay playsinline class="absolute inset-0 w-full h-full object-cover"></video>
    <canvas ref="container" class="absolute inset-0 w-full h-full"></canvas>
    
    <div class="ar-overlay absolute inset-0 p-lg pointer-events-none">
      <div v-if="!isInitialized" class="flex items-center justify-center h-full">
        <button @click="startAr" class="bg-primary text-on-primary px-lg py-md rounded-lg pointer-events-auto">Start AR</button>
      </div>
      <div v-else class="ar-hud">
        <p class="text-on-surface bg-surface/80 p-sm rounded">Distance: {{ distanceToTarget }}m</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useArNavigation } from '@/composables/useArNavigation';
import { useArPermissions } from '@/composables/useArPermissions';

const container = ref(null);
const video = ref(null);
const { isInitialized, distanceToTarget, initScene, updateDirection } = useArNavigation();
const { requestCameraPermission } = useArPermissions();

const startAr = async () => {
  await requestCameraPermission();
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  video.value.srcObject = stream;
  initScene(container.value, video.value);
  
  // Mock path update
  setInterval(() => {
    updateDirection({ x: 0, y: 0 }, { x: 10, y: 10 });
  }, 100);
};
</script>
