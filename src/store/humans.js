import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHumanStore = defineStore('humans', () => {
  const allHumans = ref({})

  function setAllHumans(payload) {
    if(!payload) { return allHumans.value = null }

    allHumans.value = payload
  }

  return {
    allHumans, setAllHumans
  }
})