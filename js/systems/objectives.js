import { resourceCounts, playerState } from "../core/state.js";

export const objective = [
  {
    objectiveNo: 1,
    id: "buyPickaxe",
    message: "Click on the Bronze Pickaxe in the shop to purchase your first pickaxe",
    condition: (resources, coins, hasPickaxe) => hasPickaxe === true,
    complete: false,
  },
  {
    objectiveNo: 2,
    id: "copperAndTin",
    message: "Mine 1 Copper and 1 Tin",
    complete: false,
    condition: (resources) => resources.copperOre >= 1 && resources.tinOre >= 1,
    unlock: () => {
      $("#furnaces").css("display", "block");
    }
  },
  {
    objectiveNo: 3,
    id: "sellOre",
    message: "Get yourself some coins by selling your ore. Right-click on the ore under Resources and select 'Sell'",
    complete: false,
    condition: (resources, coins) => coins > 0,
  },
  {
    objectiveNo: 4,
    id: "buyFurnace",
    message: "Click the 'Buy furnace' button to buy a furnace once you have enough coins",
    complete: false,
    condition: (resources, coins, playerFurnaces) => playerFurnaces.value >= 1,
    unlock: () => {
      $("#resources__ingots").css("display", "block");
    }
  },
  {
    objectiveNo: 5,
    id: "smeltIngot",
    message: "Smelt your first bronze ingot by selecting Bronze from the dropdown — make sure you have some copper and tin!",
    complete: false,
    condition: (resources) => resources.bronzeIngot >= 1,
    unlock: () => {
      $("#anvils").css("display", "block");
      $("#resources__armour").css("display", "block");
      $("#resources__weapons").css("display", "block");
    }
  },
  {
    objectiveNo: 6,
    id: "smithHelmet",
    message: "Buy an anvil and craft your first Bronze Helmet",
    complete: false,
    condition: (resources) => resources.bronzeHelm >= 1,
    
  },
  {
    objectiveNo: 7,
    id: "gearUp",
    message: "Equip your newly crafted helmet by right-clicking on it and selecting the 'Equip' option",
    complete: false,
    condition: (resources) => playerState.value.equipment.head === "bronzeHelm",
    unlock: () => {
      $("#ascend-tab").css("display", "block");
    }
  },
  {
    objectiveNo: 8,
    id: "completeRoundOne",
    message: "Now get out there and fight",
    complete: false,
    condition: (resources) => resources.bronzeHelm >= 1,
    unlock: () => {
      $("#resource__iron-ore").css("display", "inline-flex");
    }
  },
];
  
/**
 * Utility function to check and mark objectives as complete
 * @param {string} objectiveId - ID of the objective
 * @param {object} resources - The resourceCounts object
 * @param {number} coins - Player's current coins
 * @param {boolean} hasPickaxe - Whether the player has a pickaxe
 */

export let objectivesProgress = 0;
const STORAGE_KEY = "completedObjectives";

export function loadObjectivesProgress() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  objective.forEach(obj => {
    if (stored.includes(obj.objectiveNo)) {
      obj.complete = true;
      if (obj.unlock) obj.unlock();
    }
  });

  objectivesProgress = stored.length;
}


export function completeObjective(objectiveId, resources, coins = 0, hasPickaxe = false) {
  const obj = objective.find(obj => obj.id === objectiveId);
  if (!obj) return;

  const isComplete = obj.condition(resources, coins, hasPickaxe);

  if (isComplete && !obj.complete) {
    obj.complete = true;
    objectivesProgress++;

    if (obj.unlock) obj.unlock();

    saveObjectivesProgress();

    $("#objective-message-content").text(getActiveObjectiveMessage());
  }
}

function saveObjectivesProgress() {
  const completed = objective
    .filter(o => o.complete)
    .map(o => o.objectiveNo);

  localStorage.setItem("completedObjectives", JSON.stringify(completed));
}

/**
 * Utility to get the first incomplete objective's message
 * @returns {string}
 */
export function getActiveObjectiveMessage() {
    const activeObjective = objective.find(obj => !obj.complete);
    return activeObjective ? activeObjective.message : "All objectives completed!";
}
  