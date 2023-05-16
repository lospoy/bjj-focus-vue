<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-[5vh] space-y-4">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <AttendanceStats title="Focus Attendance Stats" />
    <Calendar />
  </div>

</template>

<script>
import { ref } from "vue"; // inject is required for the emitter (EventBus)
import AttendanceStats from "../../components/AttendanceStats.vue";
import Calendar from "../../components/Calendar.vue";


export default {
  name: "studentCalendarView",
  components: {
    Calendar,
    AttendanceStats
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const user = JSON.parse(localStorage.getItem("BJJFocusUser"))
    
    return {
        errorMsg, user,
    };
  },
};
</script>
