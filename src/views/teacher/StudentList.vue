<template>
  <div class="max-w-screen-sm mx-auto px-4 py-5">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- STUDENT CHECKBOXES -->
    <div class="p-8 flex flex-col items-center bg-dark-grey  rounded-md shadow-lg mb-4">
      <h1 class="text-3xl text-light-grey self-center">STUDENTS STATS</h1>
      <div class="flex flex-col items-center justify-center mt-4">
        <MultiCheckbox
          v-model:value="humanList"
          :options="nameAndIdArray"
        />
      </div>
    </div>
    
    <!-- STATS DISPLAY -->
        <StudentStats
          v-for="human in humanList"
          :fieldId="human.name"
          :label="human.name"
          :key="human"
          :title='human.name'
          :id='human.id'
        />
  
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import MultiCheckbox from "../../components/Multi-checkbox.vue";
import StudentStats from "../../components/StudentStats.vue";
import humanStore from "../../store/humanStore";
import { useHumanStore } from "../../store/humans";

export default {
  name: "StudentList",
  components: {
    StudentStats,
    MultiCheckbox
  },
setup() {
  // Variables
  const errorMsg = ref(null);
  const humanList = ref([]) // used in multicheckbox
  const nameAndIdArray = ref([]) // used in multicheckbox
  
  // Pinia Store
  const allHumans = useHumanStore().allHumans

  // ACTIVE STUDENTS ATTENDANCE ARRAY
  // OUTPUT --> [ {id: "441d321e5b21ee1ce143945d", name: "Joe Schmoe"}, ] 
  async function createActiveStudentsAttendanceArray() {

    const activeHumans = allHumans.filter(human => human.trainingStatus)  // currently only "active" humnas have trainingStatus
    const activeHumansIDArray = activeHumans.map(human => human._id)
    const activeStudentsNameArray = await Promise.all(  // returns array of strings
      activeHumansIDArray.map(id => {
        return humanStore.methods.getStudentName(id)
      })
    )
    
    const activeStudentsnamesAndIDsArray = activeHumansIDArray.map((id, i) => { // creates array of objects
      return {
        id: id,
        name: activeStudentsNameArray[i],
      }
    })

    // Displays ID under student's name


    const sortedNamesAndIdsArray = activeStudentsnamesAndIDsArray.sort((a, b) => {
      const firstNameA = a.name.split(" ")[0];
      const firstNameB = b.name.split(" ")[0];
      return firstNameA.localeCompare(firstNameB);
    });

    return sortedNamesAndIdsArray
  }

  // MULTI CHECKBOX
  const getNameAndIdArray = async() => {
    nameAndIdArray.value = await createActiveStudentsAttendanceArray()
  }

  onMounted(() => {
    getNameAndIdArray()
  })
  
  return {
      errorMsg,
      // MULTICHECKBOX
      humanList, nameAndIdArray
  };
},
};
</script>
