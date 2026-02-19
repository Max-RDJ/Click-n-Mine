import { RESOURCES } from "../data/resources.js";

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
  items: {} // e.g. food
};

export function equipItem(itemKey) {
  const data = RESOURCES[itemKey];
  if (!data || data.type !== "equipment") return;

  const slot = data.slot;
  if (!slot) return;

  unequipItem(slot);
  equipment[slot] = itemKey;
  updateSlotUI(slot, itemKey);
}

export function unequipItem(slot) {
  const previousItem = equipment[slot];
  if (!previousItem) return;

  equipment[slot] = null;
  updateSlotUI(slot, null);
}

function updateSlotUI(slot, itemKey) {
  const slotMap = {
    head: "#player-equipment img:nth-child(1)",
    weapon: "#player-equipment img:nth-child(2)",
    chest: "#player-equipment img:nth-child(3)",
    offhand: "#player-equipment img:nth-child(4)",
    legs: "#player-equipment img:nth-child(5)",
    hands: "#player-equipment img:nth-child(6)",
    feet: "#player-equipment img:nth-child(7)",
    jewellery: "#player-equipment img:nth-child(8)"
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
