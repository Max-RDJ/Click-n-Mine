import { 
  updateFurnaceUI, 
  updateAnvilUI, 
  updateCoinsDisplay 
} from "./ui-update.js";
import { 
  bindSmithingUI, 
  buyAnvil, 
  startSmithing, 
  stopSmithing 
} from "../systems/smithing.js";
import { 
  buyFurnace, 
  startSmelting, 
  stopSmelting 
} from "../systems/smelting.js";
import { startAutoMining, bindMinerButtons } from "../systems/auto-mining.js";
import { bindPickaxeButtons } from "../systems/pickaxes.js";
import { bindNodeClicks } from "../systems/mining.js";
import { resetMoney, addMoney, resetAll } from "../systems/dev-tools.js";
import { loadObjectivesProgress, getActiveObjectiveMessage, clearObjectivesAlert } from "../systems/objectives.js";
import { bindContextMenu } from "./context-menu.js";
import { generateInventorySlots } from "../core/inventory.js";


window.addEventListener("DOMContentLoaded", () => {
  loadObjectivesProgress()
  $("#objective-message-content").html(getActiveObjectiveMessage());
  updateFurnaceUI()
  updateAnvilUI()
  startSmithing()
  startSmelting()
  bindContextMenu()
  generateInventorySlots()
});

export function bindUI() {
  $("#furnace-buy").on("click", buyFurnace);
  $("#anvil-buy").on("click", buyAnvil);

  $("#mining-selection").on("change", startAutoMining);

  $("#smelt-play").on("click", startSmelting);
  $("#smelt-pause").on("click", stopSmelting);
  $("#ingot-selection").on("change", () => {
    stopSmelting();
    startSmelting();
  });

  $("#smith-play").on("click", startSmithing);
  $("#smith-pause").on("click", stopSmithing);
  $("#product-selection").on("change", () => {
    stopSmithing();
    startSmithing();
  });

  $("#objective-message-dismiss").on("click", () => {
    $("#objective-message").hide();
  });

  bindSmithingUI();
  bindNodeClicks();
  bindPickaxeButtons();
  bindMinerButtons();

  // DEV TOOLS
  $("#reset-money").on("click", resetMoney);
  $("#mo-money").on("click", addMoney);
  $("#reset-all").on("click", resetAll);

  // UI REFRESH
  updateCoinsDisplay();
  updateFurnaceUI();
  updateAnvilUI();

  loadObjectivesProgress();
  $("#objective-message-content").html(getActiveObjectiveMessage());
}

export function bindEquipmentDrawer() {
  const drawer = document.getElementById("equipment-drawer");
  const tab = document.getElementById("drawer-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    closeAllBottomDrawers();
    if (!isOpen) {
      drawer.classList.add("open");
    }
  });
}

export function bindObjectivesDrawer() {
  const drawer = document.getElementById("objectives-drawer");
  const tab = document.getElementById("objectives-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");

    closeAllBottomDrawers();

    if (!isOpen) {
      drawer.classList.add("open");
      clearObjectivesAlert();
    }
  });
}

function closeAllBottomDrawers() {
  document.querySelectorAll(".bottom-drawer").forEach(d => {
    d.classList.remove("open");
  });
}