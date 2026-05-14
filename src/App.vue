<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTelemetryStore } from './stores/telemetry';

const store = useTelemetryStore();

// Start the stream when the app loads
onMounted(() => {
  store.startStream();
});

// Clean up if the app is destroyed
onUnmounted(() => {
  store.stopStream();
});
</script>

<template>
  <div class="min-h-screen p-8 bg-gray-900 text-white font-sans">
    <h1 class="text-3xl font-bold mb-6">System Telemetry</h1>
    
    <div class="flex gap-4 mb-8">
      <button 
        @click="store.isStreaming ? store.stopStream() : store.startStream()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors"
      >
        {{ store.isStreaming ? 'Pause Stream' : 'Resume Stream' }}
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h2 class="text-gray-400 text-sm uppercase tracking-wider">CPU Usage</h2>
        <p class="text-4xl font-bold text-green-400">{{ store.currentCpu }}%</p>
      </div>
      <div class="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h2 class="text-gray-400 text-sm uppercase tracking-wider">Memory Usage</h2>
        <p class="text-4xl font-bold text-blue-400">{{ store.currentMemory }}%</p>
      </div>
      <div class="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h2 class="text-gray-400 text-sm uppercase tracking-wider">Network I/O</h2>
        <p class="text-4xl font-bold text-purple-400">{{ store.currentNetwork }} Mbps</p>
      </div>
    </div>
  </div>
</template>