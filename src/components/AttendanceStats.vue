<template>
  <div
    class="p-5 bg-dark-grey flex flex-col justify-center rounded-md shadow-md items-center animate-fadeIn"
  >
    <div class="flex flex-row gap-x-4 items-center">
      <h3 v-if="userIsAdmin" class="text-2xl text-light-grey">{{ title }}</h3>
      <!-- COPY ID -->
      <v-btn
        v-if="userIsAdmin && titleIsSet"
        class="max-w-10 text-xs bg-med-grey max-h-5"
        compact
        @click="copyIDToClipboard"
      >
        Copy ID
      </v-btn>
    </div>

    <template v-if="isLoading">
      <div
        class="pl-2 px-24 rounded-md justify-center items-center animate-pulse"
      >
        <ul
          class="list-inside items-center text-light-grey text-sm space-y-0.5"
        >
          <li>You've attended...</li>
          <li>Your most recent session was...</li>
          <li>Your first session was on...</li>
          <li>You've been Focus training for...</li>
        </ul>
      </div>
    </template>

    <template v-else>
      <div class="pl-2 px-2">
        <ul
          class="list-inside justify-center text-light-grey text-sm space-y-0.5"
        >
          <li>You've attended {{ focusSessions }} Focus sessions 🥷</li>
          <li>Your most recent session was {{ latestSession }} days ago ⌛</li>
          <li>Your first session was on {{ firstSession }} 🗓️</li>
          <li>You've been Focus training for {{ totalTrained }}</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useSessionsStore } from '../store/sessions'
import { useUserStore } from '../store/user'
import { updateHuman } from '../services/humanService'

export default {
  name: 'AttendanceStats',
  props: {
    title: {
      type: String,
      required: false
    },
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    // PINIA
    const sessionsStore = useSessionsStore()
    const sessions = sessionsStore.sessions
    const userStore = useUserStore()
    const userIsAdmin = userStore.user.role.admin

    // Variables
    const errorMsg = ref(null)
    const focusSessions = ref(null)
    const totalTrained = ref(null)
    const firstSession = ref(null)
    const latestSession = ref(null)
    const humanID = ref(props.id)
    const titleIsSet = ref(props.title)
    const isLoading = ref(true)

    async function updateActiveStatus(humanID, newStatus) {
      try {
        await updateHuman(humanID, {
          trainingStatus: { active: newStatus }
        })
      } catch (error) {
        errorMsg.value = error.message
        setTimeout(() => {
          errorMsg.value = null
        }, 5000)
      }
      return
    }
    // In case we want to see data from other users, humanID can be passed as a prop
    // if humanID is passed:
    //    1. session data for that user is set in the session store
    //    2. updates active status (session attended <=30 days = active, inactive otherwise)

    // This solution is kind of jank but works for now and other features are higher priority
    //    ideally the active/inactive lists are updated either:
    //    1. after the teacher saves a session
    //    2. periodically in the backend
    function setAndDisplayStudentData(humanID) {
      let humanIsActive = null
      if (humanID) {
        sessionsStore.getAndSetSessionsData(humanID)
      }

      // giving the server time to come back with the data
      setTimeout(() => {
        humanIsActive = sessions.daysSinceLatest <= 20 ? true : false

        if (!humanIsActive) {
          updateActiveStatus(humanID, false)
          console.log('student updated to inactive')
        }
        if (humanIsActive) {
          updateActiveStatus(humanID, true)
          console.log('student updated to active')
        }

        latestSession.value = sessions.daysSinceLatest
        firstSession.value = new Date(sessions.first).toLocaleDateString()
        focusSessions.value = sessions.focus

        const weeksTrained = sessions.weeksTrained
        if (weeksTrained < 1) {
          totalTrained.value = 'Just Started!💪'
        } else if (weeksTrained >= 1 && weeksTrained < 8) {
          totalTrained.value = `${Math.floor(weeksTrained)} weeks🔥`
        } else if (weeksTrained >= 8 && weeksTrained < 52) {
          totalTrained.value = `${Math.floor(weeksTrained / 4)} months⚡`
        } else {
          totalTrained.value = `${(weeksTrained / 4 / 12).toFixed(2)} years⚡`
        }
      }, 500)
    }

    const copyIDToClipboard = () => {
      navigator.clipboard.writeText(humanID.value)
    }

    onMounted(() => {
      // Skeleton while fetching data
      setTimeout(() => {
        setAndDisplayStudentData(props.id)
        isLoading.value = false
      }, 70)
    })

    return {
      errorMsg,
      isLoading,
      totalTrained,
      firstSession,
      latestSession,
      focusSessions,
      // COPY ID
      humanID,
      copyIDToClipboard,
      userIsAdmin,
      titleIsSet
    }
  }
}
</script>
