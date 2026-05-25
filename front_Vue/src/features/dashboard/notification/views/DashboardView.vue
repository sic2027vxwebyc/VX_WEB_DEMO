<template>
  <div class="dashboard-container p-lg bg-surface">
    <h1 class="text-headline-lg text-on-surface">Admin Dashboard</h1>
    <div class="notification-list mt-md">
      <h2 class="text-headline-md text-on-surface-variant">Real-time Notifications</h2>
      <ul>
        <li v-for="noti in notificationStore.notifications" :key="noti.id" class="text-body-md text-on-surface">
          {{ noti.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '../stores/notification';

const notificationStore = useNotificationStore();

onMounted(() => {
  notificationStore.connect();
});

onUnmounted(() => {
  notificationStore.disconnect();
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
}
</style>
