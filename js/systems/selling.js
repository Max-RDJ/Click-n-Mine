import { resourceCounts, countCoins } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";

let selectedResource = null;

function getResourceCount(resourceId) {
  switch (resourceId) {
    case "resource__stone": return resourceCounts.value.stone;
    case "resource__copper-ore": return resourceCounts.value.copperOre;
    case "resource__tin-ore": return resourceCounts.value.tinOre;
    case "resource__iron-ore": return resourceCounts.value.ironOre;
    case "resource__bronze-ingot": return resourceCounts.value.bronzeIngot;
    case "resource__iron-ingot": return resourceCounts.value.ironIngot;
    case "resource__bronze-med-helm": return resourceCounts.value.bronzeMedHelm;
    default: return 0;
  }
}

function getResourceName(resourceId) {
  return resourceId.split("-").slice(1).join(" ");
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

    switch (selectedResource) {
      case "resource__stone":
        countCoins.value += amountToSell;
        resourceCounts.value.stone -= amountToSell;
        updateDisplay();
        break;
      case "resource__copper-ore":
        countCoins.value += amountToSell * 5;
        resourceCounts.value.copperOre -= amountToSell;
        updateDisplay();
        break;
      case "resource__tin-ore":
        countCoins.value += amountToSell * 5;
        resourceCounts.value.tinOre -= amountToSell;
        updateDisplay();
        break;
      case "resource__iron-ore":
        countCoins.value += amountToSell * 5;
        resourceCounts.value.ironOre -= amountToSell;
        updateDisplay();
        break;
      case "resource__bronze-ingot":
        countCoins.value += amountToSell * 5;
        resourceCounts.value.bronzeIngot -= amountToSell;
        updateDisplay();
        break;
      case "resource__iron-ingot":
        countCoins.value += amountToSell * 5;
        resourceCounts.value.ironIngot -= amountToSell;
        updateDisplay();
        break;
      case "resource__bronze-med-helm":
        countCoins.value += amountToSell * 8;
        resourceCounts.value.bronzeMedHelm -= amountToSell;
        updateDisplay();
        break;
    }

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
