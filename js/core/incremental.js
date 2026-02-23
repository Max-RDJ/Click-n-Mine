import { playerState, resourceCounts, countCoins } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";
import { equipItem, unequipItem } from "./equipment.js";
import { savePlayerProgress } from "./save.js";

export function initIncrementalGame() {
  const resourcesDisplay = document.getElementById("resources-display");

  function renderResources() {
    resourcesDisplay.innerHTML = "";
    for (const [key, amount] of Object.entries(resourceCounts.value)) {
      const resDiv = document.createElement("div");
      resDiv.classList.add("resources");
      resDiv.textContent = `${key}: ${amount}`;
      resourcesDisplay.appendChild(resDiv);
    }
    const coinsDiv = document.createElement("div");
    coinsDiv.textContent = `Coins: ${countCoins.value}`;
    resourcesDisplay.appendChild(coinsDiv);
  }

  setInterval(() => {
    renderResources();
    updateDisplay();
  }, 500);

  const equipmentDiv = document.createElement("div");
  equipmentDiv.id = "equipment-display";
  equipmentDiv.innerHTML = "<h3>Equipped Items:</h3>";
  for (const [slot, itemKey] of Object.entries(playerState.value.equipment)) {
    if (slot === "items") continue;
    const slotDiv = document.createElement("div");
    slotDiv.textContent = `${slot}: ${itemKey ?? "None"}`;
    equipmentDiv.appendChild(slotDiv);
  }
  resourcesDisplay.appendChild(equipmentDiv);
}

$("#ascend-tab").on("click", () => {
  $("#ascend-confirmation").toggleClass("show");
})

$("#ascend-cancel-btn").on("click", () => {
  $("#ascend-confirmation").removeClass("show");
})