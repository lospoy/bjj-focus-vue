<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- CALENDLY -->
    <div class="flex bg-light-grey max-h-full rounded-md shadow-lg justify-center mt-10">
        <!-- Calendly inline widget begin -->
        <div
            class="flex justify-center calendly-inline-widget"
            data-url="https://calendly.com/lospoy/private-class?&hide_gdpr_banner=1&background_color=f7f7f7&text_color=3d4250&primary_color=d85a3b"
            style="display:flex;height:80vh;min-width:97%;align-items: stretch;"
            >
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
name: "privateClass",
setup() {
  // Variables
  const errorMsg = ref(null);

  // Calendly
  const recaptchaScript = document.createElement('script')
  recaptchaScript.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js')
  document.head.appendChild(recaptchaScript)

  return {
      errorMsg
  };
},
};
</script>
