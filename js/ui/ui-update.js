import { getFurnaceCost } from "../systems/smelting.js";
import { getAnvilCost } from "../systems/smithing.js";
import { countCoins, resourceCounts } from "../core/state.js";
import { savePlayerProgress } from "../core/save.js";
import { playerFurnaces, playerAnvils } from "../core/state.js";
import { setText } from "../core/helpers.js";


export function updateDisplay() {
  const r = resourceCounts.value || {};
  setText('#count__stone', r.stone || 0);
  setText('#count__copper-ore', r.copperOre || 0);
  setText('#count__tin-ore', r.tinOre || 0);
  setText('#count__iron-ore', r.ironOre || 0);
  setText('#count__bronze-ingot', r.bronzeIngot || 0);
  setText('#count__iron-ingot', r.ironIngot || 0);
  setText('#count__bronze-helm', r.bronzeHelm || 0);
}

export function updateCoinsDisplay() {
  $("#count__coins").text(countCoins.value);
  savePlayerProgress();
}

export function updateInfoMessage(message) {
  $("#info-message").text(message);
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