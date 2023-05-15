<template>
<div class="flex rounded-md bg-med-grey justify-center relative overflow-hidden h-9">

  <!-- LEFT SIDE -->
  <button
    @click="changeOption('left')"
    class="self-center w-[47%] py-1 rounded-md text-xs font-medium absolute right-[50%] h-6"
    :class="{
      'bg-dark-grey shadow-md animate-fadeInLeft': option === 'left',
      'bg-med-grey shadow-none': option !== 'left',
    }"
  >
  </button>
  <span
    class="font-kanit z-10 absolute w-[55%] translate-y-1.5 right-[25%] pointer-events-none text-xs uppercase"
    :class="{
      'text-light-grey animate-fadeInQuick': option !== 'right',
      'text-dark-grey': option === 'right',
    }"
  >
    {{ titleLeft }}
  </span>

  <!-- RIGHT SIDE -->
  <button
    @click="changeOption('right')"
    class="self-center w-[47%] py-1 rounded-md text-xs font-medium absolute left-[50%] h-6"
    :class="{
      'bg-dark-grey shadow-md animate-fadeInRight': option === 'right',
      'bg-med-grey shadow-none': option !== 'right',
    }"
  >
  </button>
  <span
    class="font-kanit z-10 absolute w-[55%] translate-y-1.5 left-[70%] pointer-events-none text-xs uppercase"
    :class="{
      'text-light-grey animate-fadeInQuick': option === 'right',
      'text-dark-grey': option !== 'right',
    }"    
  >
    {{ titleRight }}
  </span>

</div>
</template>

<script>
import { inject, ref } from 'vue'; // inject is required for the emitter (EventBus)

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