<template>
  <div ref="container" class="spatial-viewer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { assetManager } from './data/assetManager';

const props = defineProps({
  rendererFactory: {
    type: Function,
    default: (params) => new THREE.WebGLRenderer(params)
  }
});

const container = ref(null);
let scene, camera, renderer, frustum, cameraViewProjectionMatrix;

onMounted(() => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = props.rendererFactory({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  frustum = new THREE.Frustum();
  cameraViewProjectionMatrix = new THREE.Matrix4();

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    
    // Frustum update
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    // Culling logic (Mock)
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.visible = frustum.intersectsObject(obj);
      }
    });

    renderer.render(scene, camera);
  }
  animate();
});

onUnmounted(() => {
  if (renderer) renderer.dispose();
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
        else object.material.dispose();
      }
    });
  }
});
</script>

<style scoped>
.spatial-viewer { width: 100%; height: 100vh; }
</style>
