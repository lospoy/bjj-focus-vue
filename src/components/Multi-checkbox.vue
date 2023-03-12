<template>
  <div
    class="flex flex-col items-start justify-center"
  >
    <Checkbox
      v-for="option in options"
      :checked="value.includes(option)"
      @update:checked="check(option, $event)"
      :fieldId="option.name"
      :label="option.name"
      :key="option"
    />
  </div>
</template>

<script>
import Checkbox from "./Checkbox.vue";

export default {
  emits: ["update:value"],
  props: {
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        const hasNameKey = value.every((option) =>
          Object.keys(option).includes("name")
        );
        const hasIdKey = value.every((option) =>
          Object.keys(option).includes("id")
        );
        return hasNameKey && hasIdKey;
      },
    },
  },
  setup(props, context) {
    const check = (optionId, checked) => {
      let updatedValue = [...props.value];
      if (checked) {
        updatedValue.push(optionId);
      } else {
        updatedValue.splice(updatedValue.indexOf(optionId), 1);
      }
      context.emit("update:value", updatedValue);
    };

    return {
      check,
    };
  },
  components: {
    Checkbox,
  },
};
</script>
