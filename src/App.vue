<template >
  <v-app>
  <div class="min-h-screen font-Poppins box-border bg-dark-grey">
    <NavigationTop />
    <NavigationBottom v-if="userIsLoggedIn" />
    <div>
      <router-view />
    </div>
  </div>
  </v-app>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import NavigationBottom from "./components/NavigationBottom.vue";
import NavigationTop from "./components/NavigationTop.vue";
import { useUserStore } from "./store/user";

export default {
  components: {
    NavigationBottom,
    NavigationTop
  },

  setup() {
    //  Data & variables
    const userLocal = JSON.parse(localStorage.getItem("BJJFocusUser"))
    const router = useRouter()
    const userStore = useUserStore()
    const userIsLoggedIn = ref(userStore.user.isLoggedIn);

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
          userIsLoggedIn.value = newUser.user.isLoggedIn;
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
      userLocal, userStore, userIsLoggedIn
    };
  },
};
</script>