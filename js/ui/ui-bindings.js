import { 
  updateFurnaceUI, 
  updateAnvilUI, 
  updateCoinsDisplay, 
  updateMinerUI
} from "./ui-update.js";
import { buyAnvil } from "../systems/anvil-purchase.js";
import {
    buyMiner
} from "../systems/auto-mining.js";
import {  
  stopSmelting 
} from "../systems/smelting.js";
import { startMining } from "../systems/auto-mining.js";
import { bindNodeClicks } from "../systems/mining.js";
import { resetMoney, addMoney, resetAll } from "../systems/dev-tools.js";
import { loadObjectivesProgress, getActiveObjectiveMessage, clearObjectivesAlert } from "../systems/objectives.js";
import { bindContextMenu } from "./context-menu.js";
import { generateInventorySlots, initInventory, renderInventory } from "../core/inventory.js";


window.addEventListener("DOMContentLoaded", () => {
  loadObjectivesProgress()
  $("#objective-message-content").html(getActiveObjectiveMessage());
  updateFurnaceUI()
  updateAnvilUI()
  updateMinerUI()
  startMining()
  bindContextMenu()
  initInventory()
  generateInventorySlots()
  renderInventory()
});

export function bindUI() {
  $("#anvil-buy").on("click", buyAnvil);

  $("#objective-message-dismiss").on("click", () => {
    $("#objective-message").hide();
  });

  bindNodeClicks();

  // DEV TOOLS
  $("#reset-money").on("click", resetMoney);
  $("#mo-money").on("click", addMoney);
  $("#reset-all").on("click", resetAll);

  // UI REFRESH
  updateCoinsDisplay()
  updateFurnaceUI()
  updateAnvilUI()
  updateMinerUI()

  loadObjectivesProgress()
  $("#objective-message-content").html(getActiveObjectiveMessage())
}

export function bindShopDrawer() {
  const drawer = document.getElementById("shop-drawer");
  const tab = document.getElementById("shop-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    closeAllDrawers();
    if (!isOpen) {
      drawer.classList.add("open");
      clearObjectivesAlert();
    }
  });
}

export function bindMagicDrawer() {
  const drawer = document.getElementById("magic-drawer");
  const tab = document.getElementById("magic-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    closeAllDrawers();
    if (!isOpen) {
      drawer.classList.add("open");
      clearObjectivesAlert();
    }
  });
}

export function bindCombatDrawer() {
  const drawer = document.getElementById("combat-drawer");
  const tab = document.getElementById("combat-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    closeAllDrawers();
    if (!isOpen) {
      drawer.classList.add("open");
      clearObjectivesAlert();
    }
  });
}

/* export function bindEquipmentDrawer() {
  const drawer = document.getElementById("inventory-drawer");
  const tab = document.getElementById("inventory-tab");

  tab.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    closeAllDrawers();
    if (!isOpen) {
      drawer.classList.add("open");
    }
  });
} */

function closeAllDrawers () {
  closeAllBottomDrawers();
  closeAllRightDrawers();
}

function closeAllRightDrawers() {
  document.querySelectorAll(".drawer-right").forEach(d => {
    d.classList.remove("open");
  });
}

function closeAllBottomDrawers() {
  document.querySelectorAll(".drawer-bottom").forEach(d => {
    d.classList.remove("open");
  });
}

document.addEventListener("click", (e) => {
  const activeDrawer = document.querySelector(".drawer.open");
  if (!activeDrawer) return;

  const clickedInsideDrawer = activeDrawer.contains(e.target);
  const clickedTab = e.target.closest(".drawer-tab");

  if (!clickedInsideDrawer && !clickedTab && !e.target.closest(".context-menu")) {
    closeAllDrawers();
  }
});