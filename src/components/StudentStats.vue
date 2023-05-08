<template>
    <!-- MY STATS -->
    <div class="p-5 bg-dark-grey flex flex-col justify-center">

      <div class="flex flex-row gap-x-4 items-center">
        <h3 class="text-2xl text-light-grey">{{ title }}</h3>
        <v-btn v-if="userIsAdmin && titleIsSet" class="max-w-10 text-xs bg-med-grey max-h-5" compact @click="copyIDToClipboard">Copy ID</v-btn>
      </div>
      <div class="pl-2 px-2 animate-pulse" v-if="skeleton">
            <ul class="list-inside justify-center">
                <li class="text-sm text-light-grey font-normal">You've attended {{ focusSessions }} Focus sessions.</li>
                <li class="text-sm text-light-grey font-normal">Your most recent session was {{ latestSession }}.</li>
                <li class="text-sm text-light-grey font-normal">Your first session was on {{ firstSession }}.</li>
                <li class="text-sm text-light-grey font-normal">You've been doing Focus training for {{ totalTrained }}</li>
            </ul>
      </div>
      <div class="pl-2 px-2" v-if="stats">
            <ul class="list-inside justify-center">
                <li class="text-sm text-light-grey font-normal">You've attended {{ focusSessions }} Focus sessions.</li>
                <li class="text-sm text-light-grey font-normal">Your most recent session was {{ latestSession }}.</li>
                <li class="text-sm text-light-grey font-normal">Your first session was on {{ firstSession }}.</li>
                <li class="text-sm text-light-grey font-normal">You've been Focus training for {{ totalTrained }}</li>
            </ul>
      </div>

    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useSessionsStore } from "../store/sessions";

export default {
name: "StudentStats",
props: {
  title: {
      type: String,
      required: false,
    },
  id: {
    type: String,
    required: false,
  }
},
setup(props) {
  // Variables
  const errorMsg = ref(null);
  const focusSessions = ref(null)
  const totalTrained = ref(null)
  const firstSession = ref(null)
  const latestSession = ref(null)
  const skeleton = ref(null)  // v-if
  const stats = ref(null) // v-if
  const delay = 1000  // ms delay for skeletonService
  const sessionsStore = useSessionsStore()
  const studentID = ref(props.id)
  const userIsAdmin = JSON.parse(localStorage.getItem("BJJFocusUser")).role.admin
  const titleIsSet = ref(props.title)

  const skeletonService = _ => {
    skeleton.value = true
    stats.value = false
    setTimeout(() => {
      skeleton.value = false
      stats.value = true
    }, delay);
  }

  const displayStudentData = async(humanID) => {
    latestSession.value = '...'
    firstSession.value = '...'
    totalTrained.value = '...'
    focusSessions.value = "..."

    if(humanID) { // in case we want to see data from other users, can be passed as a prop
      sessionsStore.getAndSetSessionsData(humanID)
    }
    const sessions = sessionsStore.sessions

    setTimeout(() => {
      latestSession.value = `${sessions.daysSinceLatest} days ago`
      firstSession.value = new Date(sessions.first).toLocaleDateString()
      focusSessions.value = sessions.focus
      const weeksTrained = sessions.weeksTrained
      if (weeksTrained < 1) {
          totalTrained.value = "Just Started!💪"
      } else if (weeksTrained >= 1 && weeksTrained < 8) {
          totalTrained.value = `${Math.floor(weeksTrained)} weeks🔥`
      } else if (weeksTrained >= 8 && weeksTrained < 52) {
          totalTrained.value = `${Math.floor(weeksTrained/4)} months⚡`
      } else {
          totalTrained.value = `${(weeksTrained/4/12).toFixed(2)} years⚡`
      }    
    }, delay);
  }

  const copyIDToClipboard = () => {
    navigator.clipboard.writeText(studentID.value);
  };

  onMounted(() => {
    skeletonService()
    displayStudentData(props.id)
  })

  return {
      errorMsg,
      skeleton, stats,
      totalTrained, firstSession, latestSession, focusSessions,
      // COPY ID
      studentID, copyIDToClipboard, userIsAdmin, titleIsSet
  };
},
};
</script>
