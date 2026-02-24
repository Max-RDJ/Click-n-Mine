import { RESOURCES } from "../data/resources.js";
import { resourceCounts, playerState } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";
import { savePlayerProgress } from "./save.js";
import { completeObjective } from "../systems/objectives.js";
import { playSound } from "./audio.js";

export function equipItem(itemKey) {
  const data = RESOURCES[itemKey];
  if (!data || data.type !== "equipment") return;

  const slot = data.slot;
  if (!slot) return;

  if ((resourceCounts.value[itemKey] ?? 0) <= 0) return;

  resourceCounts.value[itemKey] -= 1;

  const previousItem = playerState.value.equipment[slot];
  if (previousItem) {
    resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;
  }

  playerState.value.equipment[slot] = itemKey;

  playSound("equip_metal");
  updateSlotUI(slot, itemKey);
  updateDisplay();
  savePlayerProgress();
  completeObjective("gearUp", resourceCounts.value, playerState.value.coins);
}

export function unequipItem(slot) {
  const previousItem = playerState.value.equipment[slot];
  if (!previousItem) return;

  resourceCounts.value[previousItem] = (resourceCounts.value[previousItem] ?? 0) + 1;

  playerState.value.equipment[slot] = null;

  updateSlotUI(slot, null);
  updateDisplay();
  savePlayerProgress();
}

export function updateSlotUI(slot, itemKey) {
  const slotMap = {
    utility: ".player-equipment img[data-slot='utility']",
    head: ".player-equipment img[data-slot='head']",
    weapon: ".player-equipment img[data-slot='weapon']",
    chest: ".player-equipment img[data-slot='chest']",
    offhand: ".player-equipment img[data-slot='offhand']",
    legs: ".player-equipment img[data-slot='legs']",
    hands: ".player-equipment img[data-slot='hands']",
    feet: "#player-equipment img[data-slot='feet']",
    jewellery: "#player-equipment img[data-slot='jewellery']"
  };

  const imgEl = document.querySelector(slotMap[slot]);
  if (!imgEl) return;

  if (itemKey) {
    imgEl.src = RESOURCES[itemKey].image
  } else {
    const defaultImages = {
      utility: "images/ammo_slot.png",
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
