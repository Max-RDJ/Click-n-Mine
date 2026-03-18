import { countCoins, resourceCounts, playerMiners, playerState } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage, updateMinerUI } from "../ui/ui-update.js";
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
  updateMinerUI();
}

let miningIntervalId = null;
let isMining = false;

const baseMiningInterval = 15000;
const minMiningInterval = 300;

function getMiningInterval() {
  return Math.max(minMiningInterval, baseMiningInterval / Math.log2(playerMiners.value + 2));
}

function getMiningPerTick(minerCount) {
  return Math.max(
    1,
    Math.floor(Math.pow(minerCount, 0.6) * MINER_CONFIG.minerMiningRate)
  );
}

export function getAvailableMiners() {
  if (!playerState.value || !playerState.value.minerAssignments) {
    return playerMiners.value;
  }

  const totalAssigned = Object.values(playerState.value.minerAssignments)
    .reduce((sum, v) => sum + v, 0);

  return playerMiners.value - totalAssigned;
}

function assignMiner(oreType) {
  if (getAvailableMiners() <= 0) return;

  playerState.value.minerAssignments[oreType]++;
  updateMinerUI();
  savePlayerProgress();
}

function unassignMiner(oreType) {
  if (playerState.value.minerAssignments[oreType] <= 0) return;

  playerState.value.minerAssignments[oreType]--;
  updateMinerUI();
  savePlayerProgress();
}

export function startMining() {
  if (isMining) return;

  isMining = true;

  const interval = getMiningInterval();

  miningIntervalId = setInterval(() => {

    Object.entries(playerState.value.minerAssignments).forEach(([oreType, count]) => {
      if (count <= 0) return;

      const amount = getMiningPerTick(count);
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
      completeObjective(
        "buyMiner",
        resourceCounts.value,
        countCoins.value,
        playerMiners
      );
    });

    node.querySelector(".assign-minus").addEventListener("click", () => {
      unassignMiner(oreType);
    });
  });
}