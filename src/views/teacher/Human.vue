<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- NewHuman -->
    <form
      @submit.prevent="newHuman"
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
    >
      <h1 class="text-3xl text-at-light-orange mb-4 self-center">
        New Human</h1
      >

      <div class="flex flex-col mb-2">
        <label for="firstName" class="mb-1 text-sm text-at-light-orange"
          >First Name</label
        >
        <input
          type="text"
          required
          class="p-2 text-gray-500 focus:outline-none"
          id="firstName"
          v-model="firstName"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="lastName" class="mb-1 text-sm text-at-light-orange"
          >Last Name</label
        >
        <input
          type="text"
          required
          class="p-2 text-gray-500 focus:outline-none"
          id="lastName"
          v-model="lastName"
        />
      </div>

      <Button :title='buttonTitle' :color='buttonColor' />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { createHuman, getAllHumans } from "../../services/humanService";

// components import
import Button from "../../components/Button.vue";

export default {
  name: "Human",
  components: {
    Button,
  },
  setup() {
    // Variables
    const errorMsg = ref(null);
    const firstName = ref(null);
    const lastName = ref(null);
    let buttonColor = ref(null)
    let buttonTitle = ref("Save Human")

    // Button success visual feedback
    const buttonSuccess = async () => {
        buttonTitle.value = "Saving Human..."
        buttonColor.value = "orange"
        setTimeout(() => {
            buttonTitle.value = "Human Saved"
            buttonColor.value = "#33872a"
        }, 900);
        setTimeout(() => {
            buttonTitle.value = "Save Human"
            buttonColor.value = ""
        }, 2500);
    }

    // New Human function
    const newHuman = async () => {
        const allHumans = await getAllHumans()
        // Check if human already exists
        const foundHuman = allHumans.filter(human =>
            human.name.first.toLowerCase() === firstName.value.toLowerCase())[0]
            && allHumans.filter(human =>
            human.name.last.toLowerCase() === lastName.value.toLowerCase())[0];

        if (!foundHuman) {
            try {
              const res = await createHuman({
                name: {
                    first: firstName.value,
                    last: lastName.value,
                },});
                // Success button visual feedback
                if(res.status === 201) { await buttonSuccess() }
            } catch (error) {
              errorMsg.value = error.message;
                setTimeout(() => {
                  errorMsg.value = null;
                }, 5000);
            }
            return;
      }
      errorMsg.value = "Error: human with that exact name already exists in the database";
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    };

    return { firstName, lastName, errorMsg, newHuman, buttonColor, buttonTitle, buttonSuccess };
  },
};
</script>
