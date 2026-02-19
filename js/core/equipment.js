import { RESOURCES } from "../data/resources.js";
import { resourceCounts } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";

export const equipment = {
  utility: null,
  weapon: null,
  offhand: null,
  head: null,
  chest: null,
  legs: null,
  hands: null,
  jewellery: null,
  feet: null,
  items: {}
};

export function equipItem(itemKey) {
  const data = RESOURCES[itemKey];
  if (!data || data.type !== "equipment") return;

  const slot = data.slot;
  if (!slot) return;

  if ((resourceCounts.value[itemKey] ?? 0) <= 0) return;

  resourceCounts.value[itemKey] -= 1;
  updateDisplay();

  const previousItem = equipment[slot];
  if (previousItem) {
    resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;
  }

  equipment[slot] = itemKey;
  updateSlotUI(slot, itemKey);
}

export function unequipItem(slot) {
  const previousItem = equipment[slot];
  if (!previousItem) return;

  resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;

  equipment[slot] = null;
  updateSlotUI(slot, null);
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
