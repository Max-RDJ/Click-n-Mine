import { countCoins, playerMines } from "../core/state.js";
import { MINE_TYPES, MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";

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
    playerMines.push(mine);
    renderMine(mine);

    updateCoinsDisplay();
}

export function selectMine(type) {
  return {
    type,
    ore: `${type}Ore`
  };
}

export function renderMine(mine) {
    const mineEl = document.createElement("div");
    mineEl.classList.add("purchased-mine");
    mineEl.dataset.ore = mine.ore;

    mineEl.innerHTML = `
    <img src="images/mine_${capitalize(mine.type)}.png">

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
  return Math.floor(
    MINE_CONFIG.baseCost * Math.pow(MINE_CONFIG.costMultiplier, playerMines.length)
  );
}

