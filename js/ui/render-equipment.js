import { playerState } from "../core/state.js";
import { RESOURCES } from "../data/resources.js";

export function renderEquipment(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const equipment = playerState.value.equipment;

  Object.keys(equipment).forEach(slot => {
    const imgEl = container.querySelector(`img[data-slot='${slot}']`);
    if (!imgEl) return;

    const itemKey = equipment[slot];

    if (itemKey) {
      imgEl.src = RESOURCES[itemKey].img;
    } else {
      const defaults = {
        head: "images/head_slot.png",
        weapon: "images/weapon_slot.png",
        chest: "images/body_slot.png",
        offhand: "images/shield_slot.png",
        legs: "images/legs_slot.png",
        hands: "images/hands_slot.png",
        feet: "images/feet_slot.png",
        jewellery: "images/ring_slot.png"
      };
      imgEl.src = defaults[slot];
    }
  });
}
