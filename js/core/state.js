import { updateSlotUI } from "./equipment.js";

export const defaultPlayerState = {
  coins: 10,
  resources: {
    stone: 0,
    copperOre: 0,
    tinOre: 0,
    ironOre: 0,
    bronzeIngot: 0,
    ironIngot: 0,
    bronzeHelm: 0,
    bronzePlatebody: 0,
    bronzePlatelegs: 0,
    bronzeSword: 0,
    ironSword: 0
  },
  equipment: {
    utility: null,
    weapon: null,
    offhand: null,
    head: null,
    chest: null,
    legs: null,
    hands: null,
    jewellery: null,
    feet: null,
  },
  inventory: {},
  playerMiningRate: 1,
  purchasedPickaxes: {},
  autoMiningRate: 0,
  playerSmeltingRate: 1,
  playerSmithingRate: 1,
  objectivesProgress: 0,
  playerFurnaces: 0,
  playerAnvils: 0
};

export const playerState = { value: null };
export const resourceCounts = { value: null };
export const countCoins = { value: 0 };
export const playerMiningRate = { value: 1 };
export const playerSmeltingRate = { value: 1 };
export const playerSmithingRate = { value: 1 };
export const autoMiningRate = { value: 0 };
export const playerFurnaces = { value: 0 };
export const playerAnvils = { value: 0 };

export function applyLoadedState(state) {
  playerState.value = state;
  resourceCounts.value = playerState.value.resources;

  countCoins.value = state.coins ?? 0;
  playerMiningRate.value = state.playerMiningRate ?? 1;
  autoMiningRate.value = state.autoMiningRate ?? 0;
  playerFurnaces.value = state.playerFurnaces ?? 0;
  playerAnvils.value = state.playerAnvils ?? 0;
  
  if (!playerState.value.purchasedPickaxes) {
    playerState.value.purchasedPickaxes = {};
  }
  if (!playerState.value.equipment) {
    playerState.value.equipment = structuredClone(defaultPlayerState.equipment);
  }
  for (const slot in playerState.value.equipment) {
    const equippedItem = playerState.value.equipment[slot];
    if (equippedItem) {
      resourceCounts.value[equippedItem] = (resourceCounts.value[equippedItem] ?? 0) - 1;
      if (resourceCounts.value[equippedItem] < 0) resourceCounts.value[equippedItem] = 0;
    }
  }
}

export function createFreshState() {
  const clone = structuredClone(defaultPlayerState);
  applyLoadedState(clone);
  return clone;
}

export function initializeEquipmentUI() {
  for (const slot in playerState.value.equipment) {
    const itemKey = playerState.value.equipment[slot];
    updateSlotUI(slot, itemKey);
  }
}
