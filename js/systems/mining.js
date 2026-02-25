import { 
  resourceCounts, 
  countCoins, 
  playerMiningRate,
  playerState,
} from "../core/state.js";
import { updateResource } from "../core/helpers.js";
import { completeObjective } from "./objectives.js";
import { updateInfoMessage } from "../ui/ui-update.js";
import { savePlayerProgress } from "../core/save.js";
import { playSound } from "../core/audio.js";


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
  "pickaxeBronze": 1,
  "pickaxeIron": 2,
  "pickaxeSteel": 3,
  "pickaxeBlack": 4,
  "pickaxeGold": 5,
  "pickaxeMithril": 6,
  "pickaxeAdamant": 7,
  "pickaxeRunite": 8,
  "pickaxeDragon": 9
};

export function getHighestPickaxeLevel(playerState) {
  const pickaxes = playerState.value?.unlockedPickaxes || {}
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
  $(".node__copper-ore").on("click", () => {
    if (nodeCooldowns.copperOre) return;
    if (!canMine("copperOre")) return;

    updateResource("copperOre", 1 * playerMiningRate.value);
    playSound("mining");
    completeObjective("copperAndTin", resourceCounts.value, countCoins.value);
    nodeCooldown("copperOre");
    savePlayerProgress();
  });

  $(".node__tin-ore").on("click", () => {
    if (nodeCooldowns.tinOre) return;
    if (!canMine("tinOre")) return;

    updateResource("tinOre", 1 * playerMiningRate.value);
    playSound("mining");
    completeObjective("copperAndTin", resourceCounts.value, countCoins.value);
    nodeCooldown("tinOre");
    savePlayerProgress();
  });

  $(".node__iron-ore").on("click", () => {
    if (nodeCooldowns.ironOre) return;
    if (!canMine("ironOre", playerState)) return;

    updateResource("ironOre", 0.25 * playerMiningRate.value);
    playSound("mining");
    nodeCooldown("ironOre");
    savePlayerProgress();
  });
}
