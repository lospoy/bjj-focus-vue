<template>
    <div class="flex flex-col px-2 bg-dark-grey rounded-md shadow-md justify-center mb-2 animate-fadeIn">
      
        <bar-chart
          :data="topicData"
          :dataset="{
            barThickness: 30,
            borderRadius: 3,
            borderWidth: 0,
            backgroundColor:'#ffcc41',
            colors:'#292c2d'
          }"
          :library="chartOptions"
        >
        </bar-chart>
        
    </div>
</template>

<script>
import { ref } from "vue";
import { useSessionsStore } from "../../store/sessions";

export default {
  name: "TopicsChart",
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  setup() {
    const topicData = ref(null);
    let delayed

    const chartOptions = {
      layout: {
        padding: {left: -10, right: 5, top: 0, bottom: 10},
      },
      scales: {
        x: {
          grid: {
            drawTicks: false,
            display: false
          },
          ticks: {
            display: false
          },
          border: {
            display:false
          }
        },
        y: {
          barPercentage: 1,
          grid: {
            drawTicks: false,
            display: false
          },
          ticks: {
            padding: 10,
            mirror: true,
            font: {
              size: 12,
              weight: 400,
              family: 'Kanit'
            },
            color: '#6d7679',
            z: 1
          },
          border: {
            display:false
          }
        },
      },
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 350 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
    }

    // Focus Lesson Ids
    const backControl = "63476ca77c0c4048382acb04"
    const halfGuard = "634ed31717260c95e351de8d"
    const sideControl = "634ed53c17260c95e351decb"
    const closedGuard = "634ed77517260c95e351dfa3"
    const mount = "634ecefa9f04894fb818c868"
    const deLaRiva = "634edb2337829d81a79048ab"
    const openGuard = "638eaab8964f267814d40a89"
    const turtle = "638ead84964f267814d40ad7"
    
    const getLessonName = id => {   // stored locally: 8 ids that will not change
      if(id === backControl) return 'Back Control'
      if(id === halfGuard) return 'Half Guard'
      if(id === sideControl) return 'Side Control'
      if(id === closedGuard) return 'Closed Guard'
      if(id === mount) return 'Mount'
      if(id === deLaRiva) return 'De La Riva'
      if(id === openGuard) return 'Open Guard'
      if(id === turtle) return 'Turtle'
    }

    const getLessonData = async() => {
      const sessions = useSessionsStore().sessions
      const sessionsPerTopic = sessions.perTopic

      sessionsPerTopic.find(e => e[0] === backControl) ? '' : sessionsPerTopic.push([backControl, 0])
      sessionsPerTopic.find(e => e[0] === halfGuard) ? '' : sessionsPerTopic.push([halfGuard, 0])
      sessionsPerTopic.find(e => e[0] === sideControl) ? '' : sessionsPerTopic.push([sideControl, 0])
      sessionsPerTopic.find(e => e[0] === closedGuard) ? '' : sessionsPerTopic.push([closedGuard, 0])
      sessionsPerTopic.find(e => e[0] === mount) ? '' : sessionsPerTopic.push([mount, 0])
      sessionsPerTopic.find(e => e[0] === deLaRiva) ? '' : sessionsPerTopic.push([deLaRiva, 0])
      sessionsPerTopic.find(e => e[0] === openGuard) ? '' : sessionsPerTopic.push([openGuard, 0])
      sessionsPerTopic.find(e => e[0] === turtle) ? '' : sessionsPerTopic.push([turtle, 0])

      const res = sessionsPerTopic.map(e => [getLessonName(e[0]), e[1]])
      topicData.value = res
    }
    
    setTimeout(() => {
      getLessonData()
    }, 50);

    return {
      topicData, chartOptions
    };
  }
};
</script>
