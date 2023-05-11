<template>
  <div class="max-w-screen-md mx-auto px-4 py-10">
    <!-- Status Message -->
    <div
      v-if="statusMsg || errorMsg"
      class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
    >
      <p class="text-at-light-orange">{{ statusMsg }}</p>
      <p class="text-red-500 shadow-lg">{{ errorMsg }}</p>
    </div>

    <!-- DATE, TEACHER, TOPIC FORM -->
    <div class="p-8 flex items-start bg-dark-grey rounded-md shadow-lg">
      <form class="flex flex-col gap-y-4 w-full">
        <h1 class="text-3xl text-light-grey self-center">Save Session</h1>

          <!-- DATE -->
          <div class="flex flex-col">
            <label for="date" class="text-sm text-light-grey">
              Date
            </label>
            <input
              type="date"
              class="p-2 text-gray-100 focus:outline-transparent bg-med-grey rounded-sm"
              id="date"
              v-model="date"
            />
          </div>

          <!-- TEACHER -->
          <div class="flex flex-col">
            <label for="teacher" class="text-sm text-light-grey">
              Teacher
            </label>
            <select
              required
              class="p-2 text-gray-100 focus:outline-transparent bg-med-grey rounded-sm"
              id="teacher"
              v-model="teacher"
            >
            <option :value="teacher">Carlos Campoy</option>
            </select>
          </div>

          <!-- TOPIC -->
          <div class="flex flex-col">
            <label for="topic" class="text-sm text-light-grey">
              Topic
            </label>
            <select
              class="p-2 text-gray-100 focus:outline-transparent bg-med-grey rounded-sm"
              id="topic"
              v-model="topic"
            >
              <option :value="backControl">Back Control</option>
              <option :value="halfGuard">Half Guard</option>
              <option :value="closedGuard">Closed Guard</option>
              <option :value="deLaRiva">De La Riva</option>
              <option :value="openGuard">Open Guard</option>
              <option :value="sideControl">Side Control</option>
              <option :value="mount">Mount</option>
              <option :value="turtle">Turtle</option>
            </select>
          </div>
        </form>
    </div>

    <!-- ATTENDANCE LIST -->
    <div class="p-4 bg-dark-grey rounded-md shadow-lg flex flex-col justify-center mt-4">
      <Switcher
          class="flex justify-center max-w-screen-sm py-1 px-2 mb-4"
          :titleLeft="'Active'"
          :titleRight="'Inactive'"
        />
      <div class="mb-2 self-center">
        <span class="text-2xl flex text-m text-light-grey">Attendance - {{humanIdList.length -1}}</span>
      </div>
      <form
        @submit.prevent="sessionToAPI"
        class="flex flex-col gap-y-2 w-full items-center"
      >

          <!-- LEFT NAME LIST -->
          <div :key="cardRerenderKey" v-if="activeCard" class="items-center text-light-grey text-md">
            <MultiCheckbox
              v-model:value="humanIdList"
              :options="activeAttendanceList"
            />
          </div>
          <!-- RIGHT NAME LIST -->
          <div :key="cardRerenderKey" v-if="inactiveCard" class="items-center text-light-grey text-md">
            <MultiCheckbox
              v-model:value="humanIdList"
              :options="inactiveAttendanceList"
            />
          </div>
        
        <Button :title='buttonTitle' :color='buttonColor' />
      </form>
    </div>

    <!-- LATEST SESSION SAVED -->
    <div class="p-5 bg-dark-grey rounded-md shadow-lg flex flex-col justify-center mt-4">
      <div class="mb-2 self-center">
        <span class="text-2xl flex text-m text-light-grey">Latest Session</span>
      </div>
      <div class="flex pl-4 px-6 justify-center">
        <ul class="list-inside space-y-1 justify-center">
          <li class="text-l text-light-grey -mb-1">📅 {{ latestSessionSavedDate }}</li>
          <li class="text-l text-light-grey">📝 {{ latestSessionSavedTopic }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { inject, onMounted, ref, toRaw } from 'vue'
import Switcher from '../../components/Switcher.vue'
import { saveSession } from '../../services/sessionService'
import { useFocusLessonsStore } from "../../store/focusLessons"
import { useHumanStore } from "../../store/humans"
import { useSessionsStore } from "../../store/sessions"

// components import
import Button from "../../components/Button.vue"
import MultiCheckbox from "../../components/Multi-checkbox.vue"

export default {
name: 'session',
components: {
  Button,
  MultiCheckbox,
  Switcher
},
setup() {
  const statusMsg = ref(null)
  const errorMsg = ref(null)

  // Pinia Store
  const activeHumans = useHumanStore().activeHumans
  const inactiveHumans = useHumanStore().inactiveHumans
  const sessionStore = useSessionsStore()
  const focusLessonStore = useFocusLessonsStore()

  // Focus Lesson IDs
  const backControl = "63476ca77c0c4048382acb04"
  const mount = "634ecefa9f04894fb818c868"
  const halfGuard = "634ed31717260c95e351de8d"
  const sideControl = "634ed53c17260c95e351decb"
  const closedGuard = "634ed77517260c95e351dfa3"
  const deLaRiva = "634edb2337829d81a79048ab"
  const openGuard = "638eaab8964f267814d40a89"
  const turtle = "638ead84964f267814d40ad7"

  // TEACHER
  const teacher = ref(null)
  const carlosCampoyID = '630e5c2da1c2a0bcf246c383'
  teacher.value = carlosCampoyID
  const carlosIdObject = {"id": "630e5c2da1c2a0bcf246c383"}

  // TOPIC
  // This week's topic is being set by loading the ThisWeek component
  // ThisWeek component is being loaded in the home page for students and admin/teacher
  const topic = ref(null)
  const thisWeeksTopicID = focusLessonStore.topics.thisWeek.id
  topic.value = thisWeeksTopicID

  // SESSION & ATTENDANCE RELATED
  const latestSessionSavedDate = ref(null)
  const latestSessionSavedTopic = ref(null)
  const student = ref(null)
  const date = ref(null)
  const humanIdList = ref([carlosIdObject])// used in multicheckbox, has Carlos Campoy as default value to keep track of classes (teacher always attends)
  const activeAttendanceList = ref([])    // used in multicheckbox
  const inactiveAttendanceList = ref([])  // used in multicheckbox

  // SAVE SESSION -> update attendance object and POST to API
  // @'../../services/sessionService'
  // POST to api/sessions
  const sessionToAPI = async () => {
    try {
      const res = await saveSession({
        when: {
          date: getDate()
        },
        who: {
          teacher: { _id: teacher.value },
          // creates array with '_id' as key and human id string as value
          students: humanIdList.value.reduce((s, a) => {
            s.push({_id: a.id})
            return s
          }, [])
        },
        what: {
          focus: { _id: topic.value }
        }
      });
        if(res.status === 201) { await buttonSuccess() } // Success button visual feedback
    } catch (error) {
      errorMsg.value = error.message;
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    }
  }

  // ATTENDANCE ARRAY GENERATOR
  async function createAttendanceArray(humanArray) {
    const ids = humanArray.map(human => human._id)
    const names = humanArray.map(human => toRaw(human.name))
    const namesAndIDs = ids.map((id, i) => {
      return {
        id: id,
        name: `${names[i].first} ${names[i].last}`,
      }
    })
    const sortedNamesAndIDs = namesAndIDs.sort((a, b) => {
      const firstNameA = a.name.split(" ")[0];
      const firstNameB = b.name.split(" ")[0];
      return firstNameA.localeCompare(firstNameB);
    });
    return sortedNamesAndIDs
  }

  // MULTI CHECKBOX
  // Input needed => [{id: "441d321e5b21ee1ce143945d", name: "First Last"}, {...}]
  const createAttendanceLists = async() => {
    activeAttendanceList.value = await createAttendanceArray(toRaw(activeHumans))
    inactiveAttendanceList.value = await createAttendanceArray(toRaw(inactiveHumans))
  }

  // Date & Focus Lesson time formatting
  function getDate() {
    const focusLessonTime = 'T18:15:00Z'
    if(!date.value) { return moment().format() } // if date has not been selected, default to NOW
    return date.value + focusLessonTime // otherwise return date selected
  }

  // LAST SESSION SAVED CARD
  async function displayLatestSessionSaved() {
    const sessions = sessionStore.sessions
    const focusLessons = focusLessonStore.focusLessons
    const latestLessonDate = sessions.latest.date
    const latestLessonId = sessions.latest.topicID
    latestSessionSavedDate.value = new Date(latestLessonDate).toLocaleDateString()
    latestSessionSavedTopic.value = focusLessons.filter(lesson => lesson.id.includes(latestLessonId))[0].name
  }

  // SWITCHER
  const activeCard = ref(true)  // used by switcher
  const inactiveCard = ref(null)  // used by switcher
  const emitter = inject('emitter')
  const cardRerenderKey = ref(0) // works alongside the listener/emitter
  emitter.on('switcherLeft', (value) => {
      activeCard.value = true
      inactiveCard.value = false
  })
  emitter.on('switcherRight', (value) => {
      activeCard.value = false
      inactiveCard.value = true
  })

  // BUTTON success visual feedback
  let buttonColor = ref(null)
  let buttonTitle = ref("Save")

  const buttonSuccess = async () => {
    buttonTitle.value = "Saving Session..."
    buttonColor.value = "orange"
    setTimeout(() => {
        buttonTitle.value = "Session Saved"
        buttonColor.value = "#33872a"
    }, 900);
    setTimeout(() => {
        buttonTitle.value = "Save"
        buttonColor.value = ""
    }, 2500);
  }

  onMounted(() => {
    displayLatestSessionSaved()
    createAttendanceLists()
  })

  return {
    statusMsg, errorMsg,
    // Topics
    backControl, mount, halfGuard, sideControl, closedGuard, deLaRiva, openGuard, turtle,
    // Button
    buttonColor, buttonTitle, buttonSuccess,
    // SESSION
    sessionToAPI, getDate, latestSessionSavedDate, latestSessionSavedTopic, teacher, student, date, topic,
    // Student List and Multi Checkbox
    activeAttendanceList, inactiveAttendanceList, humanIdList,
    // Switcher
    inactiveCard, activeCard, cardRerenderKey,
  }
},
}
</script>
