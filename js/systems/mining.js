import { 
  resourceCounts, 
  countCoins, 
  playerMiningRate,
  playerState
} from "../core/state.js";
import { updateResource } from "../core/helpers.js";
import { completeObjective } from "./objectives.js";
import { updateInfoMessage } from "../ui/ui-update.js";


const nodeCooldowns = {
  copperOre: false,
  tinOre: false,
  ironOre: false
};

const NODE_CONFIG = {
  copperOre: { selector: ".node__copper-ore img", fullImg: "images/440px-Copper_rocks.png", cooldown: 500 },
  tinOre: { selector: ".node__tin-ore img", fullImg: "images/440px-Tin_rocks.png", cooldown: 500 },
  ironOre: { selector: ".node__iron-ore img", fullImg: "images/440px-Iron_rocks.png", cooldown: 3000 }
};

const EMPTY_NODE_IMG = "images/440px-Rocks_(empty,_2).png";

export function nodeCooldown(type) {
  if (nodeCooldowns[type]) return;
  const config = NODE_CONFIG[type];
  if (!config) return;

  nodeCooldowns[type] = true;

  const img = document.querySelector(config.selector);
  img.src = EMPTY_NODE_IMG;
  img.classList.add("cooldown");

  setTimeout(() => {
    img.src = config.fullImg;
    img.classList.remove("cooldown");
    nodeCooldowns[type] = false;
  }, config.cooldown);
}

const NODE_REQUIREMENTS = {
  stone: 0,
  copperOre: 1,
  tinOre: 1,
  ironOre: 2
};

const pickaxeLevel = {
  "pickaxe-bronze": 1,
  "pickaxe-iron": 2,
  "pickaxe-steel": 3,
  "pickaxe-black": 4,
  "pickaxe-gold": 5,
  "pickaxe-mithril": 6,
  "pickaxe-adamant": 7,
  "pickaxe-runite": 8,
  "pickaxe-dragon": 9
};

export function getHighestPickaxeLevel(playerState) {
  const pickaxes = playerState.value?.purchasedPickaxes || {}
  return Object.keys(pickaxes)
    .map(id => pickaxeLevel[id] || 0)
    .reduce((max, val) => Math.max(max, val), 0);
}

export function canMine(nodeType) {
  const requiredLevel = NODE_REQUIREMENTS[nodeType] ?? 0;
  const playerLevel = getHighestPickaxeLevel(playerState);
  if (playerLevel < requiredLevel) {
    updateInfoMessage("You need a better pickaxe to mine this.");
    return false;
  }
  return true;
}

export function bindNodeClicks(playerState) {
  $(".node__stone").on("click", () => {
    updateResource("stone", 1 * playerMiningRate.value);
    completeObjective("stone5", resourceCounts.value, countCoins.value);
    completeObjective("stone10", resourceCounts.value, countCoins.value);
    updateInfoMessage("You mine some stone.");
  });

  $(".node__copper-ore").on("click", () => {
    if (nodeCooldowns.copperOre) return;
    if (!canMine("copperOre")) return;

    updateResource("copperOre", 0.5 * playerMiningRate.value);
    completeObjective("copperAndTin", resourceCounts.value, countCoins.value);
    updateInfoMessage("You mine some copper.");
    nodeCooldown("copperOre");
  });

  $(".node__tin-ore").on("click", () => {
    if (nodeCooldowns.tinOre) return;
    if (!canMine("tinOre")) return;

    updateResource("tinOre", 0.5 * playerMiningRate.value);
    completeObjective("copperAndTin", resourceCounts.value, countCoins.value);
    updateInfoMessage("You mine some tin.");
    nodeCooldown("tinOre");
  });

  $(".node__iron-ore").on("click", () => {
    if (nodeCooldowns.ironOre) return;
    if (!canMine("ironOre", playerState)) return;

    updateResource("ironOre", 0.25 * playerMiningRate.value);
    updateInfoMessage("You mine some iron.");
    nodeCooldown("ironOre");
  });
}
