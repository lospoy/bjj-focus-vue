<template>
    <!-- CALENDAR -->
    <div class="p-5 bg-light-grey rounded-md shadow-lg flex flex-col mb-4 justify-center">

      <!-- Skeleton loader (no data) -->
      <div
        class="animate-pulse"
        is-expanded
        v-if="skeleton"
      >
      </div>

    <!-- Actual Log with data -->

    <!-- SESSION CARD -->
    <div class="p-5 bg-light-grey rounded-md flex flex-col justify-center">

      <div class="pl-4 px-6 py-6 animate-pulse" v-if="sessionCardSkeleton">
            <span class="list-inside space-y-1 justify-center">
              Loading session data
            </span>
      </div>

      <!-- SESSION CARD: SELECTED DATE'S DETAILS -->
      <div class="flex flex-col pl-4 px-6 w-full">
            <ul class="list-inside space-y-1 self-center" v-if="afterSessionCardSkeleton">
              <li class="text-3xl text-dark-grey uppercase text-center -mb-3">{{ sessionTopic }}</li>
              <li class="text-s text-dark-grey uppercase text-center">{{ attendedOrNot }}</li>  
            </ul>
            <div class="flex flex-col mt-2 w-full" v-if="attended">
              <ul id="techniqueList" class="space-y-1 ml-4">
                  <li class="bg-light-gold bg-opacity-80 rounded-md shadow-sm text-dark-grey px-2" v-for="(item, index) of techniqueList" :key="index">
                    {{ item }}
                  </li>
              </ul>
            </div>
      </div>
    </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import store from "../store/store"
import { getAllFocusLessons } from "../services/bjj_services/focusLessonService"
import { getTechnique } from "../services/bjj_services/techniqueService";
import { getPosition } from "../services/bjj_services/positionService";
import { getMove } from "../services/bjj_services/moveService";
import { getVariation } from "../services/bjj_services/variationService";

export default {
  name: "SessionLog",
  setup() {
    // Variables
    const errorMsg = ref(null);
    const delay = 1000  // ms delay to sync the skeletonService and displayStudentData setTimeouts
    const selectedDay = ref(null)
    const dayDescription = ref(null)
    const displaySessionCard = ref(null) // if true, displays selected session's data
    const noSessionCard = ref(null) // if true, displays "no session data"
    const sessionCardDate = ref(null)
    const selectedLesson = ref(null)
    const sessionTopic = ref(null)
    

    // Training data
    const studentTrainingData = ref(null)
    const unattendedSessions = ref(null)
    const attendedSessions = ref(null)
    const techniqueList = reactive([])
    const attendedOrNot = ref(null)
    const attended = ref(null)

    const getTopic = async(focusLessonId) => { // returns string
      const allFocusLessons = await getAllFocusLessons()
      return await allFocusLessons.filter(_id => JSON.stringify(_id).includes(focusLessonId))[0].topic
    }

    // Skeleton vars
    const skeleton = ref(null)
    const calendar = ref(null)
    const sessionCardSkeleton = ref(null)
    const afterSessionCardSkeleton = ref(null)
    
    const skeletonService = _ => {
      skeleton.value = true
      calendar.value = false
      sessionCardSkeleton.value = true
      afterSessionCardSkeleton.value = false

      setTimeout(() => {
        sessionCardSkeleton.value = false
        afterSessionCardSkeleton.value = true
      }, delay);

      setTimeout(() => {
        skeleton.value = false
        calendar.value = true
      }, delay + 3000);
    }
    skeletonService()

    // **************  CALENDAR ************** 
    const date = ref(null)
    const attributes = ref(null)

    setTimeout(() => {
      studentTrainingData.value = store.methods.getStudent().training
      unattendedSessions.value = studentTrainingData.value.unattendedSessions
      attendedSessions.value = studentTrainingData.value.attendedSessions

      // Returns array of promises (attended sessions)
      const attendedPromise = attendedSessions.value.map(async aS => ({
        highlight: {
          style: {
            backgroundColor: '#ffcc41',
            borderColor: '#ffcc41'
          },
          fillMode: 'outline'
        },
        popover: {
          label: `${await getTopic(aS.what.focus._id)}`,
        },
        dates: aS.when.date
      }))

      // Returns array of promises (unattended sessions)
      const unattendedPromise = unattendedSessions.value.map(async uS => ({
        highlight: {
          style: {
            backgroundColor: 'rgba(255, 204, 65, .3)',
            borderColor: 'rgba(255, 204, 65, 0)'
          },
          fillMode: 'outline'
        },
        popover: {
          label: `${await getTopic(uS.what.focus._id)}`,
        },
        dates: uS.when.date
      }))

      const todayMarker = [{ // Style for a marker that marks today's date
          key: 'today',
          dot: 'yellow',
          dates: new Date(),
        }]

      // Returns resolved array of promises
      const resolvePromiseArrays = async(arr1, arr2) => {
        const res1 = await Promise.all(arr1)
        const res2 = await Promise.all(arr2)
        attributes.value = res1.concat(res2).concat(todayMarker)
      }
      resolvePromiseArrays(attendedPromise, unattendedPromise)
    }, delay);


    // DISPLAYS A DIV WITH SESSION DATA IF THE CLICKED DATE IS A FOCUS SESSION DATE
    const daySelected = day => {
      selectedDay.value = day.date.toISOString().slice(0, 10) // YYYY-MM-DD
      const trainingData = store.methods.getStudent().training
      const allSessions = trainingData.allSessions
      const attendedDates = trainingData.attendedSessions.map(s => s.when.date.slice(0, 10)) // YYYY-MM-DD

    const getFocusLessonTechniqueIDs = async(lessonID) => { // returns array of objects [ {id: 'string'}, ]
      const allFocusLessons = await getAllFocusLessons()
      const lessonTechniques = allFocusLessons.filter(_id => JSON.stringify(_id).includes(lessonID))[0].content.techniques // returns array of technique ids of a specific focus lesson
      return lessonTechniques
    }

    const getTechniqueObjectFromID = async(techniqueID) => {
      const getTechniqueObject = await getTechnique(techniqueID)
      return getTechniqueObject
    }

    const showSessionTechniques = async(lessonID) => {
        const sessionTechniques = await getFocusLessonTechniqueIDs(lessonID) // ************* PASSING AN ID MANUALLY
        const sessionTechniqueIDs = await Promise.all(sessionTechniques.map(e => e._id)) // returns array of string ids [ 'string', ]
        const sessionTechniqueObjects = await Promise.all(sessionTechniqueIDs.map(id => getTechniqueObjectFromID(id))) // returns array of technique objects [ {...}, ]

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
        const sessionOnSelectedDay = allSessions.filter(s => s.when.date.includes(selectedDay.value))[0]
        const attendedOnSelectedDay = attendedDates.filter(d => d.includes(selectedDay.value))[0]
        const lessonOnSelectedDay = allSessions.filter(s => s.when.date.includes(selectedDay.value))[0]

        

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
        // Skeleton
        skeleton, calendar, sessionCardSkeleton, afterSessionCardSkeleton,
        dayDescription,
        // Training data
        studentTrainingData, attendedSessions, unattendedSessions, techniqueList, selectedLesson, attendedOrNot, sessionTopic, attended
    };
  },
};
</script>