<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- NewTechnique -->
    <form
      @submit.prevent="newTechnique"
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
    >
      <h1 class="text-3xl text-at-light-orange mb-4 self-center">
        New Technique</h1
      >

      <div class="flex flex-col mb-2">
        <label for="position" class="mb-1 text-sm text-at-light-orange"
          >Position</label
        >
        <input
          type="text"
          required
          class="p-2 text-gray-500 focus:outline-none"
          id="position"
          v-model="position"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="move" class="mb-1 text-sm text-at-light-orange"
          >Move</label
        >
        <div class="flex-row">
            <input
              type="text"
              required
              class="p-2 text-gray-500 focus:outline-none w-4/6"
              id="move"
              v-model="move"
            />
            <select
              required
              class="p-2 text-gray-500 focus:outline-none w-2/6"
              id="moveCategory"
              v-model="moveCategory"
            >
            <option :value="passOption">Pass</option>
            <option :value="entryOption">Entry</option>
            <option :value="escapeOption">Escape</option>
            <option :value="submissionOption">Submission</option>
            <option :value="sweepOption">Sweep</option>
            <option :value="takedownOption">Takedown</option>
            </select>
        </div>
      </div>

      <div class="flex flex-col mb-2">
        <label for="variation" class="mb-1 text-sm text-at-light-orange"
          >Variation</label
        >
        <input
          type="text"
          class="p-2 text-gray-500 focus:outline-none"
          id="variation"
          v-model="variation"
          placeholder="Standard"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="notes" class="mb-1 text-sm text-at-light-orange"
          >Notes</label
        >
        <input
          type="text"
          class="p-2 text-gray-500 focus:outline-none"
          id="notes"
          v-model="notes"
        />
      </div>

      <Button :title='buttonTitle' :color='buttonColor' />
    </form>
  </div>

    <div class="max-w-screen-sm mx-auto px-4 py-10">
        <div class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
            <h2 class="text-2xl text-at-light-orange mb-4 self-center">
            All Techniques</h2
            >
            <div class="flex flex-col mb-2">
                <label for="passList" class="mb-1 text-at-light-orange"
                >Pass</label
                >
                <ul id="passList">
                    <li v-for="(item, index) of passList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mb-2">
                <label for="entryList" class="mb-1 text-at-light-orange"
                >Entry</label
                >
                <ul id="entryList">
                    <li v-for="(item, index) of entryList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mb-2">
                <label for="escapeList" class="mb-1 text-at-light-orange"
                >Escape</label
                >
                <ul id="escapeList">
                    <li v-for="(item, index) of escapeList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mb-2">
                <label for="submissionList" class="mb-1 text-at-light-orange"
                >Submission</label
                >
                <ul id="submissionList">
                    <li v-for="(item, index) of submissionList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mb-2">
                <label for="sweepList" class="mb-1 text-at-light-orange"
                >Sweep</label
                >
                <ul id="sweepList">
                    <li v-for="(item, index) of sweepList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

            <div class="flex flex-col mb-2">
                <label for="takedownList" class="mb-1 text-at-light-orange"
                >Takedown</label
                >
                <ul id="takedownList">
                    <li v-for="(item, index) of takedownList" :key="index">
                        - {{ item }}
                    </li>
                </ul>
            </div>

        </div>
        
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { createTechnique, getAllTechniques } from "../../services/bjj_services/techniqueService";
import { createPosition, getAllPositions, getPosition } from "../../services/bjj_services/positionService";
import { createMove, getAllMoves, getMove } from "../../services/bjj_services/moveService";
import { createVariation, getAllVariations, getVariation } from "../../services/bjj_services/variationService";

// components import
import Button from "../../components/Button.vue";

