// Used in @components/StudentStats.vue
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFocusLessonsStore = defineStore('focusLessons', () => {
  const focusLessons = ref({})

  function setFocusLessons(payload) {
    if(!payload) { return focusLessons.value = null }
    focusLessons.value = payload
  }

  return {
    focusLessons, setFocusLessons
  }
})