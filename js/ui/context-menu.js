import { RESOURCES } from "../data/resources.js";
import { updateResource } from "../core/helpers.js";
import { playerState, countCoins } from "../core/state.js";
import { updateCoinsDisplay } from "./ui-update.js";
import { equipItem, unequipItem } from "../core/equipment.js";
import { idToKey } from "../systems/selling.js";
import { sellOne, sellAmount } from "../systems/selling.js";


let currentResource = null;
let currentSlot = null;

export function bindContextMenu() {
  document.addEventListener("contextmenu", (e) => {
    let key = null;
    let slot = null;

    const resourceEl = e.target.closest(".resources");
    if (resourceEl) {
        e.preventDefault();
        key = idToKey(resourceEl.id);
    }

    const slotEl = e.target.closest(".player-equipment img[data-slot]");
    if (slotEl) {
        e.preventDefault();
        slot = slotEl.dataset.slot;
        key = playerState.value.equipment[slot] ?? null;
        if (!key) return;
    }

    if (!key) return;

    currentResource = key;
    currentSlot = slot ?? null;

    openMenu(e.pageX, e.pageY, key, !!slot);
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
};

function openMenu(x, y, resourceKey, isEquipped = false) {
  const menu = document.getElementById("context-menu-sell");
  const data = RESOURCES[resourceKey];
  if (!data) return;

  document.getElementById("context-equip").style.display =
    !isEquipped && data.type === "equipment" ? "block" : "none";

  document.getElementById("context-unequip").style.display =
    isEquipped ? "block" : "none";

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