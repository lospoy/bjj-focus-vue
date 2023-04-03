<template>
  <div class="max-w-screen-sm mx-auto px-4 py-5">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Hi, {humanName}! -->
    <div class="px-5 py-2">
        <span class="flex text-xl text-white -mb-1">Hi, {{ humanName }}!</span>
    </div>

    <!-- Components (cards) -->
    
      <ThisWeek />
      <TopicsChart :id='humanID' />
      <SkillsChart :id='humanID' />
      <SessionCalendar v-if="sessionData" />
      <StudentStats :id='humanID' />
    

  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import SessionCalendar from "../../components/SessionCalendar.vue";
import SkillsChart from '../../components/SkillsChart.vue';
import StudentStats from "../../components/StudentStats.vue";
import ThisWeek from '../../components/ThisWeek.vue';
import TopicsChart from '../../components/TopicsChart.vue';
import { getAllHumans } from '../../services/humanService';
import { useHumanStore } from '../../store/humans';
import { useSessionsStore } from '../../store/sessions';
import { useUserStore } from '../../store/user';

export default {
  name: "overview",
  components: {
    SessionCalendar,
    StudentStats,
    ThisWeek,
    TopicsChart,
    SkillsChart
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const humanName = ref(null)
    const userStore = useUserStore()
    const humanID = userStore.human.id
    const sessionData = ref(null)

    watch(() => useSessionsStore().sessions.weeksTrained, sessionDataLoaded => {
      sessionData.value = sessionDataLoaded;
    });

    onMounted(async() => {
      // Set user data in Pinia
      useSessionsStore().getAndSetSessionsData(humanID)

      // Set AllHumans in Pinia
      const allHumans = await getAllHumans()
      useHumanStore().setAllHumans(allHumans)
      
      // Set name on DOM
      humanName.value = userStore.human.name.first
      if (useSessionsStore().sessions.weeksTrained !== "") sessionData.value = true
    })
    
    return {
        errorMsg,
        humanName, humanID,
        sessionData
    };
  },
};
</script>
