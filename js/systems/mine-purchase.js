import { countCoins, playerMines } from "../core/state.js";
import { MINE_TYPES, MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";
import { savePlayerProgress } from "../core/save.js";

var newMine = {
    ore: null,
    productionRate: 1
};

export function buyMine(mineType) {
    const cost = getMineCost();

    if (countCoins.value < cost) {
        updateInfoMessage("You don't have enough coins.");
        return;
    }

    countCoins.value -= cost;

    const mine = selectMine(mineType);
    playerMines.value.push(mine);
    renderMine(mine);

    updateCoinsDisplay();
    savePlayerProgress();
}

export function selectMine(type) {
  return {
    id: `mine-${Date.now()}-${Math.random()}`,
    type,
    ore: `${type}Ore`,
    assignedMiners: 0
  };
}

export function renderMine(mine) {
    const mineEl = document.createElement("div");
    mineEl.classList.add("purchased-mine");
    mineEl.dataset.id = mine.id;

    const type = mine.ore.replace("Ore", "");
    mineEl.innerHTML = `
    <img src="images/mine_${capitalize(type)}.png">

    <div class="miner-controls hidden">
      <button class="assign-plus button-icon">
        <i data-lucide="CirclePlus"></i>
      </button>
      <span class="assigned-count">0</span>
      <button class="assign-minus button-icon">
        <i data-lucide="CircleMinus"></i>
      </button>
    </div>
  `;

  document.querySelector(".mines").prepend(mineEl);

  lucide.createIcons();
}

export function getMineCost() {
  const cost = Math.floor(
    MINE_CONFIG.baseCost *
    Math.pow(MINE_CONFIG.costMultiplier, playerMines.value.length)
  );
  console.log("Calculating mine cost:", cost);
  return cost;
}

