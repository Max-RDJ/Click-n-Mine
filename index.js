import {
  completeObjective,
  getActiveObjectiveMessage,
  loadObjectivesProgress
} from "./objectives.js";

window.addEventListener("DOMContentLoaded", () => {
  loadObjectivesProgress();
  $("#objective-message").text(getActiveObjectiveMessage());
  updateFurnaceUI();
  updateAnvilUI();
  startSmithing();
});

const storedCoins = localStorage.getItem("countCoins");
export let countCoins = storedCoins
  ? JSON.parse(storedCoins).countCoins ?? 0
  : 0;
let playerMiningRate = 1;
let autoMiningRate = 0;
let playerSmeltingRate = 1;
let playerSmithingRate = 1;
let playerFurnaces = 0;
let playerAnvils = 0;

const defaultPlayerState = {
  coins: 0,
  resources: {
    stone: 0,
    copper: 0,
    tin: 0,
    bronze: 0,
    bronzeMedHelm: 0
  },
  playerMiningRate: 1,
  purchasedPickaxes: {},
  autoMiningRate: 0,
  playerSmeltingRate: 1,
  playerSmithingRate: 1,
  objectivesProgress: 0,
  playerFurnaces: 0,
  playerAnvils: 0
}

const defaultResourceCounts = {
  stone: 0,
  copper: 0,
  tin: 0,
  bronze: 0,
  bronzeMedHelm: 0
};

let resourceCounts = (() => {
  const storedData = localStorage.getItem("resourceCounts");

  if (!storedData || storedData === "undefined") {
    return structuredClone(defaultResourceCounts);
  }

  try {
    const parsedData = JSON.parse(storedData);
    return { ...defaultResourceCounts, ...parsedData };
  } catch (e) {
    console.error("Error parsing resourceCounts:", e);
    return structuredClone(defaultResourceCounts);
  }
})();

const FURNACE_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmeltingRate: 1
};

const ANVIL_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmithingRate: 1
};

let playerState = loadPlayerState();
playerMiningRate    = playerState.playerMiningRate ?? 1;
autoMiningRate      = playerState.autoMiningRate ?? 0;
playerSmithingRate  = playerState.playerSmithingRate ?? 1;
countCoins          = playerState.coins ?? countCoins;
playerFurnaces      = playerState.playerFurnaces ?? 0;
playerAnvils        = playerState.playerAnvils ?? 0;
playerSmeltingRate  = playerFurnaces * FURNACE_CONFIG.playerSmeltingRate;
playerSmithingRate  = playerAnvils * ANVIL_CONFIG.playerSmithingRate;

function recalcSmeltingRate() {
  playerSmeltingRate = playerFurnaces * FURNACE_CONFIG.playerSmeltingRate;
}

function recalcSmithingRate() {
  playerSmithingRate = playerAnvils * ANVIL_CONFIG.playerSmithingRate;
}

function loadPlayerState() {
  const saved = localStorage.getItem("playerState");
  if (!saved) return structuredClone(defaultPlayerState);

  try {
    return {
      ...defaultPlayerState,
      ...JSON.parse(saved),
      resources: {
        ...defaultPlayerState.resources,
        ...JSON.parse(saved).resources
      }
    };
  } catch {
    return structuredClone(defaultPlayerState);
  }
}

function savePlayerProgress() {
  playerState.coins = countCoins;
  playerState.resources = resourceCounts;
  playerState.playerMiningRate = playerMiningRate;
  playerState.autoMiningRate = autoMiningRate;
  playerState.playerSmeltingRate = playerSmeltingRate;
  playerState.playerSmithingRate = playerSmithingRate;
  playerState.playerFurnaces = playerFurnaces;
  playerState.playerAnvils = playerAnvils;

  localStorage.setItem("playerState", JSON.stringify(playerState));
}

Object.keys(playerState.purchasedPickaxes).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.style.opacity = "1";
});

function getFurnaceCost() {
  return Math.floor(
    FURNACE_CONFIG.baseCost *
    Math.pow(FURNACE_CONFIG.costMultiplier, playerFurnaces)
  );
}

$("#furnace-buy").on("click", buyFurnace);
$("#anvil-buy").on("click", buyAnvil);

function updateCoinsDisplay() {
  $("#coins-count").text(countCoins);
  
  savePlayerProgress();
}
updateCoinsDisplay();
$("#objective-message").text(getActiveObjectiveMessage);

function updateResource(resource, amount) {
  if (resourceCounts.hasOwnProperty(resource)) {
    resourceCounts[resource] += amount;
    console.log(`${resource} updated to ${resourceCounts[resource]}`);
    localStorage.setItem("resourceCounts", JSON.stringify(resourceCounts));
    updateDisplay();
  } else {
    console.error(`Resource '${resource}' does not exist in resourceCounts.`);
  }
}

