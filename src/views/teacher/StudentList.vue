<template>
  <div class="max-w-screen-sm mx-auto px-4 py-5">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- STUDENT CHECKBOXES -->
    <div class="flex flex-col p-4 bg-dark-grey rounded-md shadow-lg mt-4 justify-center">
          <Switcher
            class="max-w-screen-sm py-1 px-2 mb-4"
            :titleLeft="'Active'"
            :titleRight="'Inactive'"
          />
          
          <div class="flex flex-col gap-y-2 w-full items-center">
          <!-- LEFT NAME LIST -->
          <div :key="cardRerenderKey" v-if="activeCard" class="text-light-grey text-md">
            <MultiCheckbox
              v-model:value="humanIDList"
              :options="activeAttendanceList"
            />
          </div>
          <!-- RIGHT NAME LIST -->
          <div :key="cardRerenderKey" v-if="inactiveCard" class="text-light-grey text-md">
            <MultiCheckbox
              v-model:value="humanIDList"
              :options="inactiveAttendanceList"
            />
          </div>
        </div>
    </div>
    
    <!-- STATS DISPLAY -->
        <AttendanceStats
          v-for="human in humanIDList"
          :fieldId="human.name"
          :label="human.name"
          :key="human"
          :title='human.name'
          :id='human.id'
        />
  
  </div>
</template>

<script>
import { inject, onMounted, ref, toRaw } from "vue";
import AttendanceStats from "../../components/AttendanceStats.vue";
import MultiCheckbox from "../../components/Multi-checkbox.vue";
import Switcher from '../../components/Switcher.vue';
import { useHumanStore } from "../../store/humans";

export default {
  name: "StudentList",
  components: {
    AttendanceStats,
    MultiCheckbox,
    Switcher
  },
setup() {
  // Variables
  const errorMsg = ref(null);
  const humanIDList = ref([]) // used in multicheckbox
  const activeAttendanceList = ref([])    // used in multicheckbox
  const inactiveAttendanceList = ref([])  // used in multicheckbox
  
  // Pinia Store
  const activeHumans = useHumanStore().activeHumans
  const inactiveHumans = useHumanStore().inactiveHumans

  // ATTENDANCE ARRAY GENERATOR
  async function createAttendanceArray(humanArray) {
    const ids = humanArray.map(human => human._id)
    const names = humanArray.map(human => toRaw(human.name))
    const namesAndIDs = ids.map((id, i) => {
      return {
        id: id,
        name: `${names[i].first} ${names[i].last}`,
      }
    })
    const sortedNamesAndIDs = namesAndIDs.sort((a, b) => {
      const firstNameA = a.name.split(" ")[0];
      const firstNameB = b.name.split(" ")[0];
      return firstNameA.localeCompare(firstNameB);
    });
    return sortedNamesAndIDs
  }

  // MULTI CHECKBOX
  // Input needed => [{id: "441d321e5b21ee1ce143945d", name: "First Last"}, {...}]
  const getNameAndIdArray = async() => {
    activeAttendanceList.value = await createAttendanceArray(toRaw(activeHumans))
    inactiveAttendanceList.value = await createAttendanceArray(toRaw(inactiveHumans))
  }

  // SWITCHER
  const activeCard = ref(true)  // used by switcher
  const inactiveCard = ref(null)  // used by switcher
  const emitter = inject('emitter')
  const cardRerenderKey = ref(0) // works alongside the listener/emitter
  emitter.on('switcherLeft', (value) => {
      activeCard.value = true
      inactiveCard.value = false
  })
  emitter.on('switcherRight', (value) => {
      activeCard.value = false
      inactiveCard.value = true
  })

  onMounted(() => {
    getNameAndIdArray()
  })
  
  return {
      errorMsg,
      // MULTICHECKBOX
      humanIDList, activeAttendanceList, inactiveAttendanceList, cardRerenderKey, activeCard, inactiveCard
  };
},
};
</script>
