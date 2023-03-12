<template>
    <div class="max-w-screen-md mx-auto px-4 py-10">
        <!-- Status Message -->
        <div
            v-if="statusMsg || errorMsg"
            class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
        >
            <p class="text-at-light-orange">
                {{ statusMsg }}
            </p>
            <p class="text-red-500 shadow-lg">
                {{ errorMsg }}
            </p>
        </div>

        <!-- SAVE SESSION -->
        <div class="p-8 flex items-start bg-light-grey rounded-md shadow-lg">
            <!-- Form -->
            <form
                class="flex flex-col gap-y-4 w-full"
            >
                <h1 class="text-3xl text-at-light-orange self-center">Save Session</h1>

                <!-- Date -->
                <div class="flex flex-col">
                <label for="date" class="text-sm text-at-light-orange">
                    Date
                </label>
                <input
                    type="date"
                    class="p-2 text-grey-500 focus:outline-none"
                    id="date"
                    v-model="date"
                />
                </div>

                <!-- Teacher -->
                <div class="flex flex-col">
                <label for="teacher" class="text-sm text-at-light-orange">
                    Teacher
                </label>
                <select
                    required
                    class="p-2 text-grey-500 focus:outline-none"
                    id="teacher"
                    v-model="teacher"
                >
                <option :value="teacher">Carlos Campoy</option>
                </select>
                </div>

                <!-- Topic -->
                <div class="flex flex-col">
                <label for="topic" class="text-sm text-at-light-orange">
                    Topic
                </label>
                <select
                    class="p-2 text-grey-500 focus:outline-none"
                    id="topic"
                    v-model="topic"
                >
                    <option :value="backControl">Back Control</option>
                    <option :value="halfGuard">Half Guard</option>
                    <option :value="sideControl">Side Control</option>
                    <option :value="closedGuard">Closed Guard</option>
                    <option :value="mount">Mount</option>
                    <option :value="deLaRiva">De La Riva</option>
                    <option :value="openGuard">Open Guard</option>
                    <option :value="turtle">Turtle</option>
                </select>
                </div>
            </form>
        </div>

        <!-- STUDENT LIST SORTED BY LATEST CLASS ATTENDED (NEWEST) -->
        <div class="p-5 bg-light-grey rounded-md shadow-lg flex flex-col justify-center mt-4">
          <div class="rounded-md bg-at-light-orange mb-2 self-center">
            <span class="flex text-m text-white px-24">ATTENDANCE - {{humanIdList.length -1}}</span>
          </div>
            <form
                @submit.prevent="sessionToAPI"
                class="flex flex-col gap-y-2 w-full"
            >
                <div class="flex flex-col items-center justify-center">
                  <MultiCheckbox
                    v-model:value="humanIdList"
                    :options="attendanceList"
                  />
                </div>

                <Button :title='buttonTitle' :color='buttonColor' />
            </form>
        </div>

        <!-- LATEST SESSION SAVED -->
        <div class="p-5 bg-light-grey rounded-md shadow-lg flex flex-col justify-center mt-4">
          <div class="rounded-md bg-at-light-orange mb-2 self-center">
            <span class="flex text-m text-white px-24">Latest Session Saved</span>
          </div>
            <div class="flex pl-4 px-6 justify-center">
                  <ul class="list-inside space-y-1 justify-center list-disc">
                    <li class="text-l text-dark-grey uppercase -mb-1">Date: {{ latestSessionSavedDate }}</li>
                    <li class="text-l text-dark-grey uppercase">Topic: {{ latestSessionSavedTopic }}</li>
                  </ul>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { getAllHumans } from '../../services/humanService'
import { getAllFocusLessons } from '../../services/bjj_services/focusLessonService'
import { saveSession, getAllSessions } from '../../services/sessionService'
import humanStore from "../../store/humanStore"
import moment from 'moment'

// components import
import Button from "../../components/Button.vue";
import MultiCheckbox from "../../components/Multi-checkbox.vue"

export default {
    name: 'session',
    components: {
        Button,
        MultiCheckbox,
    },
    setup() {
        const statusMsg = ref(null)
        const errorMsg = ref(null)

        // Focus Lesson IDs
        const backControl = "63476ca77c0c4048382acb04"
        const mount = "634ecefa9f04894fb818c868"
        const halfGuard = "634ed31717260c95e351de8d"
        const sideControl = "634ed53c17260c95e351decb"
        const closedGuard = "634ed77517260c95e351dfa3"
        const deLaRiva = "634edb2337829d81a79048ab"
        const openGuard = "638eaab8964f267814d40a89"
        const turtle = "638ead84964f267814d40ad7"
        const teacher = ref(null)
        const latestSessionSavedDate = ref(null)
        const latestSessionSavedTopic = ref(null)

        // Human IDs
        const carlosCampoy = '630e5c2da1c2a0bcf246c383'

        // Create data
        teacher.value = carlosCampoy
        const topic = ref('')
        const student = ref(null)
        const date = ref(null)
        const techniqueList = reactive([]) // Initialize empty array to show session techniques in DOM
        const techniqueIdArray = reactive([]) // Initialize empty array to store technique ids for POST
        const carlosId = {"id": "630e5c2da1c2a0bcf246c383"}
        const humanIdList = ref([carlosId]) // used in multicheckbox, defautl has Carlos Campoy as curriculum ideal
        const attendanceList = ref([]) // used in multicheckbox

        // LAST SESSION SAVED CARD
        const displayLatestSessionSaved = async() => {
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
        const getDate = _ => {
            const focusLessonTime = 'T18:15:00Z'
            // if date has not been selected, default to NOW
            if(!date.value) { return moment().format() }
            // otherwise return date selected
            return date.value + focusLessonTime
        }

        // CREATE ATTENDANCE ARRAY -> array of objects sorted by their most recent attended date
        // [ {name: "Juan", id: "1231228hfqinf"}, ] 
        const createAttendanceArray = async() => {
            const allHumans = await getAllHumans()
            const allHumansIdArray = allHumans.map(human => human._id)

            const studentsNameArray = await Promise.all(  // returns array of strings
              allHumansIdArray.map(id => { 
                return humanStore.methods.getStudentName(id)
              })
            )

            const studentsLatestAttendedSessionArray = await Promise.all( // returns array of last session attended by each human (objects)
              allHumansIdArray.map(id => { 
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

            const namesIdsLastDateArray = allHumansIdArray.map((id, i) => { // creates array of objects
              return {
                id: id,
                name: studentsNameArray[i],
                lastDate: dates[i]
              }
            })

            const dateToMs = date => new Date(date).getTime()
            const sortedNamesAndIdsArray = namesIdsLastDateArray.sort((a, b) => { // Sorts array by most recent date
                return dateToMs(b.lastDate) - dateToMs(a.lastDate)
              })

            return sortedNamesAndIdsArray
        }

        // MULTI CHECKBOX
        const getAttendanceList = async() => {
          attendanceList.value = await createAttendanceArray()
        }

        onMounted(() => {
          getAttendanceList()
          displayLatestSessionSaved()
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
            attendanceList, humanIdList, getAttendanceList
        }
    },
}
</script>