function updateDisplay() {
  document.querySelector('#stone-count').innerHTML = resourceCounts.stone || 0;
  document.querySelector('#copper-count').innerHTML = resourceCounts.copper || 0;
  document.querySelector('#tin-count').innerHTML = resourceCounts.tin || 0;
  document.querySelector('#bronze-count').innerHTML = resourceCounts.bronze || 0;
  document.querySelector('#bronze-med-helm-count').innerHTML = resourceCounts.bronzeMedHelm || 0;
}

updateDisplay();

function updateInfoMessage(message) {
  $("#info-message").text(message);
  savePlayerProgress();
}

const nodeCooldowns = {
  copper: false,
  tin: false,
  iron: false
};

const NODE_CONFIG = {
  copper: {
    selector: ".node__copper img",
    fullImg: "images/440px-Copper_rocks.png",
    cooldown: 250
  },
  tin: {
    selector: ".node__tin img",
    fullImg: "images/440px-Tin_rocks.png",
    cooldown: 250
  },
  iron: {
    selector: ".node__iron img",
    fullImg: "images/440px-Iron_rocks.png",
    cooldown: 3000
  }
};

const EMPTY_NODE_IMG = "images/440px-Rocks_(empty,_2).png";

function nodeCooldown(type) {
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

const counterStoneDisplay = document.querySelector('#stone-count');
const counterCopperDisplay = document.querySelector('#copper-count');
const counterTinDisplay = document.querySelector('#tin-count');

const NODE_REQUIREMENTS = {
  stone: 0,
  copper: 1,
  tin: 1,
  iron: 2,
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

function canMine(nodeType) {
  const requiredLevel = NODE_REQUIREMENTS[nodeType] ?? 0;
  const playerLevel = getHighestPickaxeLevel();

  if (playerLevel < requiredLevel) {
    updateInfoMessage("You need a better pickaxe to mine this.");
    return false;
  }
  return true;
}

$(".node__stone").on("click", () => {
  updateResource("stone", 1 * playerMiningRate);
  completeObjective("stone5", resourceCounts, countCoins);
  completeObjective("stone10", resourceCounts, countCoins);
  updateInfoMessage("You mine some stone.");
});

$(".node__copper").on("click", () => {
  if (nodeCooldowns.copper) return;
  if (!canMine("copper")) return;

  updateResource("copper", 0.5 * playerMiningRate);
  completeObjective("copperAndTin", resourceCounts, countCoins);
  updateInfoMessage("You mine some copper.");
  nodeCooldown("copper");
});

$(".node__tin").on("click", () => {
  if (nodeCooldowns.tin) return;
  if (!canMine("tin")) return;

  updateResource("tin", 0.5 * playerMiningRate);
  completeObjective("copperAndTin", resourceCounts, countCoins);
  updateInfoMessage("You mine some tin.");
  nodeCooldown("tin");
});

// PICKAXES
const pickaxes = [
  { itemName: "Bronze pickaxe", id: "pickaxe-bronze", cost: 10, miningRate: 2, type: "bronze" },
  { itemName: "Iron pickaxe", id: "pickaxe-iron", cost: 150, miningRate: 4, type: "iron" },
  { itemName: "Steel pickaxe", id: "pickaxe-steel", cost: 500, miningRate: 8, type: "steel" },
  { itemName: "Black pickaxe", id: "pickaxe-black", cost: 1000, miningRate: 10, type: "black" },
  { itemName: "Gold pickaxe", id: "pickaxe-gold", cost: 3000, miningRate: 15, type: "gold" },
  { itemName: "Mithril pickaxe", id: "pickaxe-mithril", cost: 4000, miningRate: 18, type: "mithril" },
  { itemName: "Adamant pickaxe", id: "pickaxe-adamant", cost: 10000, miningRate: 20, type: "adamant" },
  { itemName: "Runite pickaxe", id: "pickaxe-runite", cost: 50000, miningRate: 30, type: "rune" },
  { itemName: "Dragon pickaxe", id: "pickaxe-dragon", cost: 250000, miningRate: 50, type: "dragon" }
];

function getHighestPickaxeLevel () {
  return Object.keys(playerState.purchasedPickaxes)
    .map(id => pickaxeLevel[id] || 0)
    .reduce((max, val) => Math.max(max, val), 0);
}

const nodeRequirements = {
  tierOne: 0,
  tierTwo: 1,
  tierThree: 2,
  tierFour: 6
};

window.addEventListener("DOMContentLoaded", (event) => {
  pickaxes.forEach(({ id, cost, miningRate, type }) => {
    document.getElementById(id).addEventListener("click", () => buyPickaxe(id, cost, miningRate, type));
  });
})

function buyPickaxe(id, cost, miningRate, type) {
  const element = document.getElementById(id);

  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";

    playerState.purchasedPickaxes[id] = true;

    if (playerMiningRate < miningRate) playerMiningRate = miningRate;

    countCoins -= cost;
    updateCoinsDisplay();
    updateInfoMessage(`You buy a ${type} pickaxe.`);

    savePlayerProgress();

    const currentlyHasPickaxe = Object.keys(playerState.purchasedPickaxes).length > 0;

    completeObjective("buyPickaxe", resourceCounts, countCoins, currentlyHasPickaxe);
  } else if (element.style.opacity === "1") {
    updateInfoMessage("You've already bought that.");
  } else {
    updateInfoMessage("You don't have enough coins.");
  }
}

// Purchasing auto-miners
const autoMinerList = [
  { id: "human-miner-1", cost: 500, autoMiningRate: 1 },
  { id: "human-miner-2", cost: 500, autoMiningRate: 1 },
  { id: "human-miner-3", cost: 500, autoMiningRate: 1 }
] 

window.addEventListener("DOMContentLoaded", (event) => {
  autoMinerList.forEach(({ id, cost, autoMiningRate, ore, oreCounter }) => {
    document.getElementById(id).addEventListener("click", () => buyMiner(id, cost, autoMiningRate, ore, oreCounter));
  });
})

let miningIntervalId = null;

function buyMiner(id, cost, autoMiningRate) {
  const element = document.getElementById(id);
  
  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    countCoins -= cost;
    autoMiningRate += autoMiningRate;

    updateCoinsDisplay();
    updateInfoMessage("You buy a miner.");

    startMining();

  } else if (countCoins < cost) {
    infoMessage = "You don't have enough coins.";

  } else {
    infoMessage = "You've already bought that.";
  }
}

