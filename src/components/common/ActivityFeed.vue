<!-- src/components/common/ActivityFeed.vue -->
<script setup lang="ts">
import { useVueTable, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import type { LogEntry } from '../../models/telemetry';

// 1. Define the component contract
const props = defineProps<{
  data: LogEntry[];
}>();

// 2. Define the Columns (The architecture)
const columns = [
  {
    accessorKey: 'timestamp',
    header: 'Time',
    // Format the raw unix timestamp into a readable string
    cell: (info: any) => new Date(info.getValue()).toLocaleTimeString(),
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
  },
  {
    accessorKey: 'source',
    header: 'System Source',
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
];

// 3. Initialize the TanStack Table Engine
const table = useVueTable({
  get data() { return props.data }, // Reactive binding to Pinia
  columns,
  getCoreRowModel: getCoreRowModel(),
});

// Helper function to style our badges based on severity
const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'info': default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};
</script>

<template>
  <div class="bg-[#1e293b] rounded-xl border border-gray-700/50 shadow-xl overflow-hidden flex flex-col h-96">
    
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-700/50 bg-[#0f172a]/50 flex justify-between items-center">
      <h2 class="text-gray-200 font-bold tracking-wide">Live System Logs</h2>
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-xs text-gray-400 font-medium tracking-wider uppercase">Streaming Data</span>
      </div>
    </div>

    <!-- The Table Container (Scrollable) -->
    <div class="overflow-y-auto flex-1 custom-scrollbar">
      <table class="w-full text-left text-sm text-gray-300">
        
        <!-- Table Head (Sticky so it stays at the top when scrolling) -->
        <thead class="text-xs text-gray-400 uppercase bg-[#1e293b] sticky top-0 z-10 border-b border-gray-700/50">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" class="px-6 py-3 font-medium">
              <FlexRender 
                v-if="!header.isPlaceholder" 
                :render="header.column.columnDef.header" 
                :props="header.getContext()" 
              />
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Smooth transition list for new items -->
          <TransitionGroup name="list">
            <tr 
              v-for="row in table.getRowModel().rows" 
              :key="row.original.id"
              class="border-b border-gray-700/30 hover:bg-gray-800/50 transition-colors"
            >
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-6 py-3 whitespace-nowrap">
                
                <!-- Custom rendering for the Severity column to make it a badge -->
                <span v-if="cell.column.id === 'severity'" 
                      class="px-2.5 py-1 rounded-md text-xs font-bold border"
                      :class="getSeverityClass(cell.getValue() as string)">
                  {{ cell.getValue() }}
                </span>
                
                <!-- Standard text rendering for all other columns -->
                <span v-else class="font-mono text-[13px]">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </span>

              </td>
            </tr>
          </TransitionGroup>
        </tbody>
        
      </table>
      
      <!-- Empty State handling -->
      <div v-if="props.data.length === 0" class="flex items-center justify-center h-full text-gray-500 italic">
        Awaiting system events...
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Adds a smooth slide-in animation when a new log arrives */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Make the scrollbar look like a dark-mode terminal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}
</style>