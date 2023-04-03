import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTrainingStore = defineStore('training', () => {
  const dates = ref({
    lastSession: '',
    attended: [],
    unattended: []
  })

  const topics = ref({
    attended: [],
    thisWeek: {}
  })

  function setDates(payload) {
    if(!payload) { return dates.value = null }

    dates.value.lastSession = payload.X,
    dates.value.email = payload.X,
    dates.value.role = payload.X
  }

  function setTopics(payload) {
    if(!payload) { return topics.value.attended = null }

    topics.value.attended = payload
  }

  function setThisWeeksTopic(payload) {
    if(!payload) { return topics.value.thisWeek = null }

    topics.value.thisWeek = {
      name: Object.keys(payload)[0],
      ID: Object.values(payload)[0],
    }
  }  

  function $reset() {
    dates.value = {
      lastSession: '',
      attended: [],
      unattended: []
    }
    topics.value = {
      attended: [],
      thisWeek: {}
    }
  }

  return {
    dates, setDates,
    topics, setTopics, setThisWeeksTopic,
    $reset
  }
}, {
  persist: true
})