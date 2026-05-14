// src/stores/telemetry.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MetricPoint, LogEntry } from '../models/telemetry';
import { generateTick } from '../services/mockData';

export const useTelemetryStore = defineStore('telemetry', () => {
  // --- State ---
  const cpuHistory = ref<MetricPoint[]>([]);
  const memoryHistory = ref<MetricPoint[]>([]);
  const networkHistory = ref<MetricPoint[]>([]);
  const logs = ref<LogEntry[]>([]);
  
  const isStreaming = ref(false);
  let streamInterval: number | undefined;

  // Configuration for performance tuning
  const MAX_DATA_POINTS = 60; // E.g., 60 seconds of history visible on the chart
  const MAX_LOGS = 100;

  // --- Core Logic ---
  const processNewData = () => {
    const newData = generateTick();

    cpuHistory.value.push(newData.cpu);
    memoryHistory.value.push(newData.memory);
    networkHistory.value.push(newData.network);

    if (newData.newLog) {
      logs.value.unshift(newData.newLog); // Put newest logs at the top
    }

    // PERFORMANCE OPTIMIZATION: Prevent memory leaks by truncating arrays
    if (cpuHistory.value.length > MAX_DATA_POINTS) cpuHistory.value.shift();
    if (memoryHistory.value.length > MAX_DATA_POINTS) memoryHistory.value.shift();
    if (networkHistory.value.length > MAX_DATA_POINTS) networkHistory.value.shift();
    if (logs.value.length > MAX_LOGS) logs.value.pop();
  };

  // --- Actions ---
  const startStream = () => {
    if (isStreaming.value) return; // Prevent multiple intervals
    isStreaming.value = true;
    
    // "Pre-fill" the charts so they aren't empty when the user first loads the page
    if (cpuHistory.value.length === 0) {
      for (let i = 0; i < MAX_DATA_POINTS; i++) {
        processNewData();
      }
    }

    // Simulate real-time updates every 1 second (1000ms)
    streamInterval = window.setInterval(() => {
      processNewData();
    }, 1000);
  };

  const stopStream = () => {
    isStreaming.value = false;
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = undefined;
    }
  };

  // --- Getters ---
  // Easy access to the absolute newest number for our metric cards
  const currentCpu = computed(() => cpuHistory.value[cpuHistory.value.length - 1]?.value || 0);
  const currentMemory = computed(() => memoryHistory.value[memoryHistory.value.length - 1]?.value || 0);
  const currentNetwork = computed(() => networkHistory.value[networkHistory.value.length - 1]?.value || 0);

  return {
    // State
    cpuHistory,
    memoryHistory,
    networkHistory,
    logs,
    isStreaming,
    // Getters
    currentCpu,
    currentMemory,
    currentNetwork,
    // Actions
    startStream,
    stopStream
  };
});