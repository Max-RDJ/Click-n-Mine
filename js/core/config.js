export const FURNACE_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmeltingRate: 1
};

export const SMELT_RECIPES = {
  bronzeIngot: {
    inputs: {
      copperOre: 1,
      tinOre: 1
    },
    output: "bronzeIngot"
  },
  ironIngot: {
    inputs: {
      ironOre: 1
    },
    output: "ironIngot"
  }
};

export const ANVIL_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmithingRate: 1
};

export const MINER_CONFIG = {
  baseCost: 30,
  costMultiplier: 1.6,
  minerMiningRate: 1
};

export const MINE_CONFIG = {
  baseCost: 30,
  costMultiplier: 1.6,
  minerMiningRate: 1
};

export const MINE_TYPES = {
    copper: "copperOre",
    tin: "tinOre",
    iron: "ironOre"
};

export const NODE_CONFIG = {
  copperOre: {
    selector: ".node__copper-ore img",
    fullImg: "images/440px-Copper_rocks.png",
    cooldown: 500
  },
  tinOre: {
    selector: ".node__tin-ore img",
    fullImg: "images/440px-Tin_rocks.png",
    cooldown: 500
  },
  ironOre: {
    selector: ".node__iron-ore img",
    fullImg: "images/440px-Iron_rocks.png",
    cooldown: 3000
  }
};

export const NODE_REQUIREMENTS = {
  copperOre: 1,
  tinOre: 1,
  ironOre: 2,
};
