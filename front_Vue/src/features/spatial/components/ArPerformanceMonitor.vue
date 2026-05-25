<template>
  <div class="ar-perf-monitor absolute top-md left-md bg-surface/80 p-sm rounded text-label-sm text-on-surface">
    FPS: {{ fps }} | Mem: {{ memory }}MB
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const fps = ref(0);
const memory = ref(0);
let lastTime = performance.now();
let frames = 0;
let rafId = null;

onMounted(() => {
  const update = () => {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps.value = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
      if (window.performance && performance.memory) {
        memory.value = Math.round(performance.memory.usedJSHeapSize / 1048576);
      }
    }
    rafId = requestAnimationFrame(update);
  };
  rafId = requestAnimationFrame(update);
});

onUnmounted(() => cancelAnimationFrame(rafId));
</script>
