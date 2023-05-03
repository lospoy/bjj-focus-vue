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

    <!-- ATTENDANCE -->
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
import { inject, onMounted, reactive, ref } from 'vue'
import Switcher from '../../components/Switcher.vue'
import { getAllFocusLessons } from '../../services/bjj_services/focusLessonService'
import { getAllSessions, saveSession } from '../../services/sessionService'
import humanStore from "../../store/humanStore"
import { useHumanStore } from "../../store/humans"
import { useTrainingStore } from "../../store/training"

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
  const allHumans = useHumanStore().allHumans
  const trainingStore = useTrainingStore()

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
  // ThisWeek component is being loaded in the home page for sutdents and admin/teacher
  const topic = ref(null)
  const thisWeeksTopicID = trainingStore.topics.thisWeek.ID
  topic.value = thisWeeksTopicID

  // ATTENDANCE RELATED
  const latestSessionSavedDate = ref(null)
  const latestSessionSavedTopic = ref(null)
  const student = ref(null)
  const date = ref(null)
  const techniqueList = reactive([]) // Initialize empty array to show session techniques in DOM
  const techniqueIdArray = reactive([]) // Initialize empty array to store technique ids for POST
  const humanIdList = ref([carlosIdObject])     // used in multicheckbox, has Carlos Campoy as default value to keep track of classes (teacher always attends)
  const activeAttendanceList = ref([])    // used in multicheckbox
  const inactiveAttendanceList = ref([])  // used in multicheckbox

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

  // LAST SESSION SAVED CARD
  async function displayLatestSessionSaved() {
    const allSessions = await getAllSessions()
    const allFocusLessons = await getAllFocusLessons()
    const latestLessonId = allSessions[allSessions.length-1].what.focus._id
    latestSessionSavedDate.value = new Date(allSessions[allSessions.length-1].when.date).toLocaleDateString()
    latestSessionSavedTopic.value = allFocusLessons.filter(position => JSON.stringify(position._id).includes(latestLessonId))[0].topic
  }
        
  // Button success visual feedback
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

  // Date & Focus Lesson time formatting
  function getDate() {
    const focusLessonTime = 'T18:15:00Z'
    // if date has not been selected, default to NOW
    if(!date.value) { return moment().format() }
    // otherwise return date selected
    return date.value + focusLessonTime
  }

  // ACTIVE STUDENTS ATTENDANCE ARRAY
  // OUTPUT --> [ {id: "441d321e5b21ee1ce143945d", name: "Joe Schmoe"}, ] 
  async function createActiveStudentsAttendanceArray() {

    const activeHumans = allHumans.filter(human => human.trainingStatus)  // currently only "active" humnas have trainingStatus
    const activeHumansIDArray = activeHumans.map(human => human._id)
    const activeStudentsNameArray = await Promise.all(  // returns array of strings
      activeHumansIDArray.map(id => {
        return humanStore.methods.getStudentName(id)
      })
    )

    const activeStudentsnamesAndIDsArray = activeHumansIDArray.map((id, i) => { // creates array of objects
      return {
        id: id,
        name: activeStudentsNameArray[i],
      }
    })

    const sortedNamesAndIdsArray = activeStudentsnamesAndIDsArray.sort((a, b) => {
      const firstNameA = a.name.split(" ")[0];
      const firstNameB = b.name.split(" ")[0];
      return firstNameA.localeCompare(firstNameB);
    });
    
    return sortedNamesAndIdsArray
  }

  // INACTIVE *NOT ACTIVE* STUDENTS ATTENDANCE ARRAY
  // OUTPUT --> [ {id: "441d321e5b21ee1ce143945d", name: "Joe Schmoe"}, ] 
  async function createInactiveStudentsAttendanceArray() {

    const inactiveHumans = allHumans.filter(human => !human.trainingStatus)
    const inactiveHumansIDArray = inactiveHumans.map(human => human._id)
    const inactiveStudentsNameArray = await Promise.all(  // returns array of strings
      inactiveHumansIDArray.map(id => { 
        return humanStore.methods.getStudentName(id)
      })
    )

    const studentsLatestAttendedSessionArray = await Promise.all( // returns array of last session attended by each human (objects)
      inactiveHumansIDArray.map(id => { 
        return humanStore.methods.getStudentLastAttendedSession(id)
      })
    )

    const dates = []
    for(let i = 0; i <= studentsLatestAttendedSessionArray.length; i++){ // extracts session.when.date from the session objects and stores in "dates" array
      if (studentsLatestAttendedSessionArray[i] !== undefined) {
        dates.push(studentsLatestAttendedSessionArray[i].when.date)
      } else {
        dates.push('No date')
      }
    }

    const namesIdsLastDateArray = inactiveHumansIDArray.map((id, i) => { // creates array of objects
      return {
        id: id,
         name: inactiveStudentsNameArray[i],
         lastDate: dates[i]
      }
    })

    const sortedNamesAndIdsArray = namesIdsLastDateArray.sort((a, b) => {
      const firstNameA = a.name.split(" ")[0];
      const firstNameB = b.name.split(" ")[0];
      return firstNameA.localeCompare(firstNameB);
    });
    
    return sortedNamesAndIdsArray
  }

  // MULTI CHECKBOX
  const createAttendanceLists = async() => {
    activeAttendanceList.value = await createActiveStudentsAttendanceArray()
    inactiveAttendanceList.value = await createInactiveStudentsAttendanceArray()
  }

  onMounted(() => {
    displayLatestSessionSaved()
    createAttendanceLists()
  })

  // SAVE SESSION -> update attendance object and POST to API
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
        // Success button visual feedback
        console.log(res.status)
        if(res.status === 201) { await buttonSuccess() }
    } catch (error) {
      errorMsg.value = error.message;
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    }
  }
  
  return {
    teacher, student, date, topic, statusMsg, errorMsg,
    backControl, mount, halfGuard, sideControl, closedGuard, deLaRiva, openGuard, turtle,
    techniqueList, techniqueIdArray,
    sessionToAPI, getDate,
    buttonColor, buttonTitle, buttonSuccess,
    latestSessionSavedDate, latestSessionSavedTopic,
    // STUDENT LIST & MULTICHECKBOX
    activeAttendanceList, inactiveAttendanceList, humanIdList,
    // Switcher
    inactiveCard, activeCard, cardRerenderKey
  }
},
}
</script>
