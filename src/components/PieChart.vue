<template>
  <Pie :data='chartData' :options='chartOptions' />
</template>

<script>
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { ref } from 'vue';
import { Pie } from 'vue-chartjs';
import { useFocusLessonsStore } from '../store/focusLessons';

ChartJS.register(ArcElement, Tooltip)

export default {
name: 'PieChart',
components: {
  Pie
},
props: {
  id: {
    type: String,
  }
},
setup() {
  // Pinia
  const lessons = useFocusLessonsStore().focusLessons

  // Chart
  const chartOptions = ref(null);
  const darkGrey = '#292c2d'
  const chartData = ref({
    labels: [
      // topicName1, topicName2, topicName3, topicName4,
      // topicName5, topicName6, topicName7, topicName8,
    ],
    datasets: [
      {
        data: [
          // int, int, int, int, int, int, int, int
        ],
        weight: '',
        backgroundColor: [
          // colorOut1, colorOut2, colorOut3, colorOut4,
          // colorOut5, colorOut6, colorOut7, colorOut8,
        ],
      },
      {
        data: [],
        weight: '',
        backgroundColor: [],
      },
      {
        data: [],
        weight: '',
        backgroundColor: [],
      },
    ]
  })

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        dataPoints: {display: false },
      }
    },
    borderWidth: 3, // animation could change border as it loads
    borderColor: darkGrey
  }

  // Example
  // modifyBackgroundColor(0, 0, "red");
  function modifyBgColor(datasetIndex, backgroundColorIndex, newBackgroundColor) {
    const dataset = chartData.value.datasets[datasetIndex];
    dataset.backgroundColor[backgroundColorIndex] = newBackgroundColor;
  }

  function createLabels() {
    const labels = lessons.map(topic => topic.name)
    return labels
  }

  function createBgColor(circlePosition, humanData) {

    const filledOuter1 = `rgb(179, 179, 179)`
    const filledOuter2 = `rgb(252, 252, 252)`
    const filledMid1 = `rgb(96, 37, 116)`
    const filledMid2 = `rgb(144, 56, 173)`
    const filledInner1 = `rgb(204, 187, 0)`
    const filledInner2 = `rgb(255, 240, 76)`
  }

  function createDataset(circlePosition) {
    const dataPoints = [2, 2, 2, 2, 2, 2, 2, 2]
    let chartWeight = 0
    let chartBgColor = []

    const emptyOuter1 = `rgb(179, 179, 179)`
    const emptyOuter2 = `rgb(252, 252, 252)`
    const emptyMid1 = `rgb(96, 37, 116)`
    const emptyMid2 = `rgb(144, 56, 173)`
    const emptyInner1 = `rgb(204, 187, 0)`
    const emptyInner2 = `rgb(255, 240, 76)`

    if (circlePosition === 'outer') {
      chartWeight = 1
      chartBgColor = [ emptyOuter1, emptyOuter2 ]
    }
    if (circlePosition === 'mid') {
      chartWeight = 2
      chartBgColor = [ emptyMid1, emptyMid2 ]
    }
    if (circlePosition === 'inner') {
      chartWeight = 4
      chartBgColor = [ emptyInner1, emptyInner2 ]
    }

    const datasetObj = {
      data: dataPoints,
      weight: chartWeight,
      backgroundColor: '#4b5153',
      borderColor: darkGrey
    }

    return datasetObj
  }

  chartData.value.labels = createLabels()

  chartData.value.datasets = [
    createDataset('outer', true),
    createDataset('mid'),
    createDataset('inner'),
  ]

  return {
    chartData, chartOptions
  };
}
};
</script>
