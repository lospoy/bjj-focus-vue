<template>
    <!-- CALENDAR -->
    <div class="bg-dark-grey rounded-md shadow-md border-0 flex flex-col mb-4 justify-center animate-fadeIn">
      <!-- Actual calendar with data -->
      <v-calendar
        is-expanded
        is-dark
        color="yellow"
        :attributes="attributes"
        @dayclick = 'daySelected'
        class="calendar-style"
      >

      </v-calendar>

    <!-- SESSION CARD -->
    <div class="p-3 bg-dark-grey rounded-md flex flex-col justify-center" v-if="displaySessionCard">

      <div class="pl-4 px-6 py-6 animate-pulse" v-if="sessionCardSkeleton">
            <span class="list-inside space-y-1 justify-center">
              Loading session data
            </span>
      </div>

      <!-- SESSION CARD: SELECTED DATE'S DETAILS -->
      <div class="flex flex-col px-2 w-full">
            <ul class="list-inside space-y-1 self-center" v-if="afterSessionCardSkeleton">
              <li class="text-3xl text-light-grey uppercase text-center -mb-3">{{ sessionTopic }}</li>
              <li class="text-sm text-light-grey uppercase text-center">session {{ attendedOrNot }}</li>
            </ul>
            <div class="flex flex-col w-full" v-if="attended">
              
              <h3 class="text-sm mt-4 text-light-grey">{{ sessionTopic }} curriculum</h3>
              <div class="pb-2 pl-3 ">
              <ul id="techniqueList" class="space-y-1 justify-center list-disc">
                  <li class=" text-gold rounded-md text-sm font-normal" v-for="(item, index) of techniqueList" :key="index">
                    <span class="text-light-grey">{{ item }}</span>
                  </li>
              </ul>
              </div>
            </div>
      </div>
    </div>

    <div class="p-5 bg-dark-grey rounded-md flex flex-col justify-center" v-if="noSessionCard">
      <span class="text-light-grey flex justify-center">No session on this date</span>
    </div>

    <div class="py-3 px-6 bg-dark-grey rounded-md flex flex-col justify-center" v-if="!noSessionCard && !displaySessionCard">
      <span class="text-light-grey flex justify-center text-sm">Click on a date to view more</span>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { getMove } from "../services/bjj_services/moveService";
import { getPosition } from "../services/bjj_services/positionService";
import { getTechnique } from "../services/bjj_services/techniqueService";
import { getVariation } from "../services/bjj_services/variationService";
import { useFocusLessonsStore } from '../store/focusLessons';
import { useSessionsStore } from "../store/sessions";

