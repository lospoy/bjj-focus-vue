<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div :key="cardRerenderKey" ><!-- add v-if="calendarCard" -->
    <div class="px-5 pt-10 pb-12 bg-dark-grey rounded-md flex flex-col justify-center -mb-7">
      <div class="flex flex-col pl-4 px-6 w-full">
            <div class="flex flex-col mt-2 w-full">
              <ul id="techniqueList" class="space-y-1 ml-4 self-center">
                  <li class="text-light-grey text-sm">
                    Find all your past sessions
                  </li>
              </ul>
            </div>
      </div>
    </div>

    <SessionCalendar />
    </div>

  </div>
</template>

<script>
import { inject, ref } from "vue"; // inject is required for the emitter (EventBus)
import SessionCalendar from "../../components/SessionCalendar.vue";
import SessionLog from "../../components/SessionLog.vue";
import Switcher from '../../components/Switcher.vue';


export default {
  name: "sstudentSession",
  components: {
    SessionCalendar,
    SessionLog,
    Switcher
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const user = JSON.parse(localStorage.getItem("BJJFocusUser"))
    let btnTopicColor = ref(null)
    let btnSkillColor = ref(null)
    let btnTopicTitle = ref("Topics Balance")
    let btnSkillTitle = ref("Skill Growth")
    const cardRerenderKey = ref(0) // works alongside the listener/emitter
    const logCard = ref(true)
    const calendarCard = ref(null)

    const emitter = inject('emitter')
    emitter.on('switcherLeft', (value) => {
        logCard.value = true
        calendarCard.value = false
    })
    emitter.on('switcherRight', (value) => {
        logCard.value = false
        calendarCard.value = true
    })
    
    return {
        errorMsg, user,
        btnTopicColor, btnSkillColor, btnTopicTitle, btnSkillTitle,
        cardRerenderKey,
        logCard, calendarCard
    };
  },
};
</script>
