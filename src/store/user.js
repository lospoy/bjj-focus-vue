import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('data', () => {
  const user = ref({
    id: '',
    email: '',
    role: {},
    isLoggedIn: false
  })

  const human = ref({
    id: '',
    name: {
      first: '',
      last: ''
    }
  })

  function setUserDataAndHumanID(payload) {
    if(!payload) { return user.value = null }

    user.value.id = payload._id,
    user.value.email = payload.email,
    user.value.role = payload.role,
    user.value.isLoggedIn = true,
    human.value.id = payload.human
  }

  function setHumanName(payload) {
    if(!payload) { return human.value = null }

    human.value.name.first = payload.first,
    human.value.name.last = payload.last
  }

  function $reset() {
    user.value = {
      isLoggedIn: false
    }
    human.value = null
  }

  return {
    user, setUserDataAndHumanID,
    human, setHumanName,
    $reset
  }
}, {
  persist: true
})