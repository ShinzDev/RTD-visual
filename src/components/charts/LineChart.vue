<!-- src/components/charts/LineChart.vue -->
<script setup lang="ts">
import { computed, provide } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import type { MetricPoint } from '../../models/telemetry';

// 1. Register only the ECharts modules we actually need
use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  GridComponent,
]);

// 2. Force ECharts into Dark Mode to match our Tailwind theme
provide(THEME_KEY, 'dark');

// 3. Define our strict component contract (Props)
const props = defineProps<{
  title: string;
  color: string;
  data: MetricPoint[];
}>();

// 4. The ECharts Configuration Object
const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent', // Let Tailwind control the card background
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        // Format the tooltip to look clean
        const date = new Date(params[0].value[0]).toLocaleTimeString();
        return `${date} <br/> <span style="color:${props.color}; font-weight:bold">${params[0].value[1]}</span>`;
      }
    },
    grid: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      splitLine: { show: false }, // Hide vertical grid lines for a cleaner look
      axisLabel: {
        color: '#9ca3af', 
        hideOverlap: true,
        formatter: (value: number) => {
           return new Date(value).toLocaleTimeString([], { hour12: false });
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: '#374151', type: 'dashed' } // Tailwind border-gray-700
      },
      axisLabel: { color: '#9ca3af' }
    },
    series: [
      {
        name: props.title,
        type: 'line',
        showSymbol: false, // Hide the dots on the line for a smooth "cyber" look
        animation: false, // CRITICAL: Turn off animation so real-time streaming doesn't "lag" or bounce
        lineStyle: {
          width: 3,
          color: props.color
        },
        areaStyle: {
          // Creates that beautiful glowing gradient under the line
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: props.color },
              { offset: 1, color: 'transparent' }
            ]
          },
          opacity: 0.2
        },
        // Transform our { timestamp, value } objects into ECharts [x, y] format
        data: props.data.map(item => [item.timestamp, item.value])
      }
    ]
  };
});
</script>

<template>
  <!-- The wrapper must have a defined height, or ECharts will collapse to 0px -->
  <div class="h-64 w-full mt-4">
    <VChart :option="chartOption" autoresize />
  </div>
</template>