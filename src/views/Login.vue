<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!--- Error handling --->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!--- Login --->
    <form
      @submit.prevent="login"
      class="p-8 flex flex-col bg-dark-grey rounded-md shadow-lg text-light-grey"
    >
      <h1 class="text-3xl text-light-grey mb-4 self-center">Login</h1>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-light-grey"
          >Email</label
        >
        <input
          type="text"
          required
          class="p-2 rounded-sm bg-med-grey text-light-grey focus:outline-none"
          id="email"
          v-model="email"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-sm text-light-grey"
          >Password</label
        >
        <input
          type="password"
          required
          class="p-2 rounded-sm bg-med-grey text-light-grey focus:outline-none"
          id="password"
          v-model="password"
        />
      </div>

      <Button :title='buttonTitle' :color='buttonColor' />

      <router-link class="text-sm mt-6 text-center" :to="{ name: 'Register' }">
        Don't have an account?
        <span class="text-gold">Sign up</span>
      </router-link>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "../components/Button.vue";
import { loginUser } from "../services/userService";
import { useUserStore } from "../store/user";

export default {
  name: "login",
  components: {
    Button,
  },
  setup() {
    const router = useRouter();
    const user = useUserStore()
    const email = ref(null);
    const password = ref(null);
    const errorMsg = ref(null);
    let buttonColor = ref(null)
    let buttonTitle = ref("Login")

    // Button success visual feedback
    function buttonSuccess() {
        buttonTitle.value = "Logging in..."
        buttonColor.value = "gold"
    }
    
    // Login function
    const login = async () => {
        // Button success visual feedback
        buttonSuccess()
      try {
        const res = await loginUser({
          email: email.value,
          password: password.value,
        });

        const userData = await res.json()
        //  If successful login:
        if(res.status === 200) {
            //  Set user data to local storage
            localStorage.setItem("BJJFocusUser", JSON.stringify(userData));

            setTimeout(() => {
              router.push({ name: "Loading" })
            }, 500);
        }
      } catch (error) {
        errorMsg.value = "Error: incorrect login";
        setTimeout(() => {
          errorMsg.value = null;
        }, 5000);
      }
    };

    return {
      errorMsg,
      buttonColor, buttonTitle, buttonSuccess,
      email, password, login, user
    };
  },
};
</script>
