<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <StudentStats title="Focus Attendance Stats" />

    <div class="px-5 pt-10 pb-12 flex flex-col justify-center -mb-7 items-center">
      <span class="text-light-grey">
        Browse your past sessions, topics, and curriculum
      </span>
    </div>

    <SessionCalendar />
  </div>

</template>

<script>
import { ref } from "vue"; // inject is required for the emitter (EventBus)
import SessionCalendar from "../../components/SessionCalendar.vue";
import StudentStats from "../../components/StudentStats.vue";


export default {
  name: "studentCalendarView",
  components: {
    SessionCalendar,
    StudentStats
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
