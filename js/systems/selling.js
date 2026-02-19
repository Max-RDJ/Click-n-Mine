import { resourceCounts, countCoins } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";
import { RESOURCES } from "../data/resources.js";


let selectedResource = null;

function idToKey(resourceId) {
  const raw = resourceId.replace("resource__", "");

  return raw.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  );
}

function getResourceCount(resourceId) {
  const key = idToKey(resourceId);
  return resourceCounts.value[key] ?? 0;
}

function getResourceName(resourceId) {
  const key = idToKey(resourceId);
  return RESOURCES[key]?.displayName ?? "Unknown";
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

    const key = idToKey(selectedResource);
    const config = RESOURCES[key];
    if (!config) return;

    countCoins.value += amountToSell * config.sellPrice;
    resourceCounts.value[key] -= amountToSell;

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

export function sellOne(key) {
  const config = RESOURCES[key];
  if (!config) return;

  if ((resourceCounts.value[key] ?? 0) <= 0) return;

  resourceCounts.value[key] -= 1;
  countCoins.value += config.sellPrice;

  updateDisplay();
  updateCoinsDisplay();
}

