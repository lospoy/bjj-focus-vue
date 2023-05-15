<template>
<div class="flex flex-col bg-dark-grey mb-2 p-3 mt-4">

  <div v-if="isStudent" class="flex flex-col px-4">
    <ul class="text-5xl uppercase space-y-1.5 leading-8 animate-fadeIn">
      <li v-for="(el, i) in topicsArr" :key="i" @click="selectTopic(i)">
        <!-- TOPIC TITLE -->
        <h2
          class="tracking-tight font-kanit"
          :class="[
          i === selectedTopicIndex && el.name === currentTopic.name ? 'text-gold' : '',
          i !== selectedTopicIndex && el.name === currentTopic.name ? 'text-gold opacity-40' : '',
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
            'w-full ml-1 -mt-2 animate-fadeIn',
            selectedTopicIndex === i && el.name === currentTopic.name ? 'animate-fadeIn' : ''
          ]">
          <ul class="text-base text-med-grey2 normal-case py-2 italic ml-4">
            <li>{{ getTopicDate(weeksToTopic(i))}}</li>
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
    const currentTopicIndex = ref(getCurrentTopicIndex());
    const nextTopic = ref(focusStore.topics.nextWeek);
    const skillsList = reactive([])
    const role = userStore.user.role
    const isTeacher = ref(null)
    const isStudent = ref(null)
    const selectedTopicIndex = ref(currentTopicIndex);
    const selectedTopicLesson = ref(currentTopic)
    
    // Calculates how many weeks to or from topic since one topic per week
    function weeksToTopic(index) {
      const currentTopicIndex = getCurrentTopicIndex()
      const weeksDiff = index - currentTopicIndex

      if (weeksDiff === 0) return 0;
      if (weeksDiff === 1) return +1;
      if (weeksDiff === -1) return -1;
      if (weeksDiff <= -2) return weeksDiff + 8

      return weeksDiff
    }

    function getTopicDate(numWeeks) {
      if (numWeeks === 0) {
        return "⬑ this week's topic";
      } else if (numWeeks === 1) {
        return "⬑ next week's topic";
      } else if (numWeeks === -1) {
        return "⬑ last week's topic";
      } else {
        const today = new Date();
        const tuesdayOffset = (2 - today.getDay() + 7) % 7;
        const nextTuesday = new Date(today.getTime() + tuesdayOffset * 864e5);
        const targetTuesday = new Date(nextTuesday.getTime() + (numWeeks) * 7 * 864e5);
        const tuesdayDate = targetTuesday.toLocaleDateString();
        return `⬑ studying on ${tuesdayDate}`;
      }
    };

    function setRole() {
      if (role.admin || role.teacher) {
        isTeacher.value = true
      }
      if (role.student)  {
        isStudent.value = true
      }
    }

    function getCurrentTopicIndex() {
      const thisWeekId = focusStore.topics.thisWeek.id;
      const focusLessonIndex = focusStore.focusLessons.findIndex(lesson => lesson.id === thisWeekId);
      return focusLessonIndex;
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
      currentTopic, nextTopic, topicsArr, selectTopic,
      selectedTopicIndex, selectedTopicLesson, weeksToTopic, getTopicDate,
      // SKILLS PERCENTAGES
      skillsList, isTeacher, isStudent,
    };
  }
};
</script>