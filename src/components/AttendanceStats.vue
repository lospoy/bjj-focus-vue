<template>
  <div
    class="p-5 bg-dark-grey flex flex-col justify-center rounded-md shadow-md items-center animate-fadeIn"
  >
    <div class="flex flex-row gap-x-4 items-center">
      <h3 v-if="userIsAdmin" class="text-3xl text-light-grey">{{ title }}</h3>
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

    <template v-if="!isLoading && !userIsAdmin">
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

    <template v-if="!isLoading && userIsAdmin">
      <div class="flex space-x-6 p-2">
        <!-- BUTTON: COPY ID -->
        <v-btn
          v-if="userIsAdmin && titleIsSet"
          class="text-xs bg-med-grey max-h-6"
          compact
          @click="copyIDToClipboard"
        >
          Copy ID
        </v-btn>

        <!-- BUTTON: EDIT  -->
        <v-btn
          v-if="userIsAdmin && titleIsSet"
          class="text-xs bg-med-grey max-h-6"
          @click="toggleExtendStats"
          @keydown.space.prevent="toggleExtendStats"
        >
          <v-icon class="text-md">mdi-pencil-outline</v-icon>
        </v-btn>
      </div>

      <!-- STATS: BASIC INFO -->
      <div
        v-if="!extendToggled"
        class="mt-1.5 px-2 space-x-9 text-sm text-light-grey"
      >
        {{ getBeltData(humanID) }}
        <div class="flex space-x-6">
          <ul class="flex flex-col space-y-0.5">
            <li>Latest session</li>
            <li>Attended</li>
          </ul>
          <ul class="flex flex-col space-y-0.5">
            <li>{{ latestSession }} days ago ⌛</li>
            <li>{{ focusSessions }} focus sessions</li>
          </ul>
        </div>
      </div>

      <!-- STATS: EXTENDED INFO -->
      <div v-if="extendToggled" class="mt-1.5 px-12 text-sm text-light-grey">
        <div class="flex space-x-6">
          <ul class="flex flex-col space-y-0.5">
            <li>Latest session</li>
            <li>Attended</li>
            <li>Focus training</li>
            <li>Total trained</li>
            <li>Joined focus on</li>
          </ul>
          <ul class="flex flex-col space-y-0.5">
            <li>{{ latestSession }} days ago ⌛</li>
            <li>{{ focusSessions }} focus sessions</li>
            <li>{{ totalTrained }}</li>
            <li>{{ totalTrained }}</li>
            <li>{{ firstSession }}</li>
          </ul>
        </div>

        <!-- BELT HISTORY -->
        <div class="mt-3">
          <ul v-for="(belt, index) in beltHistory" :key="index" class="flex">
            <li class="flex-1">
              {{ Object.keys(belt.color)[0] }}
            </li>
            <li v-if="belt.stripes" class="flex-1">
              {{ Object.keys(belt.stripes)[0] }}
            </li>
            <li class="flex-1">
              {{ belt.dateAwarded }}
            </li>
          </ul>
        </div>

        <!-- UPDATE BELT FORM -->
        <form
          @submit.prevent="beltToAPI"
          class="flex flex-col text-sm gap-y-1 w-full mt-4 text-light-grey"
        >
          <!-- BELT -->
          <div class="flex flex-col">
            <select
              required
              class="p-2 focus:outline-transparent bg-med-grey rounded-sm"
              id="belt"
              v-model="selectedBelt"
            >
              <option :value="white">white</option>
              <option :value="blue">blue</option>
              <option :value="purple">purple</option>
              <option :value="brown">brown</option>
              <option :value="black">black</option>
            </select>
          </div>

          <!-- STRIPES -->
          <div class="flex flex-col">
            <select
              class="p-2 focus:outline-transparent bg-med-grey rounded-sm"
              id="stripes"
              v-model="selectedStripes"
            >
              <option :value="one">one</option>
              <option :value="two">two</option>
              <option :value="three">three</option>
              <option :value="four">four</option>
            </select>
          </div>

          <!-- DATE -->
          <div class="flex flex-col -mb-4">
            <input
              type="date"
              class="p-2 focus:outline-transparent bg-med-grey rounded-sm"
              id="date"
              v-model="selectedDate"
            />
          </div>

          <Button :title="buttonTitle" :color="buttonColor" />
        </form>
      </div>
    </template>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useSessionsStore } from '../store/sessions'
