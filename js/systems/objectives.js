import { playerState } from "../core/state.js";
import { setObjectiveMessage, showObjectiveNotification } from "./messages.js";
import { playSound } from "../core/audio.js";


export const objective = [
  {
    objectiveNo: 1,
    id: "copperAndTin",
    message: "Mine 1 Copper and 1 Tin by clicking the rocks in the Mineshaft",
    complete: false,
    condition: (resources) => resources.copperOre >= 1 && resources.tinOre >= 1,
    unlock: () => {
      $("#furnaces").css("display", "block");
    }
  },
  {
    objectiveNo: 2,
    id: "sellOre",
    message: "Get yourself some coins by selling your ore. Right-click on the ore under Resources and select 'Sell'",
    complete: false,
    condition: (resources, coins) => coins > 0,
  },
  {
    objectiveNo: 3,
    id: "buyFurnace",
    message: "Click the 'Buy furnace' button to buy a furnace once you have enough coins",
    complete: false,
    condition: (resources, coins, playerFurnaces) => playerFurnaces.value >= 1,
    unlock: () => {
      $("#resources__ingots").removeClass("hidden")
    }
  },
  {
    objectiveNo: 4,
    id: "smeltIngot",
    message: "Smelt your first bronze ingot by selecting Bronze from the dropdown — make sure you have some copper and tin!",
    complete: false,
    condition: (resources) => resources.bronzeIngot >= 1,
    unlock: () => {
      $("#anvils").removeClass("hidden")
      $("#resources__armour").removeClass("hidden")
      $("#resources__weapons").removeClass("hidden")
    }
  },
  {
    objectiveNo: 5,
    id: "smithHelmet",
    message: "Buy an anvil and craft your first Bronze Helmet",
    complete: false,
    condition: (resources) => resources.bronzeHelm >= 1,
    
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
    flashObjectivesIcon();
    setObjectiveMessage(getActiveObjectiveMessage());
    updateObjectiveDrawer();
    showObjectiveNotification();
    playSound("objective_update")
  }
}

export function updateObjectiveDrawer() {
  const el = document.getElementById("objective-message-content");
  if (!el) return;
  el.textContent = getActiveObjectiveMessage();
}

function flashObjectivesIcon() {
  const icon = document.getElementById("objectives-tab");
  if (!icon) return;

  icon.classList.remove("flash");
  void icon.offsetWidth;

  icon.classList.add("flash");

  setTimeout(() => {
    icon.classList.remove("flash");
  }, 1500);
}

export function clearObjectivesAlert() {
  const icon = document.getElementById("objectives-tab");
  if (!icon) return;

  icon.classList.remove("flash");
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
  