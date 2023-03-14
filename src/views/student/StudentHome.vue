<template>
  <div class="max-w-screen-sm mx-auto py-5 px-1 mt-20">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div class="flex flex-col rounded-md -space-y-3">
      <div class="flex flex-col w-full pl-7 py-10">
        <h3 class="text-base text-med-grey2">Hi, {{ humanName }}!</h3>
      </div>
      <StudentStats />
      <ThisWeek />
    </div>

    <!-- BETA NOTE -->
    <div class="flex flex-col pl-7 px-10 w-full mt-28">
      <div class="flex flex-col mt-2 w-full">
        <ul class="space-y-1 self-center">
            <li class="text-med-grey2 text-xs font-normal">
              This is a closed beta - some things might be slow (or broken). Please share your feedback! Thanks and see you in class.
            </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import StudentStats from '../../components/StudentStats.vue';
import ThisWeek from '../../components/ThisWeek.vue';
import { useSessionsStore } from "../../store/sessions";
import { useUserStore } from "../../store/user";

export default {
  name: "studentHome",
  components: {
    StudentStats,
    ThisWeek
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const userStore = useUserStore()
    const humanName = ref(null)
    
    function checkHumanName() {
      if(userStore.human.name === "") {
        getHumanNameAndId()
      }
      humanName.value = userStore.human.name.first
    }
    checkHumanName()

    // Fetches updated session data every time the user visits the student/home route
    // Ideally session data would be semi-persistent:
    //   session data fetched either on login or in student/home,
    //   but only if it has not been fetched within the last 30 min
    const humanID = userStore.human.id
    useSessionsStore().getAndSetSessionsData(humanID)
    
    return {
        errorMsg,
        humanName,
    };
  },
};
</script>
