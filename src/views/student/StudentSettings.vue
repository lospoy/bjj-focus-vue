<template>
  <div class="max-w-screen-sm mx-auto py-5 px-3 mt-28">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

      <div class="flex flex-col w-full py-10 justify-center">
        <i class="self-center text-5xl not-italic">🥋</i>
        <h2 class="self-center  text-xl text-light-grey">{{ humanFullName }}</h2>
      </div>

    <div class="pl-7 px-10 w-full mt-18 space-y-3">
      <div class="pb-2 w-full self-center border-b-2 border-med-grey">
            <button :to="{ name: 'PrivateClass' }" class="text-light-grey text-xl font-normal">
              <v-icon class="pr-4 pb-1">mdi-alien</v-icon>
              <router-link :to="{ name: 'PrivateClass' }">Private Class</router-link>
            </button>
      </div>
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getHuman } from "../../services/humanService";
import { logoutUser } from "../../services/userService";
import store from "../../store/store";

export default {
name: "StudentSettings",
setup() {
  // Variables
  const user = JSON.parse(localStorage.getItem("BJJFocusUser"))
  const router = useRouter();
  const errorMsg = ref(null);
  const humanFullName = ref(null)

  // GET NAME
  const getHumanName = async () => {
      const res = await getHuman(user.human)
      humanFullName.value = res.name.first + ' ' + res.name.last
  }

  // Logout function
  const logout = () => {
    logoutUser();
    
    setTimeout(() => {
      store.methods.setUser(user)
    }, 200);

    setTimeout(() => {
      router.push({ name: "Login" });
    }, 800);
  }

  onMounted(() => {
    getHumanName()
  })
  
  return {
      errorMsg, user,
      humanFullName,
      logout
  };
},
}
</script>