export default {
  name: "technique",
  components: {
    Button,
  },
  setup() {
    // Option variables (serialized)
    const passOption = JSON.stringify({ pass: true })
    const entryOption = JSON.stringify({ entry: true })
    const escapeOption = JSON.stringify({ escape: true })
    const submissionOption = JSON.stringify({ submission: true })
    const sweepOption = JSON.stringify({ sweep: true })
    const takedownOption = JSON.stringify({ takedown: true })

    // Variables
    const errorMsg = ref(null);
    const position = ref(null);
    let positionId = ref('')
    const move = ref(null);
    let moveId = ref('')
    const moveCategory = ref(null)
    const variation = ref(null);
    let variationId = ref('')
    const notes = ref(null)

    // All Techniques
    const techniqueList = reactive([])
    const passList = reactive([])
    const entryList = reactive([])
    const escapeList = reactive([])
    const submissionList = reactive([])
    const sweepList = reactive([])
    const takedownList = reactive([])
    

    // **********************************************************************************************
    //                                       RENDER STORED TECHNIQUES
    // **********************************************************************************************
    const showAllTechniques = async() => {
        const allTechniques = await getAllTechniques()
        
        for await (const technique of allTechniques) {
            await decryptTechnique(technique.position, technique.move, technique.variation)
        }
    }
    showAllTechniques()

    const decryptTechnique = async(positionId, moveId, variationId) => {
        const positionObject = await getPosition(positionId)
        const moveObject = await getMove(moveId)
        const variationObject = await getVariation(variationId)

        if(moveObject.category.pass === true) {
            passList.push(`${variationObject.name.english} ${moveObject.name.english} Pass from ${positionObject.name.english}`)
        }

        if(moveObject.category.entry === true) {
           entryList.push(`${variationObject.name.english} Entry ${moveObject.name.english} from ${positionObject.name.english}`)
        }

        if(moveObject.category.escape === true) {
           escapeList.push(`${variationObject.name.english} ${moveObject.name.english} Escape from ${positionObject.name.english}`)
        }

        if(moveObject.category.submission === true) {
           submissionList.push(`${variationObject.name.english} ${moveObject.name.english} from ${positionObject.name.english}`)
        }

        if(moveObject.category.sweep === true) {
           sweepList.push(`${variationObject.name.english} ${moveObject.name.english} Sweep from ${positionObject.name.english}`)
        }

        if(moveObject.category.takedown === true && positionObject.name.english === "Standing") {
            takedownList.push(`${variationObject.name.english} ${moveObject.name.english} Takedown`)
        } else if (moveObject.category.takedown === true) {
            takedownList.push(`${variationObject.name.english} ${moveObject.name.english} Takedown from ${positionObject.name.english}`)
        }
    }
    
    // Button success visual feedback
    let buttonColor = ref(null) 
    let buttonTitle = ref("Save Technique")

    const buttonSuccess = async () => {
        buttonTitle.value = "Saving Technique..."
        buttonColor.value = "orange"
        setTimeout(() => {
            buttonTitle.value = "Technique Saved"
            buttonColor.value = "#33872a"
        }, 600);
        setTimeout(() => {
            buttonTitle.value = "Save Technique"
            buttonColor.value = ""
        }, 2200);
    }

    // **********************************************************************************************
    //                                       POSITION
    // **********************************************************************************************
    const newPosition = async () => {
        const allPositions = await getAllPositions()

        const foundPosition = allPositions.filter(x =>
            x.name.english.toLowerCase() === position.value.toLowerCase())[0]

        if(foundPosition) {
            positionId = foundPosition._id // if found, assign id to global variable
            return positionId
        }
        
        if (!foundPosition) {
            try {
              const res = await createPosition({ name: { english: position.value }});
              if(res.status === 201) { await buttonSuccess() } // Success button visual feedback
              const jsonRes = await res.json()  // get the response object
              positionId = jsonRes._id // assign _id to global variable
              return positionId
            } catch (error) {
            //   no need for error catching since this view only saves new techniques
            //  if a position already exists, the user does not need to know on this page
            }
            return;
        }
    }

    // **********************************************************************************************
    //                                       MOVE
    // **********************************************************************************************
    const newMove = async () => {
        const allMoves = await getAllMoves()
        // Check if move already exists
        const foundMove = allMoves.filter(x =>
            x.name.english.toLowerCase() === move.value.toLowerCase())[0]

        if(foundMove) {
            moveId = foundMove._id // if found, assign id to global variable
            return moveId
        }
        
        if (!foundMove) {
            try {
              const res = await createMove({
                name: { english: move.value },
                category: JSON.parse(moveCategory.value)
              });
              if(res.status === 201) { await buttonSuccess() } // Success button visual feedback
              const jsonRes = await res.json()  // get the response object
              moveId = jsonRes._id // assign _id to global variable
              return moveId
            } catch (error) {
            //   no need for error catching since this view only saves new techniques
            //  if a move already exists, the user does not need to know on this page
            }
            return;
        }
    }

    // **********************************************************************************************
    //                                       VARIATION
    // **********************************************************************************************
    const newVariation = async () => {
        // Set default value
        if (variation.value === null) {
            variation.value = "Standard"
        }

        const allVariations = await getAllVariations()
        // Check if variation already exists
        const foundVariation = allVariations.filter(x =>
            x.name.english.toLowerCase() === variation.value.toLowerCase())[0]

        if(foundVariation) {
            variationId = foundVariation._id // if found, assign id to global variable
            return variationId
        }
        
        if (!foundVariation) {
            try {
              const res = await createVariation({
                name: { english: variation.value },
              });
              if(res.status === 201) { await buttonSuccess() } // Success button visual feedback
              const jsonRes = await res.json()  // get the response object
              variationId = jsonRes._id // assign _id to global variable
              return variationId
            } catch (error) {
            //   no need for error catching since this view only saves new techniques
            //  if a variation already exists, the user does not need to know on this page
            }
            return;
        }
    }

    // creating a new technique means creating a new COMBINATION of POSITION, MOVE, and VARIATION
    // either position, move, or variation may or may not exist in database already

    // if Technique found, then we get a technique id
    // if Technique not found:
    // 1. Look for position that was entered in the form:
    //      1.a. if found we get a position id
    //      1.b. if not found => createPosition() and return position id
    // 2. Look for move that was entered in the form:
    //      2.a. if found we get a position id
    //      2.b. if not found => createMove() and return move id
    // 3. Look for variation that was entered in the form:
    //      3.a. if found we get a position id
    //      3.b. if not found => createVariation() and return variation id
    // then with { position: _id, move: _id, variation: _id } => createTechnique()

    // **********************************************************************************************
    //                                       TECHNIQUE
    // **********************************************************************************************
    const newTechnique = async () => {
        console.log("position id is: " + await newPosition())
        console.log("move id is: " + await newMove())
        console.log("variation id is: " + await newVariation())

        positionId = await newPosition()
        moveId = await newMove()
        variationId = await newVariation()
        
        const allTechniques = await getAllTechniques()
        // Check if technique already exists
        const foundTechnique = allTechniques.filter(a =>
            a.position === positionId)[0]
            && allTechniques.filter(b =>
            b.move === moveId)[0]
            && allTechniques.filter(c =>
            c.variation === variationId)[0];

        if (!foundTechnique) {
            try {
              // These values should all be ids
              const res = await createTechnique({
                position: positionId,
                move: moveId,
                variation: variationId,
                notes: notes.value
              });
              if(res.status === 201) { await buttonSuccess() } // Success button visual feedback
            } catch (error) {
              errorMsg.value = error.message;
                setTimeout(() => {
                  errorMsg.value = null;
                }, 5000);
            }
            return;
      }
      errorMsg.value = "Technique already exists";
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    }

    return {
        position, positionId, move, moveId, moveCategory, variation, variationId, notes,
        passOption, entryOption, escapeOption, submissionOption, sweepOption, takedownOption,
        techniqueList, showAllTechniques, getMove, getPosition, getVariation, decryptTechnique,
        passList, entryList, escapeList, submissionList, sweepList, takedownList,
        errorMsg, buttonColor, buttonTitle, buttonSuccess,
        newPosition, newMove, newVariation, newTechnique
    };
  },
};
</script>
