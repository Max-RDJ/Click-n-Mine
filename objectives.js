export const objective = [
  {
    objectiveNo: 1,
    id: "stone5",
    message: "Mine 5 stone",
    complete: false,
    condition: (resources) => resources.stone >= 5,
  },
  {
    objectiveNo: 2,
    id: "stone10",
    message: "Mine 10 stone",
    complete: false,
    condition: (resources) => resources.stone >= 10,
  },
  {
    objectiveNo: 3,
    id: "sell10",
    message: "Use the slider under Resources to select 10 Stone and then click 'Sell'",
    condition: (resources, coins) => coins >= 10,
    complete: false,
    unlock: () => {
      $("#tools").css("display", "block");
    }
  },
  {
    objectiveNo: 4,
    id: "buyPickaxe",
    message: "Buy your first pickaxe",
    complete: false,
    condition: (resources, coins, hasPickaxe) => hasPickaxe === true,
    unlock: () => {
      $(".node__tier-two").css("display", "block");
    }
  },
  {
    objectiveNo: 5,
    id: "copperAndTin",
    message: "Mine 1 Copper and 1 Tin",
    complete: false,
    condition: (resources) => resources.copper >= 1 && resources.tin >= 1,
    unlock: () => {
      $("#furnaces").css("display", "block");
    }
  },
  {
    objectiveNo: 6,
    id: "buyFurnace",
    message: "Click the 'Buy furnace' button to buy a furnace once you have enough coins",
    complete: false,
    condition: (playerFurnaces) => playerFurnaces >= 1,
    unlock: () => {
      $("#resource-bronze").css("display", "block");
    }
  },
  {
    objectiveNo: 7,
    id: "smeltIngot",
    message: "Smelt your first bronze ingot by selecting Bronze from the dropdown",
    complete: false,
    condition: (resources) => resources.bronze >= 1,
    unlock: () => {
      $("#anvils").css("display", "block");
      $("#resource-bronze-med-helm").css("display", "flex");
    }
  },
  {
    objectiveNo: 8,
    id: "smithHelmet",
    message: "Craft your first Bronze Medium Helmet",
    complete: false,
    condition: (resources) => resources.bronzeMedHelm >= 1
  }
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

    $("#objective-message").text(getActiveObjectiveMessage());
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
  