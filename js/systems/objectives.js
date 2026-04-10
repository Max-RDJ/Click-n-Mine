import { countCoins, playerMines, playerState, playerFurnaces, resourceCounts } from "../core/state.js";
import { setObjectiveMessage, showObjectiveNotification } from "./messages.js";
import { playSound } from "../core/audio.js";
import { selectMine, renderMine } from "./mine-purchase.js";
import { playerMiners } from "../core/state.js";


export const objective = [
  {
    objectiveNo: 1,
    id: "buyMiner",
    message: "Hire a miner by clicking the shop icon in the bottom left and clicking 'Hire Miner'",
    complete: false,
    condition: () => playerMiners.value >= 1
  },
  {
    objectiveNo: 2,
    id: "assignMiner",
    message: "Assign him to a mine by hovering over the copper mine you've already got and click the + button",
    complete: false,
    condition: (playerMines) => {
      return Object.values(playerState.value.minerAssignments).some(count => count > 0);
    },
    unlock: () => {
      if (!playerMines.value.some(m => m.type === "tin")) {
        const mine = selectMine("tin");
        playerMines.value.push(mine);
        renderMine(mine);
      }
    }
  },
  {
    objectiveNo: 3,
    id: "assignMinerTin",
    message: "Here's a tin mine. Hire another miner and assign him to this mine.",
    complete: false,
    condition: () => {
      return (playerState.value.minerAssignments?.tinOre ?? 0) >= 1;
    }
  },
  {
    objectiveNo: 4,
    id: "sellOre",
    message: "Get yourself some coins by selling your ore. Right-click on the ore under Resources and click 'Sell'",
    complete: false,
    condition: () => countCoins.value > 0,
    unlock: () => {
      $("#furnaces").css("display", "block");
    }
  },
  {
    objectiveNo: 5,
    id: "buyFurnace",
    message: "Buy a furnace from the shop once you have enough coins",
    complete: false,
    condition: () => playerFurnaces.value >= 1,
    unlock: () => {
      $("#resources__ingots").removeClass("hidden")
    }
  },
  {
    objectiveNo: 6,
    id: "smeltIngot",
    message: "Smelt your first bronze ingot by opening the menu on the right and selecting Bronze in the dropdown under Furnaces",
    complete: false,
    condition: () => resourceCounts.value.bronzeIngot >= 1,
    unlock: () => {
      $("#anvils").removeClass("hidden")
      $("#resources__armour").removeClass("hidden")
      $("#resources__weapons").removeClass("hidden")
    }
  },
  {
    objectiveNo: 7,
    id: "smithHelmet",
    message: "Buy an anvil and craft your first Bronze Helmet",
    complete: false,
    condition: () => resourceCounts.value.bronzeHelm >= 1,
    unlock: () => {
      $("#miners-new").removeClass("hidden");
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

  const isComplete = obj.condition();

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
 * @returns {string}
 */
export function getActiveObjectiveMessage() {
    const activeObjective = objective.find(obj => !obj.complete);
    return activeObjective ? activeObjective.message : "All objectives completed!";
}
  