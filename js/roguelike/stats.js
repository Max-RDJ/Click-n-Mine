import { playerState } from "../core/state.js";
import { RESOURCES } from "../data/resources.js";

export function calculatePlayerStats() {
  let maxHp = 20;
  let attack = 5;
  let defense = 2;

  const eq = playerState.value.equipment;

  Object.values(eq).forEach(itemKey => {
    if (!itemKey) return;

    const item = RESOURCES[itemKey];
    if (!item) {
      console.error("Missing in RESOURCES:", itemKey);
      return;
    }

    maxHp += item.hp ?? 0;
    attack += item.attack ?? 0;
    defense += item.defense ?? 0;
  });

  const inv = playerState.value.inventory;
  Object.entries(inv).forEach(([itemKey, count]) => {
    if (count < 1) return;
    const item = RESOURCES[itemKey];
    if (!item) return;

    if (item.type === "usable" && item.active) {
      maxHp += item.hp ?? 0;
      attack += item.attack ?? 0;
      defense += item.defense ?? 0;
    }
  });

  return {
    maxHp,
    attack,
    defense
  };
}