const oreList = [
  { type: "stone", count: resourceCounts.stone, counter: counterStoneDisplay },
  { type: "copper", count: resourceCounts.copper, counter: counterCopperDisplay },
  { type: "tin", count: resourceCounts.tin, counter: counterTinDisplay },
]

function startMining() {
  if (miningIntervalId) {
    clearInterval(miningIntervalId);
  }

  const oreType = document.getElementById("mining-selection").value;

  console.log("Ore type:", oreType)

  const selectedOreObj = oreList.find(ore => ore.type === oreType);


  if (selectedOreObj && currentAutoMiningRate > 0) {
    const intervalDuration = 3000 / currentAutoMiningRate;

    miningIntervalId = setInterval(() => {
      // let canMine = true;

      // for (const material in selectedOreObj.rawMaterials) {
      //   const requiredAmount = selectedIngotObj.rawMaterials[material];
      //   if (resourceCounts[material] < requiredAmount) {
      //     canSmelt = false;
      //     break;
      //   }
      // }

      // if (canSmelt) {
      //   for (const material in selectedIngotObj.rawMaterials) {
      //     const requiredAmount = selectedIngotObj.rawMaterials[material];

      //     resourceCounts[material] -= requiredAmount;

        // let oreDisplay = `counter${capitalize(JSON.stringify(selectedOreObj))}Count`;
        // console.log("Ore display:", oreDisplay);

        // updateDisplay(oreDisplay, resourceCounts[ore]);

        selectedOreObj.count++;
        resourceCounts[oreType]++;

        // completeObjective("automine");
        updateDisplay(selectedOreObj.counter, selectedOreObj.count);
    }, intervalDuration); 
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("mining-selection").addEventListener("change", () => startMining());
});
// END OF MINING


// Sell resources
let selectedResource = null;

function selectResource(resourceId) {
  selectedResource = resourceId;

  const resourceCount = getResourceCount(resourceId);
  const slider = document.getElementById("sell-slider");
  const label = document.getElementById("sell-label");

  slider.max = resourceCount;
  slider.value = 0;
  label.textContent = `Sell 0 ${getResourceName(resourceId)}`;
}

function getResourceCount(resourceId) {
  switch(resourceId) {
    case "resource-stone": return resourceCounts.stone;
    case "resource-copper": return resourceCounts.copper;
    case "resource-tin": return resourceCounts.tin;
    case "resource-bronze": return resourceCounts.bronze;
    case "resource-bronze-med-helm": return resourceCounts.bronzeMedHelm;
    default: return 0;
  }
}

