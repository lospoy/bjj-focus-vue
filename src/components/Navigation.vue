<template>
  <header class="bg-dark-grey text-white max-w-sm">
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
          size="x-small"
          class="bg-med-grey3 capitalize"
          >
          <span class="justify-end text-light-grey">{{ humanName }}</span>
        </v-btn>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import { useUserStore } from "../store/user";

export default defineComponent ({
name: "Navigation",
setup() {
  const userStore = useUserStore()
  const humanName = userStore.human.name.first

  return {
    humanName
  }
}

})
</script>