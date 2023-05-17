<template>
  <Radar :data='props.chartData' :options='chartOptions' />
</template>

<script>
// Normal imports

// ChartJS stuff
import {
Chart as ChartJS,
Filler,
Legend,
LineElement,
PointElement,
RadialLinearScale,
Tooltip
} from 'chart.js';
import { ref } from 'vue';
import { Radar } from 'vue-chartjs';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export default {
name: 'RadarChart',
components: {
  Radar
},
props: {
  id: {
    type: String,
  },
  chartData: {
    type: Object
  }
},
setup(props) {
  const chartOptions = ref(null);
  const darkGrey = '#292c2d'
  const medGrey = '#4b5153'
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: { dataPoints: { display: false }}
    },
    scales: {
      r: {
        ticks: { display: false }, // Hides the number labels in the middle
        grid: { color: darkGrey},
        angleLines: { color: medGrey }
      }
    }
  }

  return {
    chartOptions, props
  };
}
};
</script>
