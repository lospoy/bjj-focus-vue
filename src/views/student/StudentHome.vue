<template>
  <div class="max-w-screen-sm mx-auto py-5 px-1 mt-20">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

  <template v-if="isLoading" class>
    <div class="flex flex-col rounded-md animate-pulse">
      <div class="flex flex-col w-full pl-7">
        <h3 class="text-6xl text-med-grey2">Loading...</h3>
      </div>

    </div>
  </template>
  <template v-else>
    <div class="flex flex-col rounded-md">
      <div class="flex flex-col w-full pl-7">
        <h3 class="text-6xl text-med-grey2">Hi, {{ humanName }}!</h3>
      </div>
      <PieChart />
    </div>
  </template>
  
  </div>
</template>

<script>
import { onBeforeMount, onMounted, ref } from "vue";
import PieChart from '../../components/PieChart.vue';
import StudentStats from '../../components/StudentStats.vue';
import ThisWeek from '../../components/ThisWeek.vue';
import { getAllFocusLessons } from '../../services/bjj_services/focusLessonService';
import { useFocusLessonsStore } from '../../store/focusLessons';
import { useSessionsStore } from "../../store/sessions";
import { useUserStore } from "../../store/user";

export default {
  name: "studentHome",
  components: {
    StudentStats,
    ThisWeek,
    PieChart
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const userStore = useUserStore()
    const humanName = ref('')
    const isLoading = ref(true)
  
    onBeforeMount(async() => {
      useSessionsStore().getAndSetSessionsData(userStore.human.id)
      const allFocusLessons = await getAllFocusLessons()
      useFocusLessonsStore().setFocusLessons(allFocusLessons)
    })

    onMounted(() => {
      // Skeleton while fetching data
      setTimeout(() => {
        humanName.value = userStore.human.name.first
        isLoading.value = false
      }, 2000)
    })
    
    return {
        errorMsg,
        humanName,
        isLoading
    };
  },
};
</script>