import { useUserStore } from '../store/user'
import { useHumanStore } from '../store/humans'
import { getHumanByID, updateHuman } from '../services/humanService'
import Button from '../components/Button.vue'

export default {
  name: 'AttendanceStats',
  components: {
    Button
  },
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
    const allHumans = useHumanStore().allHumans
    const userIsAdmin = useUserStore().user.role.admin

    // Variables
    const errorMsg = ref(null)
    const isLoading = ref(true)
    const humanID = ref(props.id)
    const titleIsSet = ref(props.title)
    // STATS
    const focusSessions = ref(null)
    const totalTrained = ref(null)
    const firstSession = ref(null)
    const latestSession = ref(null)
    const extendToggled = ref(false)

    // BELT
    const beltHistory = ref([])
    const selectedBelt = ref(null)
    const selectedStripes = ref(null)
    const selectedDate = ref(null)

    const white = { white: true }
    const blue = { blue: true }
    const purple = { purple: true }
    const brown = { brown: true }
    const black = { black: true }

    const one = { one: true }
    const two = { two: true }
    const three = { three: true }
    const four = { four: true }

    // UPDATE BELT -> update human object and send PUT call to API
    // @'../../services/humanService'
    // PUT to api/human/:id
    async function beltToAPI() {
      try {
        const res = await updateHuman(humanID.value, {
          trainingData: {
            status: { active: true },
            belt: {
              history: [
                ...beltHistory.value,
                {
                  dateAwarded: selectedDate.value,
                  color: selectedBelt.value,
                  stripes: selectedStripes.value
                }
              ]
            }
          }
        })
        if (res.status === 200) {
          await buttonSuccess()
        } else {
          console.log('did not work')
        } // Success button visual feedback
      } catch (error) {
        errorMsg.value = error.message
        setTimeout(() => {
          errorMsg.value = null
        }, 5000)
      }
    }

    async function updateActiveStatus(humanID, newStatus) {
      const human = await getHumanByID(humanID)
      const updatedHuman = {
        ...human,
        trainingData: {
          ...human.trainingData,
          status: {
            active: newStatus
          }
        }
      }

      try {
        await updateHuman(humanID, updatedHuman)
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
          console.log('student status updated to inactive')
        }
        if (humanIsActive) {
          updateActiveStatus(humanID, true)
          console.log('student status updated to active')
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

    function toggleExtendStats() {
      extendToggled.value = !extendToggled.value
    }

    function getBeltData(id) {
      const thisHuman = allHumans.find((human) => human._id === id)
      if (thisHuman.trainingData?.belt) {
        const beltData = thisHuman.trainingData.belt
        beltHistory.value = beltData.history.sort((a, b) =>
          b.dateAwarded.localeCompare(a.dateAwarded)
        )
      }
    }

    // BUTTON success visual feedback
    let buttonColor = ref(null)
    let buttonTitle = ref('Save')
    const buttonSuccess = async () => {
      buttonTitle.value = 'Saving Promotion...'
      buttonColor.value = 'orange'
      setTimeout(() => {
        buttonTitle.value = 'Promotion Saved'
        buttonColor.value = '#33872a'
      }, 900)
      setTimeout(() => {
        buttonTitle.value = 'Save'
        buttonColor.value = ''
      }, 2500)
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
      titleIsSet,
      // BELT
      extendToggled,
      toggleExtendStats,
      beltHistory,
      getBeltData,
      beltToAPI,
      // Button
      buttonColor,
      buttonTitle,
      buttonSuccess,
      // BELT OPTIONS
      white,
      blue,
      purple,
      brown,
      black,
      one,
      two,
      three,
      four,
      selectedBelt,
      selectedStripes,
      selectedDate
    }
  }
}
</script>
