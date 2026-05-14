<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTelemetryStore } from './stores/telemetry';
import LineChart from './components/charts/LineChart.vue';
import ActivityFeed from './components/common/ActivityFeed.vue';

const store = useTelemetryStore();

onMounted(() => {
  store.startStream();
});

onUnmounted(() => {
  store.stopStream();
});
</script>

<template>
  <div class="min-h-screen p-8 bg-[#0f172a] text-white font-sans">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        
        <h1 class="text-3xl font-bold tracking-tight text-gray-100">System Telemetry</h1>
        <p class="text-gray-400 mt-1">Real-time monitoring dashboard</p>
      </div>
      
      <button 
        @click="store.isStreaming ? store.stopStream() : store.startStream()"
        class="px-6 py-2.5 rounded-lg font-bold transition-all duration-200 flex items-center gap-2"
        :class="store.isStreaming 
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
          : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'"
      >
        <span class="relative flex h-3 w-3" v-if="store.isStreaming">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        {{ store.isStreaming ? 'Pause Stream' : 'Resume Stream' }}
      </button>
    </div>

    <!-- The Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      <!-- CPU Card -->
      <div class="p-6 bg-[#1e293b] rounded-xl border border-gray-700/50 shadow-xl">
        <h2 class="text-gray-400 text-xs font-bold uppercase tracking-wider">CPU Usage</h2>
        <div class="flex items-end gap-2 mt-1">
          <p class="text-4xl font-bold text-emerald-400">{{ store.currentCpu }}%</p>
        </div>
        <!-- Render the CPU Chart -->
        <LineChart title="CPU" color="#34d399" :data="store.cpuHistory" />
      </div>

      <!-- Memory Card -->
      <div class="p-6 bg-[#1e293b] rounded-xl border border-gray-700/50 shadow-xl">
        <h2 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Memory Usage</h2>
        <div class="flex items-end gap-2 mt-1">
          <p class="text-4xl font-bold text-blue-400">{{ store.currentMemory }}%</p>
        </div>
        <!-- Render the Memory Chart -->
        <LineChart title="Memory" color="#60a5fa" :data="store.memoryHistory" />
      </div>

      <!-- Network Card -->
      <div class="p-6 bg-[#1e293b] rounded-xl border border-gray-700/50 shadow-xl">
        <h2 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Network I/O</h2>
        <div class="flex items-end gap-2 mt-1">
          <p class="text-4xl font-bold text-purple-400">{{ store.currentNetwork }}</p>
          <span class="text-gray-400 mb-1">Mbps</span>
        </div>
        <!-- Render the Network Chart -->
        <LineChart title="Network" color="#c084fc" :data="store.networkHistory" />
      </div>
       
    </div>
    <!-- The Activity Feed -->
  <div class="mt-8">
        <ActivityFeed :data="store.logs" />
      </div>
  </div>
</template>