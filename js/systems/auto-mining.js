import { countCoins, autoMiningRate, resourceCounts } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage, updateMinerUI } from "../ui/ui-update.js";
import { playerMiners } from "../core/state.js";
import { completeObjective } from "./objectives.js";

const MINER_CONFIG = {
  baseCost: 30,
  costMultiplier: 1.6,
  minerMiningRate: 1
};

export function getMinerCost() {
  return Math.floor(
    MINER_CONFIG.baseCost * Math.pow(MINER_CONFIG.costMultiplier, playerMiners.value)
  );
}

export function buyMiner() {
  const cost = getMinerCost();
  if (countCoins.value < cost) {
    updateInfoMessage("You don't have enough coins.");
    return;
  }
  countCoins.value -= cost;
  playerMiners.value++;

  updateCoinsDisplay();
  completeObjective(
    "buyMiner",
    resourceCounts.value,
    countCoins.value,
    playerMiners
  );
  updateMinerUI();
}

let miningIntervalId = null;
let isMining = false;

export function recalcSmeltingRate() {
  playerSmeltingRate.value = playerFurnaces.value * FURNACE_CONFIG.playerSmeltingRate;
}

const baseMiningInterval = 3000;
const minMiningInterval = 300;

function getMiningInterval() {
  return Math.max(minMiningInterval, baseMiningInterval / Math.log2(playerMiners.value + 2));
}

function getMiningPerTick() {
  return Math.max(1, Math.floor(Math.pow(playerMiners.value, 0.6)));
}

export function startMining() {
  if (isMining) return;

  const oreType = document.getElementById("mining-selection").value;
  if (!oreType || oreType === "none" || playerMiners.value <= 0) return;

  isMining = true;

  const interval = getMiningInterval();

  miningIntervalId = setInterval(() => {
    const mineAmount = getMiningPerTick();

    resourceCounts.value[oreType] += mineAmount;

    savePlayerProgress();
    updateDisplay();

  }, interval);
}

export function stopMining() {
  if (miningIntervalId !== null) {
    clearInterval(miningIntervalId);
    miningIntervalId = null;
    isMining = false;
  }
}

export function initMiningUI() {
  document.getElementById("miner-buy").addEventListener("click", buyMiner);

  document.getElementById("mining-selection").addEventListener("change", () => {
    if (isMining) {
      stopMining();
      startMining();
    }
  });
}