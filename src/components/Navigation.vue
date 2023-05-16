<template>
  <header>
    <nav class="flex py-3 px-4 sm:flex-row items-center justify-between">
      <div class="flex items-center w-full">
        <a href="http://www.bjjfocus.com" class="flex-initial">
          <img class="w-28" src="../assets/vector/default-gold-white.svg" alt="bjj focus logo"/>
        </a>
        <span class="flex-grow"></span>

        <v-btn
          v-if="userIsLoggedIn"
          value="Settings" :to="{ name: 'Settings' }"
          size="small"
          class="bg-med-grey3 capitalize animate-fadeIn min-h-28"
          >
          <v-icon class="text-light-grey">mdi-account</v-icon>
          <span class="justify-end text-light-grey px-0.5">{{ humanName }}</span>
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
props: {
  loaded: {
    type: Boolean
  }
},
setup() {
  const userStore = useUserStore()
  const userIsLoggedIn = ref(false);
  const humanName = ref('');
  const greeting = ref(true);
  const button = ref(false);

  // Watch userStore.user for changes and update userIsLoggedIn.value
  watch(
    () => userStore,
    (newUser) => {
      humanName.value = newUser.human.name.first
      setTimeout(() => {
        userIsLoggedIn.value = newUser.user.isLoggedIn;
      }, 800);
    },
    { deep: true }
  );

  return {
    humanName,
    userIsLoggedIn, greeting, button
  }
}

})
</script>