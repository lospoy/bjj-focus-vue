// Used in @components/StudentStats.vue
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFocusLessonsStore = defineStore('focusLessons', () => {
  const focusLessons = ref([
    {  
      name: "Back Control",
      id: "63476ca77c0c4048382acb04"
    },
    {  
      name: "Half Guard",
      id: "634ed31717260c95e351de8d"
    },
    {  
      name: "Side Control",
      id: "634ed53c17260c95e351decb"
    },
    {  
      name: "Closed Guard",
      id: "634ed77517260c95e351dfa3"
    },
    {  
      name: "Mount",
      id: "634ecefa9f04894fb818c868"
    },
    {  
      name: "De La Riva",
      id: "634edb2337829d81a79048ab"
    },
    {  
      name: "Open Guard",
      id: "638eaab8964f267814d40a89"
    },
    {  
      name: "Turtle",
      id: "638ead84964f267814d40ad7"
    },
  ])

  function setFocusLessons(payload) {
    if(!payload) { return focusLessons.value = null }
    focusLessons.value = [
      {  
        name: "Back Control",
        id: "63476ca77c0c4048382acb04",
        skills: payload[0].skills,
        techniqueIDs: payload[0].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Half Guard",
        id: "634ed31717260c95e351de8d",
        skills: payload[2].skills,
        techniqueIDs: payload[2].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Closed Guard",
        id: "634ed77517260c95e351dfa3",
        skills: payload[4].skills,
        techniqueIDs: payload[4].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "De La Riva",
        id: "634edb2337829d81a79048ab",
        skills: payload[5].skills,
        techniqueIDs: payload[5].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Open Guard",
        id: "638eaab8964f267814d40a89",
        skills: payload[6].skills,
        techniqueIDs: payload[6].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Side Control",
        id: "634ed53c17260c95e351decb",
        skills: payload[3].skills,
        techniqueIDs: payload[3].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Mount",
        id: "634ecefa9f04894fb818c868",
        skills: payload[1].skills,
        techniqueIDs: payload[1].content.techniques.map(obj => obj._id) 
      },
      {  
        name: "Turtle",
        id: "638ead84964f267814d40ad7",
        skills: payload[7].skills,
        techniqueIDs: payload[7].content.techniques.map(obj => obj._id) 
      },
    ]
  }

  return {
    focusLessons, setFocusLessons
  }
})