export default {
  name: "SessionCalendar",
  setup() {
    // Variables
    const errorMsg = ref(null);
    const selectedDay = ref(null)
    const displaySessionCard = ref(null) // if true, displays selected session's data
    const noSessionCard = ref(null) // if true, displays "no session data"
    const sessionCardDate = ref(null)
    const selectedLesson = ref(null)
    const sessionTopic = ref(null)

    // Pinia Store
    const focusLessonStore = useFocusLessonsStore()
    const sessionsStore = useSessionsStore()
    const sessions = sessionsStore.sessions

    // Training data
    const techniqueList = reactive([])
    const attendedOrNot = ref(null)
    const attended = ref(null)

    function getTopic(id) { // returns string
      const topic = focusLessonStore.getLessonByID(id).name
      return topic
    }

    // **************  CALENDAR ************** 
    // Style for a marker that marks today's date
    const todayMarker = [{
      key: 'today',
      dot: 'yellow',
      dates: new Date(),
    }]
    // Variables
    const date = ref(null)
    const attributes = ref(null)
    const unattendedSessions = sessions.unattended
    const attendedSessions = sessions.attended
    
    // Returns array of promises (attended sessions)
    const attendedCalendarData = attendedSessions.map(aS => ({
      highlight: {
        style: {
          backgroundColor: '#ffcc41',
          borderColor: '#ffcc41',
        },
        fillMode: 'outline',
      },
      popover: {
        label: `${getTopic(aS.what.focus._id)}`,
      },
      dates: aS.when.date
    }))

    // Returns array of promises (unattended sessions)
    const unattendedCalendarData = unattendedSessions.map(uS => ({
      highlight: {
        style: {
          backgroundColor: 'rgba(247, 247, 247, .3)',
          borderColor: 'rgba(247, 247, 247, 0)'
        },
        fillMode: 'outline'
      },
      popover: {
        label: `${getTopic(uS.what.focus._id)}`,
      },
      dates: uS.when.date
    }))

    function setCalendarAttendance (arr1, arr2) {
      attributes.value = arr1.concat(arr2).concat(todayMarker)
    }
    setCalendarAttendance(attendedCalendarData, unattendedCalendarData)

    // CLICKED SESSION DETAILS
    // DISPLAYS A DIV WITH SESSION DATA IF THE CLICKED DATE IS A FOCUS SESSION DATE
    const daySelected = day => {
      selectedDay.value = day.date.toISOString().slice(0, 10) // YYYY-MM-DD
      const attendedDates = sessions.attended.map(s => s.when.date.slice(0, 10)) // YYYY-MM-DD

    const getFocusLessonTechniqueIDs = async(lessonID) => { // returns array of objects [ {id: 'string'}, ]
      const lessonTechniques = focusLessonStore.getLessonByID(lessonID).techniqueIDs // returns array of technique ids of a specific focus lesson
      return lessonTechniques
    }

    const getTechniqueObjectFromID = async(techniqueID) => {
      const getTechniqueObject = await getTechnique(techniqueID)
      return getTechniqueObject
    }

    const showSessionTechniques = async(lessonID) => {
        const sessionTechniqueIDs = focusLessonStore.getLessonByID(lessonID).techniqueIDs // returns array of string ids [ 'string', ]
        const sessionTechniqueObjects = sessionTechniqueIDs.map(id => getTechniqueObjectFromID(id)) // returns array of technique objects [ {...}, ]

        for await (const technique of sessionTechniqueObjects) {
            await decryptTechnique(technique.position, technique.move, technique.variation)
        }
    }

    const decryptTechnique = async(positionId, moveId, variationId) => {
      // unintended outcome: pushes to array but selecting a different day pushes more to the array
      // intended: creates a new array each time
      const positionObject = await getPosition(positionId)
      const moveObject = await getMove(moveId)
      const variationObject = await getVariation(variationId)
      if (variationObject.name.english === 'Standard') {
        variationObject.name.english = ''
      }
      if(moveObject.category.pass) {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english} Pass from ${positionObject.name.english}`)
      }
      if(moveObject.category.entry) {
        techniqueList.push(`${variationObject.name.english} Entry ${moveObject.name.english} from ${positionObject.name.english}`)
      }
      if(moveObject.category.escape) {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english} Escape`)
      }
      if(moveObject.category.submission) {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english}`)
      }
      if(moveObject.category.sweep) {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english}`)
      }
      if(moveObject.category.takedown && positionObject.name.english === "Standing") {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english} Takedown`)
      } else if (moveObject.category.takedown) {
        techniqueList.push(`${variationObject.name.english} ${moveObject.name.english} Takedown from ${positionObject.name.english}`)
      }
    }

      // Displays data related to the session that was held on the clicked day (if any)
      const displaySessionData = async() => {
        const sessionOnSelectedDay = sessions.all.filter(s => s.when.date.includes(selectedDay.value))[0]
        const attendedOnSelectedDay = attendedDates.filter(d => d.includes(selectedDay.value))[0]
        const lessonOnSelectedDay = sessions.all.filter(s => s.when.date.includes(selectedDay.value))[0]

        if (sessionOnSelectedDay) {
          techniqueList.splice(0, techniqueList.length) // deletes all values so the array shows only the selected date
          selectedLesson.value = lessonOnSelectedDay.what.focus._id
          showSessionTechniques(selectedLesson.value)
          sessionTopic.value = await Promise.resolve(getTopic(lessonOnSelectedDay.what.focus._id))
          displaySessionCard.value = true
          noSessionCard.value = false
        }
        if (!sessionOnSelectedDay) {
          displaySessionCard.value = false
          noSessionCard.value = true
        }
        if (attendedOnSelectedDay) {
          attendedOrNot.value = 'Attended'  // displays text to the user
          attended.value = true             // used for v-if
        } else {
          attendedOrNot.value = 'Not Attended'
          attended.value = false
        } 
      }
        sessionCardDate.value = selectedDay.value
        displaySessionData()
    }

    return {
        errorMsg, date, attributes,
        // Session Card
        daySelected, selectedDay,
        displaySessionCard, sessionCardDate, noSessionCard,
        // Training data
        techniqueList, selectedLesson, attendedOrNot, sessionTopic, attended
    };
  },
};
</script>

<style scoped>
  .calendar-style {
    background-color: #292c2d;
    border: none;
    color: #f7f7f7;
  }
  .vc-title {
    color: #f7f7f7 !important;
    padding: 0 !important;
    font-size: 12px !important;
    font-weight: 400 !important;
  }
  .vc-weekday {
    color: #ffcc41;
  }
</style>