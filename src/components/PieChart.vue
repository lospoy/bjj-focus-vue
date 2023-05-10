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

  // Topics
  // const backControl = lessons.topic1.name
  // const halfGuard = lessons.topic2.name
  // const closedGuard = lessons.topic3.name
  // const DLR = lessons.topic4.name
  // const openGuard = lessons.topic5.name
  // const sideControl = lessons.topic6.name
  // const mount = lessons.topic7.name
  // const turtle = lessons.topic8.name

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        dataPoints: {display: false },
      }
    },
    borderWidth: 10,
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

  function createDataset(circlePosition, fill) {
    const dataPoints = [2, 2, 2, 2, 2, 2, 2, 2]
    let chartWeight = 0
    let chartBgColor = []
    let opacity = 0

    fill ? opacity = 100 : opacity = 50

    const outerColor1 = `rgba(179, 179, 179, ${opacity}`
    const outerColor2 = `rgba(252, 252, 252, ${opacity}`
    const midColor1 = `rgba(96, 37, 116, ${opacity}`
    const midColor2 = `rgba(144, 56, 173, ${opacity}`
    const innerColor1 = `rgba(204, 187, 0, ${opacity}`
    const innerColor2 = `rgba(255, 240, 76, ${opacity}`

    if (circlePosition === 'outer') {
      chartWeight = 1
      chartBgColor = [
        outerColor1, outerColor2, outerColor1, outerColor2,
        outerColor1, outerColor2, outerColor1, outerColor2,
      ]
    }
    if (circlePosition === 'mid') {
      chartWeight = 2
      chartBgColor = [
        midColor1, midColor2, midColor1, midColor2,
        midColor1, midColor2, midColor1, midColor2,
      ]
    }
    if (circlePosition === 'inner') {
      chartWeight = 4
      chartBgColor = [
        innerColor1, innerColor2, innerColor1, innerColor2,
        innerColor1, innerColor2, innerColor1, innerColor2,
      ]
    }

    const datasetObj = {
      data: dataPoints,
      weight: chartWeight,
      backgroundColor: chartBgColor
    }

    return datasetObj
  }

  chartData.value.labels = createLabels()

  chartData.value.datasets = [
    createDataset('outer'),
    createDataset('mid'),
    createDataset('inner'),
  ]

  console.log(chartData.value)

  return {
    chartData, chartOptions
  };
}
};
</script>
