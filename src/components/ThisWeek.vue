<template>
<div class="flex flex-col bg-dark-grey mb-2 p-3 mt-4">

  <div v-if="isStudent" class="flex flex-col px-4">
    <ul class="text-5xl uppercase space-y-1.5 leading-[2.25rem] animate-fadeIn">
      <li v-for="(el, i) in topicsArr" :key="i" @click="selectTopic(i)">
        <!-- TOPIC TITLE -->
        <h2 :class="[
          el.name === currentTopic.name ? 'text-gold' : '',
          i !== selectedTopicIndex && el.name === currentTopic.name ? 'text-gold opacity-30' : '',
          i === selectedTopicIndex && el.name !== currentTopic.name ? 'text-light-grey' : '',
          i % 2 === 1 && i !== selectedTopicIndex && el.name !== currentTopic.name ? 'text-light-grey2 opacity-70' : '',
          i % 2 === 0 && i !== selectedTopicIndex && el.name !== currentTopic.name ? 'text-med-grey3' : '',
        ]"
        >{{ el.name }}
        </h2>
        <!-- INFO UNDER TITLE -->
        
        <div
          v-if="selectedTopicIndex === i"
          :class="[
            'bg-gradient-to-r from-dark-grey to-dark-grey2 w-full ml-1 animate-fadeIn',
            selectedTopicIndex !== i && el.name !== currentTopic.name ? 'animate-fadeIn' : '',
            selectedTopicIndex === i && el.name === currentTopic.name ? 'animate-fadeIn' : ''
          ]">
          <ul class="text-base text-med-grey2 normal-case py-2 italic ml-4">
            <li
              v-if="el.name === currentTopic.name"
            >{{ el.name }} is this week's topic</li>
            <li
              v-if="el.name === nextTopic.name"
            >{{ el.name }} is next week's topic</li>
            <li
              v-if="el.name !== currentTopic.name && el.name !== nextTopic.name"
            >{{ el.name }} another week</li>
          </ul>         
        </div>
      </li>
    </ul>
  </div>
  
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
    const topicsArr = ref(focusStore.focusLessons)
    const currentTopic = ref(focusStore.topics.thisWeek);
    const nextTopic = ref(focusStore.topics.nextWeek);
    const skillsList = reactive([])
    const role = userStore.user.role
    const isTeacher = ref(null)
    const isStudent = ref(null)
    const selectedTopicIndex = ref(2);

    function setRole() {
      if (role.admin || role.teacher) {
        isTeacher.value = true
      }
      if (role.student)  {
        isStudent.value = true
      }
    }

    function selectTopic(index) {
      selectedTopicIndex.value = (selectedTopicIndex.value === index) ? -1 : index;
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
    })
    
    return {
      // TOPIC
      currentTopic, nextTopic, topicsArr, selectTopic, selectedTopicIndex,
      // SKILLS PERCENTAGES
      skillsList, isTeacher, isStudent,
    };
  }
};
</script>