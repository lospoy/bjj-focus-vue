<template>
  <div class="max-w-screen-sm mx-auto py-5 px-1 grid place-items-center h-[80vh]">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div class="flex flex-col">
      <ThisWeek />
    </div>
  
  </div>
</template>

<script>
import { ref } from 'vue';
import ThisWeek from '../../components/ThisWeek.vue';
import { useFocusLessonsStore } from '../../store/focusLessons';

export default {
  name: "studentHome",
  components: {
    ThisWeek,
  },
  setup() {
    const errorMsg = ref(null);

    useFocusLessonsStore().getLessonByID('634ed31717260c95e351de8d')
    return {
        errorMsg,
    };
  },
};
</script>
