const INVENTORY_SIZE = 12;
const STORAGE_KEY = "playerInventory";
import { RESOURCES } from "../data/resources.js";
import { savePlayerProgress } from "./save.js";
import { playerState, resourceCounts } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";

/*
Inventory Structure:
[
  null,
  { id: "bronzeHelm", quantity: 1 },
  { id: "bronzeIngot", quantity: 5 },
  ...
]
*/

export let inventoryState = [];

export function initInventory() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (saved && Array.isArray(saved)) {
    inventoryState = saved;
  } else {
    inventoryState = Array(INVENTORY_SIZE).fill(null);
  }
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryState));
}

export function generateInventorySlots() {
  const container = document.querySelector(".player-items");
  if (!container) return;

  container.innerHTML = "";

  inventoryState.forEach((slot, index) => {
    const slotEl = document.createElement("div");
    slotEl.classList.add("item-slot");
    slotEl.dataset.index = index;

    container.appendChild(slotEl);
  });
}

export function renderInventory() {
  document.querySelectorAll(".item-slot").forEach(slotEl => {
    const index = slotEl.dataset.index;
    const slot = inventoryState[index];

    slotEl.innerHTML = "";

    if (!slot) return;

    const itemData = RESOURCES[slot.id];
    if (!itemData) return;

    const img = document.createElement("img");
    img.src = itemData.image;
    img.draggable = false;

    slotEl.appendChild(img);

    if (slot.quantity > 1) {
      const stack = document.createElement("span");
      stack.classList.add("stack-count");
      stack.textContent = slot.quantity;
      slotEl.appendChild(stack);
    }
  });
}

export function addItem(itemId, quantity = 1) {
  for (let slot of inventoryState) {
    if (slot && slot.id === itemId) {
      slot.quantity += quantity;
      saveInventory();
      renderInventory();
      return;
    }
  }

  const emptyIndex = inventoryState.findIndex(s => s === null);

  if (emptyIndex !== -1) {
    inventoryState[emptyIndex] = { id: itemId, quantity };
    saveInventory();
    renderInventory();
  } else {
    console.log("Inventory full");
  }
}

export function takeItemFromResources(itemId, quantity = 1) {
  const available = resourceCounts.value[itemId] || 0;

  if (available >= quantity) {
    resourceCounts.value[itemId] -= quantity;

    if (playerState.value) {
      playerState.value.resources[itemId] = resourceCounts.value[itemId];
    }
    
    addItem(itemId, quantity);
    updateDisplay();
    savePlayerProgress();
  } else {
    console.log(`Not enough ${itemId} in resources`);
  }
}

export function removeItem(slotIndex, quantity = 1) {
  const slot = inventoryState[slotIndex];
  if (!slot) return;

  slot.quantity -= quantity;

  if (slot.quantity <= 0) {
    inventoryState[slotIndex] = null;
  }

  saveInventory();
}