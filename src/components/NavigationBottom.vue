<template>

  <!-- STUDENT NAV -->
  <v-bottom-navigation density="compact" v-if="isStudent" class="bg-med-grey text-light-grey animate-fadeIn">
    <v-btn value="home" :to="{ name: 'StudentHome' }">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn value="chartsView" :to="{ name: 'ChartsView' }">
      <v-icon>mdi-chart-box-outline</v-icon>
    </v-btn>
    <v-btn value="studentCalendarView" :to="{ name: 'StudentCalendarView' }">
      <v-icon>mdi-calendar-multiselect</v-icon>
    </v-btn>
  </v-bottom-navigation>

  <!-- ADMIN NAV -->
  <v-bottom-navigation density="compact" v-if="isAdmin" class="bg-gold text-dark-grey animate-fadeIn">
    <v-btn value="overview" :to="{ name: 'Overview' }">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn value="studentList" :to="{ name: 'StudentList' }">
      <v-icon>mdi-account-details</v-icon>
    </v-btn>
    <v-btn value="session" :to="{ name: 'Session' }">
      <v-icon>mdi-calendar-plus</v-icon>
    </v-btn>
  </v-bottom-navigation>

</template>

<script>
import { onBeforeMount, ref } from "vue";
import { logoutUser } from '../services/userService';
import { useUserStore } from "../store/user";

export default {
name: "NavigationBottom",

setup() {
  // VARIABLES
  const isAdmin = ref(null)
  const isStudent = ref(null)
  const userStore = useUserStore()

  // Logout function
  const logout = async () => {
    logoutUser();
    setTimeout(() => {
      router.push({ name: "Login" });
    }, 700);
  };

  // USING PINIA
  function checkRole() {
    if (!userStore.user) {
      return
    }

    setTimeout(() => {
      if(userStore.user.role.admin) isAdmin.value = true
      if(userStore.user.role.student) isStudent.value = true
    }, 2000);
  }

  onBeforeMount(() => {
    checkRole()
  })

  return {
    logout,
    isAdmin, isStudent
  };
},

};
</script>