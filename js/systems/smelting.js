import { 
  playerFurnaces, 
  playerSmeltingRate, 
  resourceCounts, 
  countCoins 
} from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { updateDisplay, updateInfoMessage, updateFurnaceUI, updateCoinsDisplay } from "../ui/ui-update.js"

export const FURNACE_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmeltingRate: 1
};

let smeltingIntervalId = null;
let isSmelting = false;

const ingotList = [
  {
    type: "bronzeIngot",
    counter: $("#countBronzeIngot"),
    rawMaterials: { copperOre: 1, tinOre: 1 }
  },
  {
    type: "ironIngot",
    counter: $("#countIronIngot"),
    rawMaterials: { ironOre: 1 }
  },
];

export function getFurnaceCost() {
  return Math.floor(
    FURNACE_CONFIG.baseCost * Math.pow(FURNACE_CONFIG.costMultiplier, playerFurnaces.value)
  );
}

export function buyFurnace() {
  const cost = getFurnaceCost();
  if (countCoins.value < cost) {
    updateInfoMessage("You don't have enough coins.");
    return;
  }
  countCoins.value -= cost;
  playerFurnaces.value++;
  recalcSmeltingRate();

  updateCoinsDisplay();
  completeObjective("buyFurnace", playerFurnaces.value);
  updateFurnaceUI();
  updateInfoMessage("You buy a furnace.");
}

export function recalcSmeltingRate() {
  playerSmeltingRate.value = playerFurnaces.value * FURNACE_CONFIG.playerSmeltingRate;
}

const baseSmeltInterval = 3000;
const minSmeltInterval = 300;

function getSmeltInterval() {
  return Math.max(minSmeltInterval, baseSmeltInterval / Math.log2(playerFurnaces.value + 2));
}

function getSmeltPerTick() {
  return Math.max(1, Math.floor(Math.pow(playerFurnaces.value, 0.6)));
}

export function startSmelting() {
  if (isSmelting) return;

  const ingotType = document.getElementById("ingot-selection").value;
  const selectedIngot = ingotList.find(i => i.type === ingotType);
  if (!selectedIngot || playerFurnaces.value <= 0) return;

  isSmelting = true;
  document.getElementById("smelt-play").classList.add("hidden");
  document.getElementById("smelt-pause").classList.remove("hidden");

  const interval = getSmeltInterval();

  smeltingIntervalId = setInterval(() => {
    const smeltAmount = getSmeltPerTick();
    for (let i = 0; i < smeltAmount; i++) {
      let canSmelt = true;
      for (const mat in selectedIngot.rawMaterials) {
        if (resourceCounts.value[mat] < selectedIngot.rawMaterials[mat]) {
          canSmelt = false;
          break;
        }
      }
      if (!canSmelt) break;
      for (const mat in selectedIngot.rawMaterials) {
        resourceCounts.value[mat] -= selectedIngot.rawMaterials[mat];
      }
      resourceCounts.value[selectedIngot.type] = (resourceCounts.value[selectedIngot.type] || 0) + 1;
    }
    completeObjective("smeltIngot", resourceCounts.value, countCoins.value);
    updateDisplay();
  }, interval);
}

export function stopSmelting() {
  if (smeltingIntervalId !== null) {
    clearInterval(smeltingIntervalId);
    smeltingIntervalId = null;
    isSmelting = false;

    document.getElementById("smelt-pause").classList.add("hidden");
    document.getElementById("smelt-play").classList.remove("hidden");
  }
}

export function initSmeltingUI() {
  document.getElementById("smelt-play").addEventListener("click", startSmelting);
  document.getElementById("smelt-pause").addEventListener("click", stopSmelting);

  document.getElementById("ingot-selection").addEventListener("change", () => {
    if (isSmelting) {
      stopSmelting();
      startSmelting();
    }
  });
}
