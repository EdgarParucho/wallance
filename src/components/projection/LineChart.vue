<template>
  <div>
    <Line id="line-chart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, LineElement, PointElement);

const props = defineProps({
  chartData: {
    type: Object,
    required:  true,
  }
})

const colors = [
  "#d946ef", // fuchsia 
  "#6366f1", // indigo
  "#60a5fa", // blue
  "#38bdf8", // sky
  "#e879f9", // fuchsia
  "#f472b6", // pink
  "#fb7185", // rose
  "#fecaca", // red
  "#2dd4bf", "#ddd6fe", "#a78bfa", "#8b5cf6", // violet 
  "#c084fc", // purple
  "#a855f7", // purple
];

const chartData = computed(() => {
  return {
    labels: props.chartData.dates,
    datasets: props.chartData.datasets,
  }
});

const chartOptions = {
  borderColor: colors,
}
</script>
