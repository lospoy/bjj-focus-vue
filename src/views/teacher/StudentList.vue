<template>
  <div class="max-w-screen-sm mx-auto px-4 py-5">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- STUDENT CHECKBOXES -->
    <div class="p-8 flex flex-col items-center bg-light-grey rounded-md shadow-lg mb-4">
      <h1 class="text-3xl text-at-light-orange self-center">STUDENTS STATS</h1>
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
          class="mb-4"
        />
  
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAllHumans } from "../../services/humanService"
import humanStore from "../../store/humanStore"
// components import
import StudentStats from "../../components/StudentStats.vue"
import MultiCheckbox from "../../components/Multi-checkbox.vue"

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

    // CREATE HUMAN NAMES AND IDs ARRAY -> array of objects
    // [ {name: "Juan", id: "1231228hfqinf"}, ] 
    const createNameAndIdArray = async() => {
      const allHumans = await getAllHumans()
      const allHumansIdArray = allHumans.map(human => human._id)
      const studentsNameArray = await Promise.all(  // returns array of strings
        allHumansIdArray.map(id => { 
          return humanStore.methods.getStudentName(id)
        })
      )

      const nameAndIdArray = allHumansIdArray.map((id, i) => {
        return {
          id: id,
          name: studentsNameArray[i]
        }
      })
      return nameAndIdArray
    }

    // MULTI CHECKBOX
    const getNameAndIdArray = async() => {
      nameAndIdArray.value = await createNameAndIdArray()
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
