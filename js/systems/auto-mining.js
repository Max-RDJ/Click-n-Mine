import { countCoins, resourceCounts, playerMiners, playerState } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage, updateMinerUI } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";
import { savePlayerProgress } from "../core/save.js";
import { MINER_CONFIG } from "../core/config.js";


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
  completeObjective(
    "buyMiner",
    resourceCounts.value,
    countCoins.value,
    playerMiners
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
  completeObjective(
    "assignMiner",
    resourceCounts.value,
    countCoins.value,
    playerMiners
  );
  completeObjective(
    "assignMinerTin",
    resourceCounts.value,
    countCoins.value,
    playerMiners
  );
}

function unassignMiner(oreType) {
  if (playerState.value.minerAssignments[oreType] <= 0) return;
  playerState.value.minerAssignments[oreType]--;
  updateMinerUI();
  savePlayerProgress();
}

let miningIntervalId = null;
let isMining = false;

export function startMining() {
  if (isMining) return;

  isMining = true;

  miningIntervalId = setInterval(() => {
    Object.entries(playerState.value.minerAssignments).forEach(([oreType, count]) => {
      if (count <= 0) return;

      resourceCounts.value[oreType] += count;
    });

    updateDisplay();
    savePlayerProgress();
  }, 5000);
}

export function stopMining() {
  if (!miningIntervalId) return;

  clearInterval(miningIntervalId);
  miningIntervalId = null;
  isMining = false;
}

export function initMiningUI() {
  document.getElementById("miner-buy").addEventListener("click", buyMiner);

  $(document).on("click", ".assign-plus", function (e) {
    e.stopPropagation();

    const mineEl = $(this).closest(".purchased-mine");
    const oreType = mineEl.data("ore");

    assignMiner(oreType);
  });

  $(document).on("click", ".assign-minus", function (e) {
    e.stopPropagation();

    const mineEl = $(this).closest(".purchased-mine");
    const oreType = mineEl.data("ore");

    unassignMiner(oreType);
  });
}