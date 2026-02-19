export const equipment = {
  utility: null, // e.g. pickaxe for random events containing nodes
  weapon: null,
  offhand: null,
  helmet: null,
  chest: null,
  legs: null,
  hands: null,
  jewellery: null,
  feet: null,
  items: {} // e.g. food
};

export function equipItem(slot, itemId) {
  equipment[slot] = itemId;
}

export function unequipItem(slot) {
  equipment[slot] = null;
}
