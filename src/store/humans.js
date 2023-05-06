import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHumanStore = defineStore('humans', () => {
  const allHumans = ref({})
  const activeHumans = ref({})
  const inactiveHumans = ref({})

  function setAllHumans(payload) {
    if(!payload) { return allHumans.value = null }
    allHumans.value = payload
  }

  function setActiveHumans(payload) {
    if(!payload) { return activeHumans.value = null }
    activeHumans.value = payload
  }

  function setInactiveHumans(payload) {
    if(!payload) { return inactiveHumans.value = null }
    inactiveHumans.value = payload
  }

  return {
    allHumans, setAllHumans,
    activeHumans, setActiveHumans,
    inactiveHumans, setInactiveHumans,
  }
})