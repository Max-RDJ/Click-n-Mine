import { countCoins, resourceCounts, playerMiners, playerMines, playerState } from "../core/state.js";
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

function assignMiner(mine) {
  if (getAvailableMiners() <= 0) return;
  mine.assignedMiners = (mine.assignedMiners || 0) + 1;
  updateMinerUI();
  completeObjective("assignMiner");
  completeObjective("assignMinerTin");
  savePlayerProgress();
}

function unassignMiner(mine) {
  if (!mine.assignedMiners || mine.assignedMiners <= 0) return;
  mine.assignedMiners--;
  updateMinerUI();
  savePlayerProgress();
}

export function getAvailableMiners() {
  const mines = playerMines.value || [];

  const assigned = mines.reduce(
    (sum, mine) => sum + (mine.assignedMiners || 0),
    0
  );

  return playerMiners.value - assigned;
}

export function updateMineUI(mineEl, mine) {
  mineEl.querySelector(".assigned-count").textContent = mine.assignedMiners;
}

let miningIntervalId = null;
let isMining = false;

export function startMining() {
  if (isMining) return;

  isMining = true;

  miningIntervalId = setInterval(() => {
    playerMines.value.forEach(mine => {
      const count = mine.assignedMiners || 0;
      if (count <= 0) return;

      resourceCounts.value[mine.ore] += count;
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

    const el = $(this).closest(".purchased-mine")[0];
    const id = el.dataset.id;
    const mine = playerMines.value.find(m => m.id === id);
    if (!mine) return;

    assignMiner(mine);
    updateMineUI(el, mine);
  });

  $(document).on("click", ".assign-minus", function (e) {
    e.stopPropagation();

    const el = $(this).closest(".purchased-mine")[0];
    const id = el.dataset.id;

    const mine = playerMines.value.find(m => m.id === id);
    if (!mine) return;

    unassignMiner(mine);
    updateMineUI(el, mine);
  });
}