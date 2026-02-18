import { resourceCounts, countCoins } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";


const RESOURCE_CONFIG = {
  "resource__stone": {
    key: "stone",
    displayName: "stone",
    sellPrice: 1
  },
  "resource__copper-ore": {
    key: "copperOre",
    displayName: "copper ore",
    sellPrice: 2
  },
  "resource__tin-ore": {
    key: "tinOre",
    displayName: "tin ore",
    sellPrice: 2
  },
  "resource__iron-ore": {
    key: "ironOre",
    displayName: "iron ore",
    sellPrice: 4
  },
  "resource__bronze-ingot": {
    key: "bronzeIngot",
    displayName: "bronze ingot",
    sellPrice: 5
  },
  "resource__iron-ingot": {
    key: "ironIngot",
    displayName: "iron ingot",
    sellPrice: 6
  },
  "resource__bronze-med-helm": {
    key: "bronzeMedHelm",
    displayName: "bronze medium helmet",
    sellPrice: 8
  },
  "resource__iron-sword": {
    key: "ironSword",
    displayName: "iron sword",
    sellPrice: 10
  },
};

let selectedResource = null;

function getResourceCount(resourceId) {
  const config = RESOURCE_CONFIG[resourceId];
  if (!config) return 0;

  return resourceCounts.value[config.key] ?? 0;
}

function getResourceName(resourceId) {
  return RESOURCE_CONFIG[resourceId]?.displayName ?? "Unknown";
}

function selectResource(resourceId) {
  selectedResource = resourceId;
  const slider = document.getElementById("sell-slider");
  const label = document.getElementById("sell-label");

  slider.max = getResourceCount(resourceId);
  slider.value = 0;
  label.textContent = `Sell 0 ${getResourceName(resourceId)}`;
}

export function bindSellingUI() {
  $(".sellable").on("click", function() {
    $(".sellable").removeClass("selected-ore");
    $(this).addClass("selected-ore");
    selectResource(this.id);
  });

  $("#sell-confirm").on("click", () => {
    if (!selectedResource) return;

    const slider = document.getElementById("sell-slider");
    const amountToSell = parseInt(slider.value);
    if (amountToSell <= 0) return;

    const config = RESOURCE_CONFIG[selectedResource];
    if (!config) return;

    countCoins.value += amountToSell * config.sellPrice;
    resourceCounts.value[config.key] -= amountToSell;

    updateDisplay();
    updateCoinsDisplay();


    updateCoinsDisplay();
    updateInfoMessage(`You sell ${amountToSell} ${getResourceName(selectedResource)}.`);

    slider.value = 0;
    slider.max = getResourceCount(selectedResource);
    document.getElementById("sell-label").textContent = `Sell 0 ${getResourceName(selectedResource)}`;

    completeObjective("sell10", resourceCounts.value, countCoins.value);
  });

  document.getElementById("sell-slider").addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    const label = document.getElementById("sell-label");
    if (selectedResource) {
      label.textContent = `Sell ${value} ${getResourceName(selectedResource)}`;
    }
  });
}