function getResourceName(resourceId) {
  return resourceId.split("-").slice(1).join(" "); // e.g. "resource-stone" → "stone"
}

// Update label dynamically as slider moves
document.getElementById("sell-slider").addEventListener("input", (e) => {
  const value = parseInt(e.target.value);
  const label = document.getElementById("sell-label");
  if (selectedResource) {
    label.textContent = `Sell ${value} ${getResourceName(selectedResource)}`;
  }
});

// Confirm sale
$("#sell-confirm").on("click", () => {
  if (!selectedResource) return;

  const slider = document.getElementById("sell-slider");
  const amountToSell = parseInt(slider.value);
  if (amountToSell <= 0) return;

  switch(selectedResource) {
    case "resource-stone":
      countCoins += amountToSell;
      resourceCounts.stone -= amountToSell;
      updateDisplay(counterStoneDisplay, resourceCounts.stone);
      break;
    case "resource-copper":
      countCoins += amountToSell * 2;
      resourceCounts.copper -= amountToSell;
      updateDisplay(counterCopperDisplay, resourceCounts.copper);
      break;
    case "resource-tin":
      countCoins += amountToSell * 2;
      resourceCounts.tin -= amountToSell;
      updateDisplay(counterTinDisplay, resourceCounts.tin);
      break;
    case "resource-bronze":
      countCoins += amountToSell * 5;
      resourceCounts.bronze -= amountToSell;
      updateDisplay(counterBronzeDisplay, resourceCounts.bronze);
      break;
    case "resource-bronze-med-helm":
      countCoins += amountToSell * 15;
      resourceCounts.bronzeMedHelm -= amountToSell;
      updateDisplay(bronzeMedHelmCount, resourceCounts.bronzeMedHelm);
      break;
  }

  updateCoinsDisplay();
  updateInfoMessage(`You sell ${amountToSell} ${getResourceName(selectedResource)}.`);

  slider.value = 0;
  slider.max = getResourceCount(selectedResource);
  document.getElementById("sell-label").textContent = `Sell 0 ${getResourceName(selectedResource)}`;

  completeObjective("sell10", resourceCounts, countCoins);
});

$(".sellable").on("click", function() {
  $(".sellable").removeClass("selectedOre");
  $(this).addClass("selectedOre");

  const resourceId = this.id;
  selectResource(resourceId);
});

const counterBronzeDisplay = document.getElementById("bronze-count");

const ingotList = [
  {
    type: "bronze",
    counter: counterBronzeDisplay,
    rawMaterials: { copper: 1, tin: 1 }
  }
];

function updateFurnaceUI() {
  document.getElementById("furnace-cost").textContent =
    `Cost: ${getFurnaceCost()} coins`;

  document.getElementById("furnace-count").textContent =
    `${playerFurnaces}`;
}

function buyFurnace() {
    const cost = getFurnaceCost();

    if (countCoins < cost) {
      updateInfoMessage("You don't have enough coins.");
      return;
    }

    countCoins -= cost;
    playerFurnaces++;
    console.log(playerFurnaces)
    recalcSmeltingRate();

    updateCoinsDisplay();
    completeObjective("buyFurnace", playerFurnaces);
    savePlayerProgress();
    updateFurnaceUI();
    updateInfoMessage("You buy a furnace.");
  }

const baseSmeltInterval = 3000;
const minSmeltInterval = 300;

function getSmeltInterval() {
  return Math.max(
    minSmeltInterval,
    baseSmeltInterval / Math.log2(playerFurnaces + 2)
  );
}

function getSmeltPerTick() {
  return Math.max(
    1,
    Math.floor(Math.pow(playerFurnaces, 0.6))
  );
}

let smeltingIntervalId = null;

function startSmelting() {
  stopSmelting();

  const ingotType = document.getElementById("ingot-selection").value;
  const selectedIngot = ingotList.find(i => i.type === ingotType);

  if (!selectedIngot || playerFurnaces <= 0) return;

  const interval = getSmeltInterval();

  smeltingIntervalId = setInterval(() => {
    const smeltAmount = getSmeltPerTick();

    for (let i = 0; i < smeltAmount; i++) {
      let canSmelt = true;

      for (const material in selectedIngot.rawMaterials) {
        if (resourceCounts[material] < selectedIngot.rawMaterials[material]) {
          canSmelt = false;
        }
      }

      if (!canSmelt) break;

      for (const material in selectedIngot.rawMaterials) {
        resourceCounts[material] -= selectedIngot.rawMaterials[material];
      }

      resourceCounts[selectedIngot.type]++;
    }

    completeObjective("smeltIngot", resourceCounts, countCoins);
    updateDisplay();
    savePlayerProgress();
    

  }, interval);
}

