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
    <TopicsChart :id='user.human'/>
    <SkillsChart :id='user.human'/>
    <SessionCalendar />
    <StudentStats :id='user.human' v-if="user" :title="'My Stats'" />

  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import SessionCalendar from "../../components/SessionCalendar.vue";
import SkillsChart from '../../components/SkillsChart.vue';
import StudentStats from "../../components/StudentStats.vue";
import ThisWeek from '../../components/ThisWeek.vue';
import TopicsChart from '../../components/TopicsChart.vue';
import { getHuman } from "../../services/humanService";

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
    const user = JSON.parse(localStorage.getItem("BJJFocusUser"))
    const humanName = ref(null)
    const isAdmin = ref(null)
    const isStudent = ref(null)
    isAdmin.value = user.role.admin
    isStudent.value = user.role.student

    const getHumanNameAndId = async () => {
        const res = await getHuman(user.human)
        humanName.value = res.name.first
    }

    function loadBottomNav(){
      let refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken !== '1') {
        location.reload()
        localStorage.setItem('refreshToken', '1')
      }
    }

    onMounted(() => {
      getHumanNameAndId()
      loadBottomNav()
    })
    
    return {
        errorMsg,
        // STATS
        humanName, user,
        // PERMISSIONS
        isAdmin, isStudent
    };
  },
};
</script>
