<template>
  <header>
    <nav
      class="flex py-3 px-4 sm:flex-row items-center justify-between"
    >
      <div class="flex items-center w-full">
        <a href="http://www.bjjfocus.com" class="flex-initial">
            <img class="w-28" src="../assets/vector/default-gold-white.svg" alt="bjj focus logo"/>
        </a>
        <span class="flex-grow"></span>
        <v-btn
          value="Settings" :to="{ name: 'Settings' }"
          size="small"
          class="bg-med-grey3 capitalize"
          v-if="userIsLoggedIn"
          >
          <span class="justify-end text-light-grey">{{ humanName }}</span>
          <v-icon class="text-light-grey">
            mdi-account
          </v-icon>
        </v-btn>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useUserStore } from "../store/user";

export default defineComponent ({
name: "Navigation",
setup() {
  const userStore = useUserStore()
  const userIsLoggedIn = ref(userStore.user.isLoggedIn);
  const humanName = ref('');

  // Watch userStore.user for changes and update userIsLoggedIn.value
  watch(
    () => userStore,
    (newUser) => {
      userIsLoggedIn.value = newUser.user.isLoggedIn;
      humanName.value = newUser.human.name.first
    },
    { deep: true }
  );

  return {
    humanName,
    userIsLoggedIn
  }
}

})
</script>