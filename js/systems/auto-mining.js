import { countCoins, autoMiningRate, resourceCounts } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";

export const autoMinerList = [
  { id: "human-miner-1", cost: 500, autoMiningRate: 1 },
  { id: "human-miner-2", cost: 500, autoMiningRate: 1 },
  { id: "human-miner-3", cost: 500, autoMiningRate: 1 }
];

let miningIntervalId = null;

export function buyAutoMiner(id, cost, minerRate) {
  const element = document.getElementById(id);
  if (element.style.opacity !== "1" && countCoins.value >= cost) {
    element.style.opacity = "1";
    countCoins.value -= cost;
    autoMiningRate.value += minerRate;
    updateCoinsDisplay();
    updateInfoMessage("You buy a miner.");
    startAutoMining();
  } else if (countCoins.value < cost) {
    updateInfoMessage("You don't have enough coins.");
  } else {
    updateInfoMessage("You've already bought that.");
  }
}

export function startAutoMining() {
  if (miningIntervalId) clearInterval(miningIntervalId);

  const oreType = document.getElementById("mining-selection").value;
  const selectedOreObj = oreList.find(ore => ore.type === oreType);

  if (!selectedOreObj || autoMiningRate.value <= 0) return;

  const intervalDuration = 3000 / autoMiningRate.value;

  miningIntervalId = setInterval(() => {
    selectedOreObj.count++;
    resourceCounts.value[oreType]++;
    updateDisplay();
  }, intervalDuration);
}

export function bindMinerButtons() {
  autoMinerList.forEach(({ id, cost, autoMiningRate }) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", () => buyAutoMiner(id, cost, autoMiningRate));
    }
  });
}
