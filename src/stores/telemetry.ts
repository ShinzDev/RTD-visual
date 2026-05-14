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
  // --- Core Logic ---
    const processNewData = () => {
      const newData = generateTick();
  
      // Create fresh array references and slice them immediately to prevent memory leaks.
      // This perfectly triggers Vue's and TanStack's reactivity engines.
      cpuHistory.value = [...cpuHistory.value, newData.cpu].slice(-MAX_DATA_POINTS);
      memoryHistory.value = [...memoryHistory.value, newData.memory].slice(-MAX_DATA_POINTS);
      networkHistory.value = [...networkHistory.value, newData.network].slice(-MAX_DATA_POINTS);
  
      if (newData.newLog) {
        // Put the new log at the front, keep the rest, and slice to the max limit
        logs.value = [newData.newLog, ...logs.value].slice(0, MAX_LOGS);
      }
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