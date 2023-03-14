<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-28">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

      <div class="flex flex-col w-full py-10 justify-center">
        <i v-if="isStudent" class="self-center text-5xl not-italic">🥋</i>
        <i v-if="isAdmin" class="self-center text-5xl not-italic">🔧</i>
        <h2 class="self-center  text-xl text-light-grey">{{ humanFullName }}</h2>
        <h2 v-if="isAdmin" class="self-center text-xl text-at-faint-orange">ADMIN</h2>
      </div>

    <div class="pl-7 px-10 w-full mt-18 space-y-3">
      <!-- STUDENT ROUTES -->
      <!-- PRIVATE CLASS -->
      <div v-if="isStudent" class="pb-2 w-full self-center border-b-2 border-med-grey">
            <button :to="{ name: 'PrivateClass' }" class="text-light-grey text-xl font-normal">
              <v-icon class="pr-4 pb-1">mdi-alien</v-icon>
              <router-link :to="{ name: 'PrivateClass' }">Private Class</router-link>
            </button>
      </div>

      <!-- ADMIN ROUTES -->
      <!-- HUMAN -->
      <div v-if="isAdmin" class="pb-2 w-full self-center border-b-2 border-med-grey">
            <button :to="{ name: 'Human' }" class="text-light-grey text-xl font-normal">
              <v-icon class="pr-4 pb-1">mdi-human</v-icon>
              <router-link :to="{ name: 'Human' }">New Human</router-link>
            </button>
      </div>
      <!-- TECHNIQUE -->
      <div v-if="isAdmin" class="pb-2 w-full self-center border-b-2 border-med-grey">
            <button :to="{ name: 'Technique' }" class="text-light-grey text-xl font-normal">
              <v-icon class="pr-4 pb-1">mdi-chess-pawn</v-icon>
              <router-link :to="{ name: 'Technique' }">Technique</router-link>
            </button>
      </div>

      <!-- ALL USER ROUTES -->
      <!-- LOGOUT -->
      <div class="pb-2 w-full space-y-10 self-center border-b-2 border-med-grey">
            <button  class="text-light-grey text-xl font-normal">
              <v-icon class="pr-4 pb-1">mdi-power</v-icon>
              <router-link :to="{ name: 'Login' }" @click="logout">Log Out</router-link>
            </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logoutUser } from "../services/userService";
import { useUserStore } from '../store/user';

export default {
name: "Settings",
setup() {
  // Variables
  const router = useRouter();
  const userStore = useUserStore()
  const errorMsg = ref(null);
  const humanFullName = ref(null)
  const isAdmin = ref(null)
  const isStudent = ref(null)

  // GET NAME
  const humanName = userStore.human.name
  humanFullName.value = humanName.first + ' ' + humanName.last

  // USING PINIA
  function checkRole() {
    if (!userStore.user) {
      return
    }

    if(userStore.user.role.admin) isAdmin.value = true
    if(userStore.user.role.student) isStudent.value = true
  }
  checkRole()

  // LOGOUT
  const logout = () => {
    logoutUser() // localStorage.removeItem("BJJFocusUser");

    userStore.$reset()

    setTimeout(() => {
      router.push({ name: "Login" });
    }, 800);
  }
  
  return {
      errorMsg,
      humanFullName,
      logout,
      isAdmin, isStudent
  };
},
}
</script>
