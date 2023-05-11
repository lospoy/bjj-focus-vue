<template>
<div class="flex flex-col bg-dark-grey mb-2 p-3 mt-2">
  
  <template v-if="isLoading">
  <div v-if="isStudent" class="flex flex-col px-4 animate-pulse">
    <ul class="text-5xl uppercase space-y-1.5" style="line-height: 2.1rem;">
        <li v-for="(el, i) in topicsArr" :key="i"
          :class="[ i % 2 === 1 ? 'text-light-grey2 opacity-70' : 'text-med-grey3']"
        >{{ el }}</li>
      </ul>
  </div>
  </template>
  <template v-else>
  <div v-if="isStudent" class="flex flex-col px-4">
    <ul class="text-5xl uppercase space-y-1.5" style="line-height: 2.1rem;">
        <li v-for="(el, i) in topicsArr" :key="i"
          :class="[
            el === currentTopic.name ? 'text-[3.5rem] leading-10 text-gold pl-2 -ml-3 rounded-sm transition delay-500' : '',
            i % 2 === 1 && el !== currentTopic.name ? 'text-light-grey2 opacity-70' : '',
            i % 2 === 0 && el !== currentTopic.name ? 'text-med-grey3' : '',
          ]"
        >{{ el }}</li>
      </ul>
  </div>
  </template>
  
  <div v-if="isTeacher" class="flex flex-col px-4">
    <!-- TOPIC -->
    <h2 class="text-sm text-med-grey2">This week's topic is</h2>
    <h1 class="text-3xl -mt-2 text-white uppercase leading-10">{{ currentTopic.name }}</h1>
    <!-- SKILLS PERCENTAGES -->
    <div class="flex flex-col w-full">
      <div class="flex flex-col mt-2 w-full">
        <ul id="skillsList" class="-space-y-1 text-sm text-med-grey2">
            <li v-for="(item, index) of skillsList" :key="index">
              {{ item }}
            </li>
        </ul>
      </div>
      <h2 class="text-sm text-med-grey2 leading-8">Next week: {{ nextTopic.name }}</h2>
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
    const isLoading = ref(true)

    function setRole() {
      if (role.admin || role.teacher) {
        isTeacher.value = true
      }
      if (role.student)  {
        isStudent.value = true
      }
    }

    // If teacher, displays current topic skills to DOM
    function formatSkillsList(skillsObj) {
      for (const property in skillsObj) {
        if (skillsObj[property] !== 0) skillsList.push(`${property}: ${skillsObj[property]}%`)
      }
    }
    
    onMounted(async() => {
      setRole()
      formatSkillsList(focusStore.topics.thisWeek.skills)

      setTimeout(() => {
        isLoading.value = false
      }, 1000);
    })
    
    return {
      // TOPIC
      currentTopic, nextTopic, topicsArr,
      // SKILLS PERCENTAGES
      skillsList, isTeacher, isStudent,
      // LOADING
      isLoading
    };
  }
};
</script>
<style>
.text-color-animation {
  transition: color 2s;
  color: gold;
}
</style>