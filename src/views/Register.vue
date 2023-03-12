<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Register -->
    <form
      @submit.prevent="register"
      class="p-8 flex flex-col bg-dark-grey rounded-md shadow-lg"
    >
      <h1 class="text-3xl text-light-grey mb-4 self-center">Register</h1>

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

      <div class="flex flex-col mb-2">
        <label for="confirmPassword" class="mb-1 text-sm text-light-grey"
          >Confirm Password</label
        >
        <input
          type="password"
          required
          class="p-2 rounded-sm bg-med-grey text-light-grey focus:outline-none"
          id="confirmPassword"
          v-model="confirmPassword"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="human" class="mb-1 text-sm text-light-grey">id</label>
        <input
          type="text"
          required
          class="p-2 rounded-sm bg-med-grey text-light-grey focus:outline-none"
          id="human"
          v-model="human"
        />
      </div>

      <Button title="Register" />

      <router-link class="text-sm mt-6 text-center text-light-grey" :to="{ name: 'Login' }">
        Already have an account? <span class="text-gold">Login</span>
      </router-link>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUser } from "../services/userService";

// components import
import Button from "../components/Button.vue";

export default {
  name: "register",
  components: {
    Button,
  },
  setup() {
    // Tools
    const router = useRouter();

    // Variables
    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const human = ref(null);
    const errorMsg = ref(null);

    // Register function
    const register = async () => {
      if (password.value === confirmPassword.value) {
        try {
          await createUser({
            email: email.value,
            password: password.value,
            human: { _id: human.value },
            role: { student: true }
          });
          router.push({ name: "Login" });
        } catch (error) {
          errorMsg.value = error.message;
          setTimeout(() => {
            errorMsg.value = null;
          }, 5000);
        }
        return;
      }
      errorMsg.value = "Error: Passwords do not match";
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    };

    return { email, password, confirmPassword, human, errorMsg, register };
  },
};
</script>
