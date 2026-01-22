import {
  completeObjective,
  getActiveObjectiveMessage,
  loadObjectivesProgress
} from "./objectives.js";

window.addEventListener("DOMContentLoaded", () => {
  loadObjectivesProgress();
  $("#objective-message").text(getActiveObjectiveMessage());
});

const storedCoins = localStorage.getItem("countCoins");
export let countCoins = storedCoins
  ? JSON.parse(storedCoins).countCoins ?? 0
  : 0;
let playerMiningRate = 1;
let autoMiningRate = 0;
let smithingRate = 1;
let smeltingRate = 1;

const defaultPlayerState = {
  coins: 0,
  resources: {
    stone: 0,
    copper: 0,
    tin: 0,
    bronze: 0,
    bronzeMediumHelmet: 0
  },
  playerMiningRate: 1,
  purchasedPickaxes: {},
  autoMiningRate: 0,
  smeltingRate: 1,
  smithingRate: 1,
  objectivesProgress: 0
}

const defaultResourceCounts = {
  stone: 0,
  copper: 0,
  tin: 0,
  bronze: 0,
  bronzeMediumHelmet: 0
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


let playerState = loadPlayerState();


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
  playerState.smeltingRate = smeltingRate;
  playerState.smithingRate = smithingRate;

  localStorage.setItem("playerState", JSON.stringify(playerState));
}

Object.keys(playerState.purchasedPickaxes).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.style.opacity = "1";
});

function updateCoinsDisplay() {
  $("counter-coins-display").innerHTML = countCoins;
  
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
  document.querySelector('#bronze-count').innerHTML = resourceCounts.bronze || 0;
  document.querySelector('#bronze-med-helm-count').innerHTML = resourceCounts.bronzeMediumHelmet || 0;
}

updateDisplay();

function updateInfoMessage(message) {
  $("#info-message").text = message;
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
    cooldown: 2000
  },
  tin: {
    selector: ".node__tin img",
    fullImg: "images/440px-Tin_rocks.png",
    cooldown: 2000
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

  setTimeout(() => {
    img.src = config.fullImg;
    nodeCooldowns[type] = false;
  }, config.cooldown);
}

const counterStoneDisplay = document.querySelector('#stone-count');
const counterCopperDisplay = document.querySelector('#copper-count');
const counterTinDisplay = document.querySelector('#tin-count');

$(".node__stone").on("click", () => {
  updateResource("stone", 1 * playerMiningRate);
  completeObjective("stone5", resourceCounts, countCoins);
  completeObjective("stone10", resourceCounts, countCoins);
  updateInfoMessage("You mine some stone.");
});

$(".node__copper").on("click", () => {
  if (nodeCooldowns.copper) return;

  updateResource("copper", 0.5 * playerMiningRate);
  updateInfoMessage("You mine some copper.");
  nodeCooldown("copper");
});

$(".node__tin").on("click", () => {
  if (nodeCooldowns.tin) return;

  updateResource("tin", 0.5 * playerMiningRate);
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
    case "resource-bronze-med-helm": return resourceCounts.bronzeMediumHelmet;
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
      resourceCounts.bronzeMediumHelmet -= amountToSell;
      updateDisplay(bronzeMedHelmCount, resourceCounts.bronzeMediumHelmet);
      break;
  }

  updateCoinsDisplay();
  updateInfoMessage(`You sold ${amountToSell} ${getResourceName(selectedResource)}.`);

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

// SMELTING
const furnaceList = [
  { id: "furnace1", cost: 50, smeltingRate: 1 },
  { id: "furnace2", cost: 200, smeltingRate: 1 },
  { id: "furnace3", cost: 500, smeltingRate: 1 },
  { id: "furnace4", cost: 1000, smeltingRate: 1 },
  { id: "furnace5", cost: 2500, smeltingRate: 1 },
  { id: "furnace6", cost: 5000, smeltingRate: 1 },
  { id: "furnace7", cost: 8000, smeltingRate: 1 },
  { id: "furnace8", cost: 10000, smeltingRate: 1 },
] 

const counterBronzeDisplay = document.getElementById("bronze-count");

const ingotList = [
  { type: "bronze", count: resourceCounts.bronze, counter: counterBronzeDisplay, rawMaterials: {copper: 1, tin: 1} }
]

let currentSmeltingRate = 0;
function buyFurnace(id, cost, smeltingRate) {
  const element = document.getElementById(id);
  
  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    countCoins -= cost;
    currentSmeltingRate += smeltingRate;

    updateCoinsDisplay();
    updateInfoMessage("You buy a furnace.");

  } else if (countCoins < cost) {
    updateInfoMessage("You don't have enough coins.");

  } else {
    updateInfoMessage("You've already bought that.");
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  furnaceList.forEach(({ id, cost, smeltingRate, ingotCounter }) => {
    document.getElementById(id).addEventListener("click", () => buyFurnace(id, cost, smeltingRate, ingotCounter));
  });
})

let smeltingIntervalId = 0;

