<template>
<div class="flex flex-col bg-dark-grey mb-2 p-3 mt-2">
  <div class="flex flex-col px-4">

    <!-- TOPIC -->
    <h2 class="text-sm mt-2 text-med-grey2">This week's topic is</h2>
    <h1 class="text-5xl text-white uppercase leading-10">{{ currentTopic }}</h1>

    <!-- SKILLS PERCENTAGES -->
    <div class="flex flex-col w-full" v-if="isTeacher">
      <div class="flex flex-col mt-2 w-full">
        <ul id="skillsList" class="-space-y-2">
            <li v-for="(item, index) of skillsList" :key="index">
              <span class="text-med-grey2 text-sm">{{ item }}</span>
            </li>
        </ul>
      </div>
      <h2 class="text-xs text-med-grey2 leading-8">Next week: {{ nextTopic }}</h2>
    </div>

  </div>
</div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useFocusLessonsStore } from '../store/focusLessons';
import { useTrainingStore } from "../store/training";
import { useUserStore } from "../store/user";

export default {
  name: "ThisWeek",
  setup() {
    const userStore = useUserStore()
    const trainingStore = useTrainingStore()
    const focusLessonStore = useFocusLessonsStore()
    const currentTopic = ref(null);
    const nextTopic = ref(null)
    const skillsList = reactive([])
    const isTeacher = ref(null)
    const isStudent = ref(null)
    const role = userStore.user.role

    function setRole() {
      if (role.admin || role.teacher) {
        isTeacher.value = true
      }
      if (role.student)  {
        isStudent.value = true
      }
    }

    // **************  CURRENT & NEXT TOPIC **************
    // One topic per week
    // Displayed in this order
    const weeklyTopicList = [
        {"Back Control": "63476ca77c0c4048382acb04"},
        {"Half Guard": "634ed31717260c95e351de8d"},
        {"Closed Guard": "634ed77517260c95e351dfa3"},
        {"De la Riva": "634edb2337829d81a79048ab"},
        {"Open Guard": "638eaab8964f267814d40a89"},
        {"Side Control": "634ed53c17260c95e351decb"},
        {"Mount": "634ecefa9f04894fb818c868"},
        {"Turtle": "638ead84964f267814d40ad7"},
    ]

    // Gets the week number we are currently on since the startDate
    const currentWeekNumber = _ => {
         // Day the classes started
        const startDate = new Date("September 12, 2022 00:00:00")
        const endDate = new Date()
        const diffInMs = new Date(endDate) - new Date(startDate)
        const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24 ) / 7;

        return diffInWeeks
    }

    // Using modulus to "loop back" to index 0 after reaching last index
    const currentTopicArrayIndex = Math.floor(currentWeekNumber() % 8)
    const nextTopicArrayIndex = Math.floor(((currentWeekNumber() +1) % 8))

    // Current Topic variables
    const currentTopicObject = weeklyTopicList[currentTopicArrayIndex]
    const currentTopicName = Object.keys(currentTopicObject)[0]
    const currentTopicId = Object.values(currentTopicObject)[0]

    // Next Topic variables
    const nextTopicObject = weeklyTopicList[nextTopicArrayIndex]
    const nextTopicName = Object.keys(nextTopicObject)[0]
    const nextTopicId = Object.values(nextTopicObject)[0]

    // Assigning values to variables
    currentTopic.value = currentTopicName
    nextTopic.value = nextTopicName

    // Setting thisWeek topic to training store
    setTimeout(() => {
      trainingStore.setThisWeeksTopic(currentTopicObject)
    }, 1000);
    


    // **************  SKILLS PERCENTAGES **************
    function getSkills(focusLessonId) {
      const allFocusLessons = focusLessonStore.focusLessons
      const thisWeeksLesson = allFocusLessons.filter(lesson => JSON.stringify(lesson).includes(focusLessonId))[0]
      return thisWeeksLesson.skills
    }

    function populateSkillsList(skillsObject) {
      for (const property in skillsObject) {
        if (skillsObject[property] !== 0) skillsList.push(`${property}: ${skillsObject[property]}%`)
      }
    }
    
    onMounted(async() => {
      setRole()
      try {
        if (role.admin || role.teacher) {
          const currentTopicSkills = getSkills(currentTopicId)
          populateSkillsList(currentTopicSkills)
        }
      } catch (error) {
        console.log(error)
      }
    })

    return {
      // TOPIC
      currentTopic, nextTopic,
      // SKILLS PERCENTAGES
      skillsList, isTeacher, isStudent
    };
  }
};
</script>
