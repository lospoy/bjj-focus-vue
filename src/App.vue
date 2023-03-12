<template >
  <v-app>
  <div class="min-h-screen font-Poppins box-border bg-dark-grey" >
    <Navigation />
    <BottomNav v-if="userIsLoggedIn" />
    <div>
      <router-view />
    </div>
  </div>
  </v-app>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import BottomNav from "./components/BottomNav.vue";
import Navigation from "./components/Navigation.vue";
import { useUserStore } from "./store/user";

export default {
  components: {
    BottomNav,
    Navigation
  },

  setup() {
    //  Data & variables
    const userLocal = JSON.parse(localStorage.getItem("BJJFocusUser"))
    const router = useRouter()
    const userStore = useUserStore()
    const userIsLoggedIn = ref(userStore.user.isLoggedIn);

    // Watch userIsLoggedIn for changes and update userIsLoggedIn.value
    watch(() => userStore.user.isLoggedIn, isLoggedIn => {
      userIsLoggedIn.value = isLoggedIn;
    });

    //  Checks for user on page load
    if (!userLocal) {
      router.push({ name: "Login" });
    } else {
      userStore.setUserDataAndHumanID(userLocal)
      if(userStore.user.role.admin) {
        router.push({ name: "Overview" });
      }
      if(userStore.user.role.student) {
        router.push({ name: "StudentHome" });
      }
    }

    return {
      userLocal, userStore, userIsLoggedIn
    };
  },
};
</script>