<template>
<div class="flex rounded-md bg-med-grey justify-center">

  <!-- LEFT SIDE -->
  <button
    @click="changeOption('left')"
    class="self-center -ml-1 w-1/2 py-1 rounded-md text-xs font-medium"
    :class="{
      'bg-dark-grey text-white shadow-md': option === 'left',
      'bg-med-grey text-black shadow-none': option !== 'left',
    }"
  >
    {{ titleLeft }}
  </button>

  <!-- RIGHT SIDE -->
  <button
    @click="changeOption('right')"
    class="self-center -mr-1 w-1/2 py-1 rounded-md text-xs font-medium shadow-none"
    :class="{
      'bg-dark-grey text-white shadow-md': option === 'right',
      'bg-med-grey text-black shadow-none': option !== 'right',
    }"
  >
    {{ titleRight }}
  </button>

</div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'; // inject is required for the emitter (EventBus)

export default {
  name: "Switcher",
  props: {
    titleLeft: {
      type: String,
      default: "Left",
    },
    titleRight: {
      type: String,
      default: "Right",
    },
    active: {
      type: Boolean,
    }
  },
  setup(props) {
    const option = ref('left')

    // Emitter (EventBus) this section emits an event that can be listened to globally
    const emitter = inject('emitter')

    function changeOption(newOption) {
      option.value = newOption
      if(newOption === 'left') emitter.emit('switcherLeft', true)
      if(newOption === 'right') emitter.emit('switcherRight', true)
    }

    return {
      option, changeOption
    }
  }
};
</script>