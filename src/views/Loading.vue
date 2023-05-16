<template>
  <div class="flex items-center justify-center overflow-hidden">
    <v-progress-linear indeterminate color="gold" :height="12">
    </v-progress-linear>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getAllFocusLessons } from '../services/bjj_services/focusLessonService';
import { getHumanByID } from '../services/humanService';
import { useFocusLessonsStore } from "../store/focusLessons";
import { useSessionsStore } from "../store/sessions";
import { useUserStore } from "../store/user";

export default {
  name: "loading",
  setup() {
    const router = useRouter();
    const errorMsg = ref(null);
    const userLocal = JSON.parse(localStorage.getItem("BJJFocusUser"))
    const humanID = userLocal.human

    // Pinia
    const userStore = useUserStore()
    const focusStore = useFocusLessonsStore()
    const sessionsStore = useSessionsStore()
    userStore.setUserDataAndHumanID(userLocal)
    getHumanNameAndId(humanID)

    // Progress Bar
    const progress = ref(0);
    const buffer = ref(100);

    const fillProgress = () => {
      const interval = setInterval(() => {
        if (progress.value < 100) {
          progress.value++;
        } else {
          clearInterval(interval);
        }
      }, 10);
    };
    
    // Get human name and ID and set to Store @../../store/user
    async function getHumanNameAndId(humanID) {
        const res = await getHumanByID(humanID)
        userStore.setHumanName(res.name)
    }

    onBeforeMount(async() => {
      sessionsStore.getAndSetSessionsData(userStore.human.id)
      const allFocusLessons = await getAllFocusLessons()
      focusStore.setFocusLessons(allFocusLessons)
      focusStore.setTopics(focusStore.getTopic('current'), focusStore.getTopic('next'))
      fillProgress();
    })

    sessionsStore.getAndSetSessionsData(userStore.human.id)
    
    setTimeout(() => {
      if(userStore.user.role.student) router.push({ name: "StudentHome" })
      if(userStore.user.role.admin) router.push({ name: "Overview" })
    }, 2000);

    return {
      errorMsg,
      progress, buffer
    };
  },
};
</script>
