// Used in @components/StudentStats.vue
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllSessions } from "../services/sessionService";

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref({
    all: '',
    focus: '',
    first: '',
    latest: '',
    daysSinceLatest: '',
    weeksTrained: '',
    attendedQuantity: '',
    unattendedQuantity: '',
    perTopicQuantity: ''
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
    const arr = []
    for (const [key, value] of Object.entries(sumOfTopics)) {
      arr.push([key, value]);
    }
    const sessionsPerTopic = arr

    sessions.value.all = allSessions
    sessions.value.attendedQuantity = sessionsAttended
    sessions.value.unattendedQuantity = sessionsUnattended
    sessions.value.focus = focusSessions
    sessions.value.first = firstSession
    sessions.value.latest = latestSessionAttended.when.date
    sessions.value.daysSinceLatest = daysSinceLatestSession
    sessions.value.perTopicQuantity = sessionsPerTopic
    sessions.value.weeksTrained = weeksTrained
  }

  return {
    sessions, getAndSetSessionsData
  }
})