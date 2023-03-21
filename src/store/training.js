import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTrainingStore = defineStore('training', () => {
  const dates = ref({
    lastSession: '',
    attended: [],
    unattended: []
  })

  const topics = ref({
    attended: []
  })

  function setDates(payload) {
    if(!payload) { return dates.value = null }

    dates.value.lastSession = payload.X,
    dates.value.email = payload.X,
    dates.value.role = payload.X
  }

  function setTopics(payload) {
    if(!payload) { return topics.value = null }

    topics.value.attended = payload
  }

  function $reset() {
    dates.value = {
      lastSession: '',
      attended: [],
      unattended: []
    }
    topics.value = {
      attended: []
    }
  }

  return {
    dates, setDates,
    topics, setTopics,
    $reset
  }
}, {
  persist: true
})