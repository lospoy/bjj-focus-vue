<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-[5vh] animate-fadeIn">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div class="px-4">
    <Switcher
      class="flex justify-center max-w-screen-sm py-1 px-2"
      :titleLeft="'Topics'"
      :titleRight="'Skills'"
    />
    </div>

    <div :key="cardRerenderKey" v-if="topicsCard">
      <!-- TEXT ABOVE TOPICS CHART  -->
      <div class="px-5 pt-10 pb-12 bg-dark-grey rounded-md flex flex-col justify-center -mb-7">
        <div class="flex flex-col pl-4 px-6 w-full">
              <div class="flex flex-col mt-2 w-full">
                <ul class="space-y-1 ml-4 self-center">
                    <li class="text-light-grey font-normal">
                      You've been working on these Focus fundamentals. Make sure to maintain balance across all eight.
                    </li>
                </ul>
              </div>
        </div>
      </div>

    <TopicsChart :id='user.human'/>
    </div>

    <div :key="cardRerenderKey" v-if="skillsCard">
    <!-- TEXT ABOVE SKILLS CHART  -->
    <div class="px-5 pt-10 pb-12 bg-dark-grey rounded-md flex flex-col justify-center -mb-7">
      <div class="flex flex-col pl-4 px-6 w-full">
            <div class="flex flex-col mt-2 w-full">
              <ul class="space-y-1 ml-4 self-center">
                  <li class="text-light-grey font-normal">
                    Your BJJ Focus practice breaks down into these main skills. Escapes are the most important, regardless of level.
                  </li>
              </ul>
            </div>
      </div>
    </div>

    <RadarChart :id='user.human' :chartData='radarData'/>
    </div>

  </div>
</template>

<script>
import { inject, ref } from "vue"; // inject is required for the emitter (EventBus)
import RadarChart from '../../components/Charts/RadarChart.vue';
import SkillsChart from '../../components/Charts/SkillsChart.vue';
import TopicsChart from '../../components/Charts/TopicsChart.vue';
import Switcher from '../../components/Switcher.vue';
import { useFocusLessonsStore } from '../../store/focusLessons';
import { useSessionsStore } from '../../store/sessions';
import { useUserStore } from '../../store/user';

export default {
  name: "chartsView",
  components: {
    TopicsChart,
    SkillsChart,
    Switcher,
    RadarChart
  },
setup() {
    // Pinia
    const focusStore = useFocusLessonsStore()
    const sessions = useSessionsStore().sessions
    const studentName = useUserStore().human.name.first

    // Variables
    const errorMsg = ref(null);
    const user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    const gold = '#ffcc41'
    const goldLight = '#ffcc4130'

    const radarData = ref({
    labels: [
    'Escape',
    'Submission',
    'Sweep',
    'Pass',
    'Entry',
    'Takedown',     
    ],
    datasets: [
      {
        label: 'Focus',
        backgroundColor: 'rgba(179,181,198,0.2)',
        borderColor: 'rgba(179,181,198,.8)',
        pointBackgroundColor: 'rgba(179,181,198,.8)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,.8)',
        data: processSkillData(sessions.perTopic.levelOne)
      },
      {
        label: studentName,
        backgroundColor: goldLight,
        borderColor: gold,
        pointBackgroundColor: gold,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: gold,
        data: processSkillData(sessions.perTopic.attended)
      }
    ]
  })

  function processSkillData(sessionsArr) {
    const lessons = sessionsArr.map(e => ([focusStore.getLessonByID(e[0]), e[1]]))
    // ARRAY OF ARRAYS [object, integer]
    // Object: that lesson's object
    // Integer: number of attended sessions related to the lesson's object
    const skills = lessons.map(e => [e[0].skills, e[1]])
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
        return r + a[key] / 100
      }, 0)
    }

    // ARRAY of [ string, integer ]
    // String: skill name
    // Integer: total points acquired through all-time attendance
    return [
      count(sumOfSkills, 'escape'),
      count(sumOfSkills, 'submission'),
      count(sumOfSkills, 'sweep'),
      count(sumOfSkills, 'pass'),
      count(sumOfSkills, 'entry'),
      count(sumOfSkills, 'takedown'),
    ]
  }

  let btnTopicColor = ref(null)
  let btnSkillColor = ref(null)
  let btnTopicTitle = ref("Topics Balance")
  let btnSkillTitle = ref("Skill Growth")
  const cardRerenderKey = ref(0) // works alongside the listener/emitter
  const topicsCard = ref(true)
  const skillsCard = ref(null)
  const emitter = inject('emitter')
  emitter.on('switcherLeft', (value) => {
      topicsCard.value = true
      skillsCard.value = false
  })
  emitter.on('switcherRight', (value) => {
      topicsCard.value = false
      skillsCard.value = true
  })
  
  return {
      errorMsg, user,
      btnTopicColor, btnSkillColor, btnTopicTitle, btnSkillTitle,
      cardRerenderKey,
      topicsCard, skillsCard,
      radarData
  };
},
};
</script>
