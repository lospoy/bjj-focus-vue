<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10 text-light-grey bg-dark-grey">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- NewHuman -->
    <form
      @submit.prevent="newHuman"
      class="p-8 flex flex-col rounded-md shadow-lg"
    >
      <h1 class="text-3xl mb-4 self-center">New Human</h1>

      <div class="flex flex-col mb-2">
        <label for="firstName" class="mb-1 text-sm">First Name</label>
        <input
          type="text"
          required
          class="p-2 focus:outline-none bg-med-grey rounded-sm"
          id="firstName"
          v-model="firstName"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="lastName" class="mb-1 text-sm">Last Name</label>
        <input
          type="text"
          required
          class="p-2 focus:outline-none bg-med-grey rounded-sm"
          id="lastName"
          v-model="lastName"
        />
      </div>

      <Button :title="buttonTitle" :color="buttonColor" />
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import Button from '../../components/Button.vue'
import { createHuman } from '../../services/humanService'

export default {
  name: 'Human',
  components: {
    Button
  },
  setup() {
    // Variables
    const errorMsg = ref(null)
    const firstName = ref(null)
    const lastName = ref(null)
    let buttonColor = ref(null)
    let buttonTitle = ref('Save Human')

    // Button success visual feedback
    const buttonSuccess = async () => {
      buttonTitle.value = 'Saving Human...'
      buttonColor.value = 'orange'
      setTimeout(() => {
        buttonTitle.value = 'Human Saved'
        buttonColor.value = '#33872a'
      }, 900)
      setTimeout(() => {
        buttonTitle.value = 'Save Human'
        buttonColor.value = ''
      }, 2500)
    }

    // New Human function
    async function newHuman() {
      try {
        const res = await createHuman({
          name: {
            first: firstName.value,
            last: lastName.value
          },
          trainingData: {
            status: { active: true }
          }
        })

        if (res.status === 201) {
          // Success button visual feedback
          await buttonSuccess()
        }
      } catch (error) {
        errorMsg.value =
          'Error: human with that exact name already exists in the database'
        setTimeout(() => {
          errorMsg.value = null
        }, 5000)
      }

      return
    }
    return {
      errorMsg,
      firstName,
      lastName,
      newHuman,
      buttonTitle,
      buttonColor
    }
  }
}
</script>
