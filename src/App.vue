<template >
  <v-app>
  <div class="min-h-screen font-Poppins box-border bg-dark-grey">
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
    const isLoading = ref(false)

    //  Checks for user on page load
    if (!userLocal) {
      router.push({ name: "Login" });
    } else {
      userStore.setUserDataAndHumanID(userLocal)
      router.push({ name: "Loading" })
    }

    // Watch userStore.user for changes and update userIsLoggedIn.value
    watch(
      () => userStore,
      (newUser) => {
        // User is logging in
        // delay navbar/settings button so user cannot click until page fully loaded
        if(newUser.user.isLoggedIn === true) {
          setTimeout(() => {
            userIsLoggedIn.value = newUser.user.isLoggedIn;
          }, 2000);
        }
        // User is logging out\
        // get rid of the navbar/settings button immediately
        if(newUser.user.isLoggedIn === false) {
          userIsLoggedIn.value = newUser.user.isLoggedIn;
        }
      },
      { deep: true }
    );

    return {
      userLocal, userStore, userIsLoggedIn, isLoading
    };
  },
};
</script>