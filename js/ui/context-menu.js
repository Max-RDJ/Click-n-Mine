import { RESOURCES } from "../data/resources.js";
import { playerState } from "../core/state.js";
import { equipItem, unequipItem } from "../core/equipment.js";
import { sellOne, sellAmount } from "../systems/selling.js";
import { takeItemFromResources, inventoryState, removeItem } from "../core/inventory.js";


let currentResource = null;
let currentSlot = null;
let currentInventoryIndex = null;

export function bindContextMenu() {
  document.addEventListener("contextmenu", (e) => {    
    let key = null;
    let slot = null;
    let inInventory = false;

    const resourceEl = e.target.closest("[data-resource]");
    if (resourceEl) {
    e.preventDefault();
    key = resourceEl.dataset.resource;
    if (!key) return;
  }

    const slotEl = e.target.closest(".player-equipment img[data-slot]");
    if (slotEl) {
      e.preventDefault();
      slot = slotEl.dataset.slot;
      key = playerState.value.equipment[slot] ?? null;
      if (!key) return;
    }

    const inventoryEl = e.target.closest(".item-slot");
      if (inventoryEl) {
        e.preventDefault();
        const index = inventoryEl.dataset.index;
        const invSlot = inventoryState[index];
        if (!invSlot) return;

        key = invSlot.id;
        currentInventoryIndex = index;
        inInventory = true;
      }

      if (!key) return;

      currentResource = key;
      currentSlot = slot ?? null;

      openMenu(e.pageX, e.pageY, key, !!slot, inInventory);
    

    const pickaxeEl = e.target.closest(".pickaxes");
      if (pickaxeEl) {
        e.preventDefault();
        key = pickaxeEl.id;
      }
  });

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("context-menu-sell");

    if (!menu.contains(e.target)) {
      closeMenu();
    }
  });
  document.getElementById("context-sell").onclick = sellCurrent;
  document.getElementById("context-sell-x").onclick = showSellX;
  document.getElementById("sell-x-confirm").onclick = confirmSellX;
  document.getElementById("context-sell-all").onclick = sellAllCurrent;
  document.getElementById("context-equip").onclick = equipCurrent;
  document.getElementById("context-unequip").onclick = unequipCurrent;
  document.getElementById("context-add").onclick = () => {
    if (!currentResource) return;
    takeItemFromResources(currentResource, 1);
    closeMenu();
  };
  document.getElementById("context-return").onclick = () => {
    if (currentInventoryIndex !== null) {
      removeItem(currentInventoryIndex);
      currentInventoryIndex = null;
      closeMenu();
    }
  };
};

function openMenu(x, y, resourceKey, isEquipped = false, inInventory = false) {
  const menu = document.getElementById("context-menu-sell");
  const data = RESOURCES[resourceKey];
  if (!data) return;

  const sellBtn = document.getElementById("context-sell");
  const sellXBtn = document.getElementById("context-sell-x");
  const sellAllBtn = document.getElementById("context-sell-all");
  const equipBtn = document.getElementById("context-equip");
  const unequipBtn = document.getElementById("context-unequip");
  const addBtn = document.getElementById("context-add");
  const returnBtn = document.getElementById("context-return");

  sellBtn.style.display = "none";
  sellXBtn.style.display = "none";
  sellAllBtn.style.display = "none";
  equipBtn.style.display = "none";
  unequipBtn.style.display = "none";
  addBtn.style.display = "none";
  returnBtn.style.display = "none";

  if (inInventory) {
    returnBtn.style.display = "block";

    if (data.sellPrice) {
      sellBtn.style.display = "block";
      sellXBtn.style.display = "block";
      sellAllBtn.style.display = "block";
    }

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.classList.remove("hidden");
    return;
  }

  if (data.type === "material") {
    sellBtn.style.display = "block";
    sellXBtn.style.display = "block";
    sellAllBtn.style.display = "block";
    addBtn.style.display = "block";
  }

  if (data.type === "equipment") {
    if (isEquipped) {
      unequipBtn.style.display = "block";
    } else {
      equipBtn.style.display = "block";
    }

    if (data.sellPrice) {
      sellBtn.style.display = "block";
      sellXBtn.style.display = "block";
      sellAllBtn.style.display = "block";
    }
  }

  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.classList.remove("hidden");
}

function closeMenu() {
  document.getElementById("context-menu-sell").classList.add("hidden");
}

function sellCurrent() {
  const data = RESOURCES[currentResource];
  if (!data) return;

  sellOne(currentResource);
  closeMenu();
}

function showSellX() {
  const container = document.getElementById("sell-x-container");
  const input = document.getElementById("sell-x-input");

  container.classList.remove("hidden");

  const max = playerState.value.resources[currentResource] ?? 0;
  input.max = max;
  input.value = "";
  input.focus();
}

function confirmSellX() {
  const input = document.getElementById("sell-x-input");
  const amount = parseInt(input.value);

  const max = playerState.value.resources[currentResource] ?? 0;

  if (!amount || amount <= 0 || amount > max) return;

  sellAmount(currentResource, amount);

  document.getElementById("sell-x-container").classList.add("hidden");
  closeMenu();
}

function sellAllCurrent() {
  const count = playerState.value.resources[currentResource] ?? 0;
  if (count <= 0) return;

  sellAmount(currentResource, count);
  closeMenu();
}

function equipCurrent() {
    equipItem(currentResource);
    closeMenu();
}

function unequipCurrent() {
  if (!currentSlot) return;

  unequipItem(currentSlot);
  currentSlot = null;
  currentResource = null;
  closeMenu();
}

export function bindUnequipSlots() {
  const slotImages = document.querySelectorAll(".player-equipment img");

  slotImages.forEach((img) => {
    img.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const slot = img.dataset.slot;
      unequipItem(slot);
    });
  });
}