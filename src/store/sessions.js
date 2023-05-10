// Used in @components/StudentStats.vue
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
    perTopic: ''
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
    const arrayOfTopics = sessionsAttended.map(session => session.what.focus._id)
    const sumOfTopics = arrayOfTopics.reduce((obj, item) => {
      if(!obj[item]) {  //checks if topic ID exists, otherwise it declares it
        obj[item] = 0;
      }
      obj[item]++;  //adds +1 every time it finds one
      return obj;
    }, {});

    // All this to create "perTopic"
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

    function createRawPerTopic() {
      const arr = []
      for (const [key, value] of Object.entries(sumOfTopics)) {
        arr.push([key, value]);
      }
      return arr
    }
    
    function createPerTopic() {
      const lessons = useFocusLessonsStore().focusLessons
      const focus = lessons.map(lesson => lesson.id)
      const raw = createRawPerTopic()
      const perTopic = matchAndSortArrays(raw, focus)
      
      return perTopic
    }

  
    // Assign values
    sessions.value.all = allSessions
    sessions.value.attended = sessionsAttended
    sessions.value.unattended = sessionsUnattended
    sessions.value.focus = focusSessions
    sessions.value.first = firstSession
    sessions.value.latest.date = latestSessionAttended.when.date
    sessions.value.latest.topicID = latestSessionAttended.what.focus._id
    sessions.value.daysSinceLatest = daysSinceLatestSession
    sessions.value.perTopic = createPerTopic()
    sessions.value.weeksTrained = weeksTrained
  }

  return {
    sessions, getAndSetSessionsData
  }
})

// Helper functions

