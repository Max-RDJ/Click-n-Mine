import { countCoins, minerAssignments, resourceCounts } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage, updateMinerUI } from "../ui/ui-update.js";
import { playerMiners } from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { savePlayerProgress } from "../core/save.js";

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

const baseMiningInterval = 15000;
const minMiningInterval = 300;

function getMiningInterval() {
  return Math.max(minMiningInterval, baseMiningInterval / Math.log2(playerMiners.value + 2));
}

function getMiningPerTick() {
  return Math.max(1, Math.floor(Math.pow(playerMiners.value, 0.6)));
}

export function getAvailableMiners() {
  const totalAssigned = Object.values(minerAssignments.value)
    .reduce((sum, v) => sum + v, 0);

  return playerMiners.value - totalAssigned;
}

export function assignMiner(oreType) {
  if (getAvailableMiners() <= 0) return;

  minerAssignments.value[oreType]++;
  updateMinerUI();
}

export function unassignMiner(oreType) {
  if (minerAssignments.value[oreType] <= 0) return;

  minerAssignments.value[oreType]--;
  updateMinerUI();
}

export function startMining() {
  if (isMining) return;

  isMining = true;

  const interval = getMiningInterval();

  miningIntervalId = setInterval(() => {

    Object.entries(minerAssignments.value).forEach(([oreType, count]) => {
      if (count <= 0) return;

      const amount = count;

      resourceCounts.value[oreType] += amount;
    });

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

  document.querySelectorAll(".ore-node").forEach(node => {
    const oreType = node.dataset.ore;

    node.querySelector(".assign-plus").addEventListener("click", () => {
      assignMiner(oreType);
    });

    node.querySelector(".assign-minus").addEventListener("click", () => {
      unassignMiner(oreType);
    });
  });
}