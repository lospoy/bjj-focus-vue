<template>
  <input
    @input="(event) => $emit('update:checked', event.target.checked)"
    type="Checkbox"
    :checked="checked"
    :id="fieldId"
    class="mr-2 hidden"
  />
  <label
    :for="fieldId"
    class="flex flex-row items-center font-bold text-light-grey cursor-pointer select-none"
  >
    <i
      class="fa mr-2"
      :class="{
        'fa-check-square text-gold rounded': checked,
        'fa-square text-light-grey rounded': !checked,
      }"
    ></i>
    {{ label }}
  </label>
</template>

<script>
export default {
  props: {
    label: String,
    fieldId: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
    },
  },
};
</script>

<style>
</style>
