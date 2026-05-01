import { 
  playerFurnaces, 
  playerSmeltingRate, 
  resourceCounts, 
  countCoins 
} from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { updateDisplay, updateInfoMessage, updateFurnaceUI, updateCoinsDisplay } from "../ui/ui-update.js"
import { savePlayerProgress } from "../core/save.js";
import { FURNACE_CONFIG } from "../core/config.js";

let smeltingIntervalId = null;
let isSmelting = false;

const ingotList = [
  {
    type: "bronzeIngot",
    counter: $("#count__bronze-ingot"),
    rawMaterials: { copperOre: 1, tinOre: 1 }
  },
  {
    type: "ironIngot",
    counter: $("#count__iron-ingot"),
    rawMaterials: { ironOre: 1 }
  },
];

export function getFurnaceCost() {
  return Math.floor(
    FURNACE_CONFIG.baseCost * Math.pow(FURNACE_CONFIG.costMultiplier, playerFurnaces.value)
  );
}

export function recalcSmeltingRate() {
  playerSmeltingRate.value = playerFurnaces.value.length * FURNACE_CONFIG.playerSmeltingRate;
}

const baseSmeltInterval = 3000;
const minSmeltInterval = 300;

function getSmeltInterval() {
  return Math.max(minSmeltInterval, baseSmeltInterval / Math.log2(playerFurnaces.value.length + 2));
}

function getSmeltPerTick() {
  return Math.max(1, Math.floor(Math.pow(playerFurnaces.value, 0.6)));
}

export function processFurnaceSmelt(furnace) {
  const ingotData = ingotList.find(i => i.type === furnace.selectedIngot);
  if (!ingotData) return;

  let canSmelt = true;

  for (const mat in ingotData.rawMaterials) {
    if (resourceCounts.value[mat] < ingotData.rawMaterials[mat]) {
      canSmelt = false;
      break;
    }
  }

  if (!canSmelt) return;

  for (const mat in ingotData.rawMaterials) {
    resourceCounts.value[mat] -= ingotData.rawMaterials[mat];
  }

  resourceCounts.value[ingotData.type] += 1;

  completeObjective("smeltIngot", resourceCounts.value, countCoins.value);

  updateDisplay();
  savePlayerProgress();
}

export function stopSmelting() {
  playerFurnaces.value.forEach(furnace => {
    if (furnace.intervalId) {
      clearInterval(furnace.intervalId);
      furnace.intervalId = null;
      furnace.isRunning = false;
    }
  });

  document.getElementById("smelt-pause").classList.add("hidden");
  document.getElementById("smelt-play").classList.remove("hidden");
}

