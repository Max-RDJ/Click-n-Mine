import { playerState } from "../core/state.js";
import { RESOURCES } from "../data/resources.js";

export function calculatePlayerStats() {

  const equipment = playerState.value.equipment;

  console.log("Equipment:", equipment);

  let attack = 1;
  let defense = 0;
  let maxHp = 10;

Object.values(equipment).forEach(itemKey => {
    if (!itemKey) return;

    const item = RESOURCES[itemKey];

    if (!item) {
        console.error("Missing in RESOURCES:", itemKey);
        console.log("Available RESOURCES keys:", Object.keys(RESOURCES));
        return;
    }

    attack += item.attack ?? 0;
    defense += item.defense ?? 0;
    maxHp += item.hp ?? 0;
    });

    return { attack, defense, maxHp }; 
}
