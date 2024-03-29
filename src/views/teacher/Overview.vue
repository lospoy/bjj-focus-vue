<template>
  <div class="max-w-screen-sm mx-auto px-4 py-5">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Components (cards) -->
    <div class="rounded-md shadow-md">
      <ThisWeek />
    </div>
    <div v-if="loadComponent">
      <TopicsChart :id="humanID" />
      <SkillsChart :id="humanID" />
      <Calendar v-if="sessionData" />
      <AttendanceStats :id="humanID" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import AttendanceStats from '../../components/AttendanceStats.vue'
import Calendar from '../../components/Calendar.vue'
import SkillsChart from '../../components/Charts/SkillsChart.vue'
import TopicsChart from '../../components/Charts/TopicsChart.vue'
import ThisWeek from '../../components/ThisWeek.vue'
import { getAllFocusLessons } from '../../services/bjj_services/focusLessonService'
import {
  getAllActiveHumans,
  getAllHumans,
  getAllInactiveHumans
} from '../../services/humanService'
import { useFocusLessonsStore } from '../../store/focusLessons'
import { useHumanStore } from '../../store/humans'
import { useSessionsStore } from '../../store/sessions'
import { useUserStore } from '../../store/user'

export default {
  name: 'overview',
  components: {
    Calendar,
    AttendanceStats,
    ThisWeek,
    TopicsChart,
    SkillsChart
  },
  setup() {
    // Variables
    const errorMsg = ref(null)
    const humanName = ref(null)
    const userStore = useUserStore()
    const humanID = userStore.human.id
    const sessionData = ref(null)

    watch(
      () => useSessionsStore().sessions.weeksTrained,
      (sessionDataLoaded) => {
        sessionData.value = sessionDataLoaded
      }
    )

    onMounted(async () => {
      // SET DATA IN PINIA
      // Sessions data
      useSessionsStore().getAndSetSessionsData(humanID)
      // Humans data
      const allHumans = await getAllHumans()
      const activeHumans = await getAllActiveHumans()
      const inactiveHumans = await getAllInactiveHumans()
      useHumanStore().setAllHumans(allHumans)
      useHumanStore().setActiveHumans(activeHumans)
      useHumanStore().setInactiveHumans(inactiveHumans)
      // Focus Lesson data
      const allFocusLessons = await getAllFocusLessons()
      useFocusLessonsStore().setFocusLessons(allFocusLessons)

      // Set name on DOM
      humanName.value = userStore.human.name.first
      if (useSessionsStore().sessions.weeksTrained !== '')
        sessionData.value = true
    })

    // Component load delay
    // Giving 1 second to the Pinia store to set the data needed to load the components
    const loadComponent = ref(false)
    setTimeout(() => {
      loadComponent.value = true
    }, 1000)

    return {
      errorMsg,
      humanName,
      humanID,
      sessionData,
      loadComponent
    }
  }
}
</script>
