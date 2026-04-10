import { getFurnaceCost } from "../systems/smelting.js";
import { getAnvilCost } from "../systems/smithing.js";
import { countCoins, resourceCounts, playerState } from "../core/state.js";
import { savePlayerProgress } from "../core/save.js";
import { playerFurnaces, playerAnvils, playerMiners, playerMines } from "../core/state.js";
import { getMinerCost, getAvailableMiners } from "../systems/auto-mining.js";
import { setText } from "../core/helpers.js";
import { showTemporaryMessage } from "../systems/messages.js";
import { RESOURCES } from "../data/resources.js";
import { capitalize } from "../utils/utils.js";


export function updateDisplay() {
  const r = resourceCounts.value || {};
  setText('#count__copper-ore', r.copperOre || 0);
  setText('#count__tin-ore', r.tinOre || 0);
  setText('#count__iron-ore', r.ironOre || 0);
  setText('#count__bronze-ingot', r.bronzeIngot || 0);
  setText('#count__iron-ingot', r.ironIngot || 0);
  setText('#count__bronze-helm', r.bronzeHelm || 0);
  setText('#count__bronze-platebody', r.bronzePlatebody || 0);
  setText('#count__bronze-platelegs', r.bronzePlatelegs || 0);
  setText('#count__bronze-sword', r.bronzeSword || 0);
  setText('#count__iron-sword', r.ironSword || 0);
  setText('#count__air-essence', r.airEssence || 0);
  setText('#count__earth-essence', r.earthEssence || 0);
  setText('#count__fire-essence', r.fireEssence || 0);
  setText('#count__water-essence', r.waterEssence || 0);
}

export function initializeResourceImages() {
  document.querySelectorAll(".resources").forEach(el => {
    const key = el.dataset.resource;
    if (!key) return;

    const resourceData = RESOURCES[key];
    if (!resourceData) return;

    const img = el.querySelector("img");
    if (img) {
      img.src = resourceData.image;
    }
  });
}

export function updateCoinsDisplay() {
  $("#count__coins").text(countCoins.value);
  savePlayerProgress();
}

export function updateInfoMessage(message) {
  showTemporaryMessage(message);
  savePlayerProgress();
}

export function updateFurnaceUI() {
  document.getElementById("cost__furnace").textContent =
    `Cost: ${getFurnaceCost()} coins`;

  document.getElementById("count__furnace").textContent =
    `${playerFurnaces.value}`;
}

export function updateAnvilUI() {
  document.getElementById("cost__anvil").textContent =
    `Cost: ${getAnvilCost()} coins`;

  document.getElementById("count__anvil").textContent =
    `${playerAnvils.value}`;
}

export function updateMinerUI() {
  if (!playerState.value || !playerState.value.minerAssignments) return;

  document.querySelectorAll(".purchased-mine").forEach(mine => {
    const oreType = mine.dataset.ore;
    const count = playerState.value.minerAssignments[oreType] ?? 0;

    mine.querySelector(".assigned-count").textContent = count;
  });

  document.getElementById("cost__miner").textContent =
    `Cost: ${getMinerCost()} coins`;

  document.getElementById("count__miners-ores").textContent =
    ` ${getAvailableMiners()} of ${playerMiners.value}`;

  document.getElementById("count__miners").textContent =
    ` ${getAvailableMiners()}/${playerMiners.value}`;
}

export function renderMines() {
  const container = document.querySelector(".mines");
  const newMineButton = document.getElementById("mines-new");

  container.querySelectorAll(".purchased-mine").forEach(el => el.remove());

  // Ensure playerMines.value is an array
  const mines = Array.isArray(playerMines.value) ? playerMines.value : [];
  
  mines.forEach(mine => {
    const el = document.createElement("div");
    el.classList.add("purchased-mine");
    el.dataset.ore = `${mine.type}Ore`;

    el.innerHTML = `
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

    container.insertBefore(el, newMineButton);
  });
}
  