function startSmelting() {
  if (smeltingIntervalId) {
    clearInterval(smeltingIntervalId);
  }

  const ingotType = document.getElementById("ingot-selection").value;
  const selectedIngotObj = ingotList.find(ingot => ingot.type === ingotType);


  if (selectedIngotObj && currentSmeltingRate > 0) {
    smeltingIntervalId = setInterval(() => {
      let canSmelt = true;
  
      for (const material in selectedIngotObj.rawMaterials) {
        if (resourceCounts[material] < selectedIngotObj.rawMaterials[material]) {
          canSmelt = false;
          break;
        }
      }
  
      if (canSmelt) {
        for (const material in selectedIngotObj.rawMaterials) {
          resourceCounts[material] -= selectedIngotObj.rawMaterials[material];
        }
        selectedIngotObj.count++;
        resourceCounts[selectedIngotObj.type]++;
        completeObjective("smeltIngot", resourceCounts, countCoins);
        updateDisplay(selectedIngotObj.counter, selectedIngotObj.count);
      }
    }, intervalDuration);
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("ingot-selection").addEventListener("change", () => startSmelting());
});
// END OF SMELTING



// SMITHING
const bronzeMedHelmCount = document.getElementById("bronze-med-helm-count");

const productList = [
  {
    type: "bronzeMediumHelmet", count: resourceCounts.bronzeMediumHelmet, counter: bronzeMedHelmCount, ingots: {bronze: 1}, price: 10, smithingRate: 1
  }
]

const blacksmiths = [
  { id: "human-smith-1", cost: 30, smithingRate: 1 },
  { id: "human-smith-2", cost: 50, smithingRate: 1 },
  { id: "human-smith-3", cost: 100, smithingRate: 1 }
]


window.addEventListener("DOMContentLoaded", (event) => {
  blacksmiths.forEach(({ id, cost, smithingRate }) => {
    document.getElementById(id).addEventListener("click", () => buySmith(id, cost, smithingRate));
  });
})

let currentSmithingRate = 0;
function buySmith(id, cost, smithingRate) {
  const element = document.getElementById(id);
  
  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    countCoins -= cost;
    currentSmithingRate += smithingRate;

    updateCoinsDisplay();
    updateInfoMessage("You hire a Blacksmith.");
    completeObjective("buySmith");

  } else if (countCoins < cost) {
    updateInfoMessage("You don't have enough coins.");

  } else {
    updateInfoMessage("You've already bought that.");
  }
}



const smithList = [
  { id: "human-smith-1", cost: 50, smithingRate: 1 },
  { id: "human-smith-2", cost: 200, smithingRate: 1 },
  { id: "human-smith-3", cost: 500, smithingRate: 1 }
]

let smithingIntervalId = 0;

function startSmithing() {
  if (smithingIntervalId) {
    clearInterval(smithingIntervalId);
  }

  const productType = document.getElementById("smithing-selection").value;
  const selectedProductObj = productList.find(product => product.type === productType);

  console.log("Selected product: " + productType)
  console.log("Found product: " + selectedProductObj.type)


  if (selectedProductObj && currentSmithingRate > 0) {
    smithingIntervalId = setInterval(() => {
      let canSmith = true;
  
      for (const material in selectedProductObj.ingots) {
        if (resourceCounts[material] < selectedProductObj.ingots[material]) {
          canSmith = false;
          break;
        }
      }
  
      if (canSmith) {
        for (const material in selectedProductObj.ingots) {
          resourceCounts[material] -= selectedProductObj.ingots[material];
        }
        selectedProductObj.count++;
        resourceCounts[selectedProductObj.type]++;
        updateDisplay(selectedProductObj.counter, selectedProductObj.count);
        completeObjective("smithHelmet", resourceCounts, countCoins);
      }
    }, intervalDuration);
  }
}

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

  const hoveredElement = document.elementFromPoint(mouseX, mouseY);

  if (!hoveredElement) {
    popup.style.display = "none";
    return;
  }

  const allPurchasableItems = [...pickaxes, ...furnaceList];

  const hoveredElementData = allPurchasableItems.find(item => item.id === hoveredElement.id);


  if (hoveredElementData && hoveredElement.classList.contains("purchasable-item")) {
    popup.style.display = "block";

    let popupContent = `<span class="orange-highlight item-title">${hoveredElementData.itemName}</span><br>Price: <span class="orange-highlight">${hoveredElementData.cost}</span>`;

    if (hoveredElementData.miningRate !== undefined)  {
      popupContent += `<br>Mult: <span class="orange-highlight">x${hoveredElementData.miningRate}</span>`;
    }
  
    if (hoveredElementData.smeltingRate !== undefined)  {
      popupContent += `<br>Mult: x${hoveredElementData.smeltingRate}`;
    }

      popup.innerHTML = popupContent;
    } else { 
        popup.innerHTML = "???";    
    }


  if (!isMouseMoving) {
    isMouseMoving = true;
    requestAnimationFrame(updatePopupPosition);
  }
});

document.addEventListener("mouseout", () => {
  isMouseMoving = false;
  popup.style.display = "none";
});

window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("smithing-selection").addEventListener("change", () => {
    startSmithing();
    console.log("Start smithing");
  });
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