function stopSmelting() {
  if (smeltingIntervalId !== null) {
    clearInterval(smeltingIntervalId);
    smeltingIntervalId = null;
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  $("#ingot-selection").on("change", () => startSmelting());
});
// END OF SMELTING


// SMITHING
const bronzeMedHelm = document.getElementById("bronze-med-helm-count");

const productList = [
  {
    type: "bronzeMedHelm",
    counter: bronzeMedHelm,
    rawMaterials: { bronze: 1 },
    price: 10,
    timeToSmith: 5000
  }
];

function updateAnvilUI() {
  document.getElementById("anvil-cost").textContent =
    `Cost: ${getAnvilCost()} coins`;

  document.getElementById("anvil-count").textContent =
    `${playerAnvils}`;
}

function buyAnvil() {
  const cost = getAnvilCost();

  if (countCoins < cost) {
    updateInfoMessage("You don't have enough coins.");
    return;
  }

  countCoins -= cost;
  playerAnvils++;
  recalcSmithingRate();

  updateCoinsDisplay();
  completeObjective("buyAnvil", playerAnvils);
  savePlayerProgress();
  updateAnvilUI();
  updateInfoMessage("You buy an anvil.");
  startSmithing();
}

let smithingIntervalId = null;

function getAnvilCost() {
  return Math.floor(
    ANVIL_CONFIG.baseCost *
    Math.pow(ANVIL_CONFIG.costMultiplier, playerAnvils)
  );
}

function startSmithing() {  
  stopSmithing();

  const productType = document.getElementById("product-selection").value;
  const selectedProduct = productList.find(i => i.type === productType);

  if (!selectedProduct || playerAnvils <= 0) return;

  const interval = selectedProduct.timeToSmith;

  smithingIntervalId = setInterval(() => {
  const smithAmount = Math.max(1, playerSmithingRate);

  for (let i = 0; i < smithAmount; i++) {
    let canSmith = true;

    for (const material in selectedProduct.rawMaterials) {
      if (resourceCounts[material] < selectedProduct.rawMaterials[material]) {
        canSmith = false;
        break;
      }
    }

    if (!canSmith) break;

    for (const material in selectedProduct.rawMaterials) {
      resourceCounts[material] -= selectedProduct.rawMaterials[material];
    }

    resourceCounts[selectedProduct.type]++;
    console.log("Helms:", resourceCounts.bronzeMedHelm);
  }

    completeObjective("smithHelmet", resourceCounts, countCoins);
    updateDisplay();
    savePlayerProgress();
  }, interval);
}

function stopSmithing() {
  clearInterval(smithingIntervalId);
  smithingIntervalId = null;
}

window.addEventListener("DOMContentLoaded", (event) => {
  $("#product-selection").on("change", () => startSmithing());
});

let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

const popup = document.getElementById("stats-popup");

function updatePopupPosition() {
  const popupRect = popup.getBoundingClientRect();
  const popupWidth = popupRect.width;

  const offsetX = 10;
  const offsetY = -80;

  let x = mouseX + offsetX;
  let y = mouseY + offsetY;

  if (x + popupWidth > window.innerWidth) {
    x = mouseX - popupWidth - offsetX;
  }

  if (y < 0) {
    y = mouseY + 20;
  }

  popup.style.transform = `translate(${x}px, ${y}px)`;

  if (isMouseMoving) {
    requestAnimationFrame(updatePopupPosition);
  }
}

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  const hovered = document
    .elementFromPoint(mouseX, mouseY)
    ?.closest(".purchasable-item");

  if (!hovered) {
    popup.style.display = "none";
    isMouseMoving = false;
    return;
  }

  const data = pickaxes.find(p => p.id === hovered.id);
  if (!data) return;

  popup.style.display = "block";
  popup.innerHTML = `
    <span class="orange-highlight item-title">${data.itemName}</span><br>
    Price: <span class="orange-highlight">${data.cost}</span><br>
    Mult: <span class="orange-highlight">x${data.miningRate}</span>
  `;

  if (!isMouseMoving) {
    isMouseMoving = true;
    requestAnimationFrame(updatePopupPosition);
  }
});

document.addEventListener("mouseout", () => {
  isMouseMoving = false;
  popup.style.display = "none";
});

// Dev tools
$("#reset-money").on("click", function() {
  countCoins = 0;
  updateCoinsDisplay();
});

$("#mo-money").on("click", function() {
  countCoins += 1000;
  updateCoinsDisplay();
});

$("#reset-all").on("click", function() {
  localStorage.clear();
  window.location.reload();
});

