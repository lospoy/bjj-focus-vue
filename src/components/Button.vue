<template>
  <button
    type="{{ type }}"
    class="self-center mt-6 px-20 py-1 rounded-sm text-sm font-medium text-light-grey bg-dark-grey duration-200 border-solid border-2 border-gold hover:bg-gold hover:text-dark-grey"
    :style="{ background: color}"
  >
    {{ title }}
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    title: {
      type: String,
      default: "Submit",
    },
    type: {
      type: String,
      default: "submit",
    },
    color: {
      type: String,
    },
  },
};
</script>
