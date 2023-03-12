<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-10">
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
                    <li class="text-light-grey text-sm font-normal">
                      How balanced is your game?
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
                  <li class="text-light-grey text-sm font-normal">
                    How much have you practiced these skills?
                  </li>
              </ul>
            </div>
      </div>
    </div>

    <SkillsChart :id='user.human'/>
    </div>

  </div>
</template>

<script>
import { ref, inject } from "vue"; // inject is required for the emitter (EventBus)
import TopicsChart from '../../components/TopicsChart.vue';
import SkillsChart from '../../components/SkillsChart.vue';
import Switcher from '../../components/Switcher.vue';


export default {
  name: "charts",
  components: {
    TopicsChart,
    SkillsChart,
    Switcher
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const user = JSON.parse(localStorage.getItem("BJJFocusUser"))
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
        topicsCard, skillsCard
    };
  },
};
</script>
