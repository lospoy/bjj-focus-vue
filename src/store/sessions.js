// Used in @components/AttendanceStats.vue
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllSessions } from "../services/sessionService";
import { useFocusLessonsStore } from '../store/focusLessons';

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref({
    all: '',
    focus: '',
    first: '',
    latest: {
      date: '',
      topicID: ''
    },
    daysSinceLatest: '',
    weeksTrained: '',
    attended: '',
    unattended: '',
    perTopic: {
      attended: '', 
      all: '',
      levelOne: ''
    },
  })

  async function getAndSetSessionsData(humanID) {
    if(!humanID) { return sessions.value = null }

    const allSessions = await getAllSessions()
    const sessionsAttended = allSessions.filter(session => JSON.stringify(session.who.students).includes(humanID))
    const sessionsUnattended = allSessions.filter(session => !JSON.stringify(session.who.students).includes(humanID))
    const focusSessions = sessionsAttended.length
    const firstSessionAttended = sessionsAttended[0]
    const firstSession = new Date(firstSessionAttended.when.date)
    const latestSessionAttended = sessionsAttended[sessionsAttended.length-1]
    const diffInMs = new Date() - new Date(latestSessionAttended.when.date) // in miliseconds
    const daysSinceLatestSession = Math.floor(diffInMs / (1000 * 60 * 60 * 24 ))
    const totalTrainedInMsInMs = new Date(latestSessionAttended.when.date) - new Date(firstSessionAttended.when.date)  // in miliseconds
    const weeksTrained = Math.round(totalTrainedInMsInMs / (1000 * 60 * 60 * 24 ) / 7)
    
    // Calculating the number sessions and grouping them per Focus Lesson or "Topic"

    // Creates a Map of lesson topics { focusLesson_id: quantity, ... }
    // Takes an array of sessions (all sessions, attended sessions, or unattended sessions)
    function createTopicsMap(sessionsArr) {
      const sessionsMap = sessionsArr
        .map(session => session.what.focus._id)
        .reduce((obj, item) => {
          if(!obj[item]) {  //checks if topic ID exists, otherwise it declares it
            obj[item] = 0;
          }
          obj[item]++;  //adds +1 every time it finds one
          return obj;
        }, {})

      return sessionsMap
    }

    // Matches the order in focusLesson store and makes sure both arrays are equal length
    function matchAndSortArrays(arr, focus) {
      const arrCopy = [...arr];
      const missing = focus.filter((str) => !arrCopy.some((el) => el[0] === str));
      missing.forEach((str) => arrCopy.push([str, 0]));
      arrCopy.sort((a, b) => {
        return focus.indexOf(a[0]) - focus.indexOf(b[0]);
      });
      return arrCopy;
    }

    function createRawPerTopic(topicsMap) {
      const arr = []
      for (const [key, value] of Object.entries(topicsMap)) {
        arr.push([key, value]);
      }
      return arr
    }

    function createPerTopic(topicsMap) {
      const lessons = useFocusLessonsStore().focusLessons
      const focus = lessons.map(lesson => lesson.id)
      const raw = createRawPerTopic(topicsMap)
      const perTopic = matchAndSortArrays(raw, focus)
      
      return perTopic
    }

    // Used as a goal for students
    // 32 classes = 4 months of 2 classes/week
    const attended32sessions = [
      [ "63476ca77c0c4048382acb04", 4 ], [ "634ed31717260c95e351de8d", 4 ], [ "634ed77517260c95e351dfa3", 4 ],[ "634edb2337829d81a79048ab", 4 ],
      [ "638eaab8964f267814d40a89", 4 ], [ "634ed53c17260c95e351decb", 4 ], [ "634ecefa9f04894fb818c868", 4 ], [ "638ead84964f267814d40ad7", 4 ]
    ]

  
    // Assign values
    sessions.value.all = allSessions
    sessions.value.attended = sessionsAttended
    sessions.value.unattended = sessionsUnattended
    sessions.value.perTopic.attended = createPerTopic(createTopicsMap(sessionsAttended))
    sessions.value.perTopic.all = createPerTopic(createTopicsMap(allSessions))
    sessions.value.perTopic.levelOne = attended32sessions
    sessions.value.latest.date = latestSessionAttended.when.date
    sessions.value.latest.topicID = latestSessionAttended.what.focus._id
    sessions.value.focus = focusSessions
    sessions.value.first = firstSession
    sessions.value.daysSinceLatest = daysSinceLatestSession
    sessions.value.weeksTrained = weeksTrained
  }

  return {
    sessions, getAndSetSessionsData
  }
})

