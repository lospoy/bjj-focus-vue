<template>
    <div class="flex flex-col px-2 bg-dark-grey rounded-md shadow-md justify-center mb-2 animate-fadeIn">

          <bar-chart
            :data="skillData"
            :dataset="{
              barThickness: 40,
              borderRadius: 5,
              borderWidth: 0,
              backgroundColor:'#B130D990'
            }"
            :library="chartOptions"
          >
          </bar-chart>

    </div>
</template>

<script>
import { ref } from "vue";
import { useFocusLessonsStore } from '../../store/focusLessons';
import { useSessionsStore } from "../../store/sessions";

export default {
  name: "SkillsChart",
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  setup() {
    // Pinia 
    const focusStore = useFocusLessonsStore()

    // Chart
    const skillData = ref(null);
    const test1 = ref(null)
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
            display: false,
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
            color: '#f7f7f7',
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

    // technique.move.category types
    //
    // pass
    // entry
    // escape
    // submission
    // sweep
    // takedown

    function processSkillData() {
        const sessions = useSessionsStore().sessions
        const sessionsAttendedPerTopic = sessions.perTopic.attended
        // ARRAY OF ARRAYS [string, integer]
        // String: that Focus lesson's ID
        // Integer: number of attended sessions that match the string's topic ID

        const lessons = sessionsAttendedPerTopic.map( e => ([focusStore.getLessonByID(e[0]), e[1]]))
        // ARRAY OF ARRAYS [object, integer]
        // Object: that lesson's object
        // Integer: number of attended sessions related to the lesson's object

        const les = [...lessons] // hard copy of lessons

        const skills = les.map(e => [e[0].skills, e[1]])
        // ARRAY OF [ object, integer ]
        // Object: Skills object of the lesson
        // Integer: number of attended sessions related to the skills object

        const multiplier = (obj, multiplier) => Object.fromEntries(
          Object.entries(obj).map(([name, value]) => [name, value * multiplier])
        )
        const sumOfSkills = skills.map(e => multiplier(e[0], e[1]))
        // ARRAY OF [ object ]
        // Object: skills values multiplied by number of attended lessons of that topic

        const count = (arr, key) => {
          return arr.reduce((r, a) => {
            return r + a[key] / 16
          }, 0)
        }
        // dividing by 16 in combination with max X axis ticks of 100
        // (100 being completion of curriculum in 6 months of perfect attendance)

        skillData.value = [
          ["Pass", count(sumOfSkills, 'pass')],
          ["Entry", count(sumOfSkills, 'entry')],
          ["Escape", count(sumOfSkills, 'escape')],
          ["Submission", count(sumOfSkills, 'submission')],
          ["Sweep", count(sumOfSkills, 'sweep')],
          ["Takedown", count(sumOfSkills, 'takedown')]
        ]
        // ARRAY of [ string, integer ]
        // String: skill name
        // Integer: total points acquired through all-time attendance

        skillData.value = skillData.value.sort((a, b) => b[1] - a[1])
        // SORTS in descending order, from highest to least exposure
    }
    
    setTimeout(() => {
      processSkillData()
    }, 50);

    return {
      skillData, chartOptions, test1
    };
  }
};
</script>
