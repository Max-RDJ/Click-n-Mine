import { RESOURCES } from "../data/resources.js";
import { resourceCounts, playerState } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";
import { savePlayerProgress } from "./save.js";

export function equipItem(itemKey) {
  const data = RESOURCES[itemKey];
  if (!data || data.type !== "equipment") return;

  const slot = data.slot;
  if (!slot) return;

  if ((resourceCounts.value[itemKey] ?? 0) <= 0) return;

  // Remove one from inventory
  resourceCounts.value[itemKey] -= 1;

  // Get currently equipped item in that slot
  const previousItem = playerState.value.equipment[slot];
  if (previousItem) {
    // Return it to inventory
    resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;
  }

  // Equip the new item
  playerState.value.equipment[slot] = itemKey;

  updateSlotUI(slot, itemKey);
  updateDisplay();
  savePlayerProgress();
}

export function unequipItem(slot) {
  const previousItem = playerState.value.equipment[slot];
  if (!previousItem) return;

  // Return item to inventory
  resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;

  // Remove from slot
  playerState.value.equipment[slot] = null;

  updateSlotUI(slot, null);
  updateDisplay();
  savePlayerProgress();
}

function updateSlotUI(slot, itemKey) {
  const slotMap = {
    head: "#player-equipment img[data-slot='head']",
    weapon: "#player-equipment img[data-slot='weapon']",
    chest: "#player-equipment img[data-slot='chest']",
    offhand: "#player-equipment img[data-slot='offhand']",
    legs: "#player-equipment img[data-slot='legs']",
    hands: "#player-equipment img[data-slot='hands']",
    feet: "#player-equipment img[data-slot='feet']",
    jewellery: "#player-equipment img[data-slot='jewellery']"
  };

  const imgEl = document.querySelector(slotMap[slot]);
  if (!imgEl) return;

  if (itemKey) {
    imgEl.src = RESOURCES[itemKey].img || "images/default_slot.png";
  } else {
    const defaultImages = {
      head: "images/head_slot.png",
      weapon: "images/weapon_slot.png",
      chest: "images/body_slot.png",
      offhand: "images/shield_slot.png",
      legs: "images/legs_slot.png",
      hands: "images/hands_slot.png",
      feet: "images/feet_slot.png",
      jewellery: "images/ring_slot.png"
    };
    imgEl.src = defaultImages[slot];
  }
}
