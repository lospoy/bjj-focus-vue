<template>
<div class="flex flex-col bg-dark-grey mb-2 p-3 mt-2">
  
  <div v-if="isStudent" class="flex flex-col px-4">
    <ul
      class="text-5xl uppercase space-y-1.5"
      style="line-height: 2.1rem;"
    >
      <li
        v-for="(el, i) in topicsArr" :key="i"
        :class="{ 'text-gold': el === currentTopic.name,
                  'text-light-grey2': i % 2 === 1 && el !== currentTopic.name,
                  'text-med-grey': i % 2 === 0 && el !== currentTopic.name }"
        >{{ el }}
      </li>
    </ul>
  </div>
  
  <div v-if="isTeacher" class="flex flex-col px-4">
    <!-- TOPIC -->
    <h2 class="text-sm mt-2 text-med-grey2">This week's topic is</h2>
    <h1 class="text-3xl text-white uppercase leading-10">{{ currentTopic }}</h1>
    <!-- SKILLS PERCENTAGES -->
    <div class="flex flex-col w-full">
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
import { useUserStore } from "../store/user";

export default {
  name: "ThisWeek",
  setup() {
    // Pinia
    const userStore = useUserStore()
    const focusStore = useFocusLessonsStore()
    const topicsArr = ref(focusStore.focusLessons.map(lesson => lesson.name))
    const currentTopic = ref(focusStore.topics.thisWeek);
    const nextTopic = ref(focusStore.topics.nextWeek);
    const skillsList = reactive([])
    const role = userStore.user.role
    const isTeacher = ref(null)
    const isStudent = ref(null)

    function setRole() {
      if (role.admin || role.teacher) {
        isTeacher.value = true
      }
      if (role.student)  {
        isStudent.value = true
      }
    }

    // If teacher, displays current topic skills to DOM
    function populateSkillsList(skillsObj) {
      for (const property in skillsObj) {
        if (skillsObj[property] !== 0) skillsList.push(`${property}: ${skillsObj[property]}%`)
      }
    }
    
    onMounted(async() => {
      setRole()
      if (isTeacher) {
        populateSkillsList(currentTopic.skills)
      }
    })

    console.log(topicsArr.value)


    return {
      // TOPIC
      currentTopic, nextTopic, topicsArr,
      // SKILLS PERCENTAGES
      skillsList, isTeacher, isStudent
    };
  }
};
</script>
