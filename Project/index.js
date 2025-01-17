import data from './player_progress.js'


// Mineshaft
const stoneNode = document.getElementById("stone-node");
const copperNode = document.getElementById("copper-node");
const tinNode = document.getElementById("tin-node");
const motherlodeNode = document.getElementById("motherlode-node");
const oreNodeList = [stoneNode, copperNode, tinNode]; 


// RETRIEVE PLAYER PROGRESS
let countCoins = localStorage.getItem("countCoins") ? JSON.parse(localStorage.getItem("countCoins")).countCoins : 150;

let counterCoinsDisplay = document.querySelector('#coins-count');
function updateCoinsDisplay() {
  counterCoinsDisplay.innerHTML = countCoins;
  
  savePlayerProgress();
}
updateCoinsDisplay();


const defaultResourceCounts = { stone: 0, copper: 0, tin: 0, bronze: 0, bronzeMediumHelmet: 0 };

// Retrieve and validate resourceCounts from local storage
let resourceCounts = (() => {
  const storedData = localStorage.getItem("resourceCounts");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      return { ...defaultResourceCounts, ...parsedData };
    } catch (e) {
      console.error("Error parsing resourceCounts from localStorage:", e);
    }
  }
  return { ...defaultResourceCounts };
})();

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


let miningRate = 1;


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
  document.getElementById("info-message").textContent = message;
  savePlayerProgress();
}


// Mining ores
const counterStoneDisplay = document.querySelector('#stone-count');
const counterCopperDisplay = document.querySelector('#copper-count');
const counterTinDisplay = document.querySelector('#tin-count');

stoneNode.addEventListener("click", () => {
  // resourceCounts.stone += 1 * miningRate;
  updateDisplay(counterStoneDisplay, resourceCounts.stone);
  updateResource("stone", 1 * miningRate);
  completeObjective("stone5");
  completeObjective("stone10");
  updateInfoMessage("You mine some stone.");
});
// Would this be better to create a separate event listener and then removeEventListener for the objectives?

copperNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    resourceCounts.copper += 0.5 * miningRate;
    updateDisplay(counterCopperDisplay, resourceCounts.copper);
    updateInfoMessage("You mine some copper.");
    completeObjective("copperAndTin");
  } else {
    updateInfoMessage("You need a pickaxe.");
  }
});

tinNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    resourceCounts.tin += 0.5 * miningRate;
    updateDisplay(counterTinDisplay, resourceCounts.tin);
    updateInfoMessage("You mine some tin.");
    completeObjective("copperAndTin");
  } else {
    updateInfoMessage("You need a pickaxe.");
  }
});


let objective = [
  {
    id: "dummy",
    message: "You shouldn't be seeing this.",
    condition: "None.",
    complete: true,
    unlock: "none"
  },
  {
    id: "stone5",
    message: "Mine 5 stone by clicking on the node in the Mineshaft.",
    condition: () => resourceCounts.stone >= 5,
    complete: false,
  },
  {
    id: "stone10",
    message: "Mine 10 stone.",
    condition: () => resourceCounts.stone >= 10,
    complete: false
  },
  {
    id: "sellAll",
    message: "Click on the stone icon under Resources and then click 'Sell all'.",
    condition: () => countCoins >= 30,
    complete: false,
    unlock: () => {
      $("#tools").css("display", "block");
    }
  },
  {
    id: "buyPickaxe",
    message: "Now, buy yourself a pickaxe from the Shop by clicking on it.",
    condition: () => hasPickaxe == true,
    complete: false,
    unlock: () => {
      $("#copper-node").css("display", "block");
      $("#tin-node").css("display", "block");
    }
  },
  {
    id: "copperAndTin",
    message: "Mine some copper and tin.",
    condition: () => resourceCounts.copper > 0 && resourceCounts.tin > 0,
    complete: false,
    unlock: () => {
      $("#furnaces").css("display", "block");
      $("#resource-bronze").css("display", "block");
    }
  },
  {
    id: "smeltIngot",
    message: "Once you have enough money, purchase your first Furnace and select Bronze in the drop-down menu.",
    condition: () => resourceCounts.bronze > 0,
    complete: false,
    unlock: () => {
      $("#blacksmiths").css("display", "block");
      $("#resource-bronze-med-helm").css("display", "block");
      $("#resources-products").css("display", "block");
    }
  },
  {
    id: "buySmith",
    message: "Let's turn your bronze into something useful. Grab yourself an anvil from the shop.",
    condition: () => document.getElementById("human-smith-1").style.opacity = 1,
    complete: false,
    unlock: () => {
      
    }
  },
  {
    id: "smithHelmet",
    message: "Now select 'Bronze medium helmet' from the drop-down menu.",
    condition: () => resourceCounts.bronzeMediumHelmet > 0,
    complete: false,
    unlock: () => {
      // Unlock more products to smith
    }
  },
  {
    id: "coins250",
    message: "See if you can get to 250 coins.",
    condition: () => countCoins >= 250,
    complete: false,
    unlock: () => {
      $("#auto-miner-shop").css("display", "block")
    }
  }
]

let objectiveMessage = document.getElementById("objective-message");


function updateObjectiveMessage() {
  const activeObjective = objective.find(obj => !obj.complete);
  if (activeObjective) {
    objectiveMessage.innerHTML = activeObjective.message;
  } else {
    objectiveMessage.innerHTML = "All objectives completed!";
  }
}

updateObjectiveMessage();

function completeObjective(objectiveId) {
  const obj = objective.find(obj => obj.id === objectiveId);

  if (obj && obj.condition(resourceCounts.stone, resourceCounts.copper, resourceCounts.tin, resourceCounts.bronze)) {
    obj.complete = true;
    // Remove event listener
    updateObjectiveMessage();
    if (obj.unlock) obj.unlock();
  }
  else {
    console.log(`Condition '${objectiveId}' not met.`) }
}


// PICKAXES
let hasPickaxe = false;
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

window.addEventListener("DOMContentLoaded", (event) => {
  pickaxes.forEach(({ id, cost, miningRate, type }) => {
    document.getElementById(id).addEventListener("click", () => buyPickaxe(id, cost, miningRate, type));
  });
})

function buyPickaxe(id, cost, newMiningRate, type) {
const element = document.getElementById(id);

  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    if (miningRate < newMiningRate) {
      miningRate = newMiningRate;
    }
    countCoins -= cost;
    updateCoinsDisplay();
    updateInfoMessage(`You buy a ${type} pickaxe.`);
    hasPickaxe = true;
    completeObjective("buyPickaxe");
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

let currentAutoMiningRate = 0;
let miningIntervalId = null;

function buyMiner(id, cost, autoMiningRate) {
  const element = document.getElementById(id);
  
  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    countCoins -= cost;
    currentAutoMiningRate += autoMiningRate;

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
let selectedOre;
let selectedCounter;

function selectOre(element)
{
  $(element).addClass("selectedOre");
}

$(".sellable").on("click", function()
{
  $(".sellable").removeClass("selectedOre");
  if (!$(this).hasClass("selectedOre"))
  {
    selectOre(this);
    selectedOre = this.id;
    selectedCounter = $(this).children("span")[0].innerHTML;

    $("#sell-all").value = "Sell all " + selectedOre;

    console.log("Selected resource: " + selectedOre)
    console.log("Selected counter: " + selectedCounter);
  }
});

$("#sell-one").on("click", function()
  {
    completeObjective("coins250");
    switch(selectedOre) {
      case "resource-stone":
        if (resourceCounts.stone > 0) {
          countCoins++;
          resourceCounts.stone--;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, resourceCounts.stone);
          updateInfoMessage("You sell some Stone.");
        }
        break;
      case "resource-copper":
        if (resourceCounts.copper > 0) {
          countCoins += 2;
          resourceCounts.copper--;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, resourceCounts.copper);
          updateInfoMessage("You sell some Copper.");
        }
        break;
      case "resource-tin":
        if (resourceCounts.tin > 0) {
          countCoins += 2;
          resourceCounts.stone--;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, resourceCounts.tin);
          updateInfoMessage("You sell some Tin.");
          }
          break;
      case "resource-bronze":
        if (resourceCounts.bronze > 0) {
          countCoins += 5;
          resourceCounts.bronze--;
          updateCoinsDisplay();
          updateDisplay(counterBronzeDisplay, resourceCounts.bronze);
          updateInfoMessage("You sell a Bronze ingot.");
        }
        break;
      case "resource-bronze-med-helm":
        if (resourceCounts.bronzeMediumHelmet > 0) {
          countCoins += 15;
          resourceCounts.bronzeMediumHelmet--;
          updateCoinsDisplay();
          updateDisplay(bronzeMedHelmCount, resourceCounts.bronzeMediumHelmet);
          updateInfoMessage("You sell a Bronze Medium Helmet.");
        }
        break;
    }
  }
);

$("#sell-all").on("click", function()
  {
    completeObjective("coins250");
    switch(selectedOre) {
      case "resource-stone":
        if (resourceCounts.stone > 0) {
          countCoins += resourceCounts.stone;
          resourceCounts.stone = 0;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, resourceCounts.stone);
          updateInfoMessage("You sell all your stone.");
          completeObjective("sellAll");
        }
        break;
      case "resource-copper":
        if (resourceCounts.copper > 0) {
          countCoins += resourceCounts.copper * 2;
          resourceCounts.copper = 0;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, resourceCounts.copper);
          updateInfoMessage("You sell all your copper.");
        }
        break;
      case "resource-tin":
        if (resourceCounts.tin > 0) {
          countCoins += resourceCounts.tin * 2;
          resourceCounts.tin = 0;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, resourceCounts.tin);
          updateInfoMessage("You sell all your tin.");
        }
        break;
      case "resource-bronze":
        if (resourceCounts.bronze > 0) {
          countCoins += resourceCounts.bronze * 5;
          resourceCounts.bronze = 0;
          updateCoinsDisplay();
          updateDisplay(counterBronzeDisplay, resourceCounts.bronze);
          updateInfoMessage("You sell all your bronze ingots.");
        }
        break;
      case "resource-bronze-med-helm":
        if (resourceCounts.bronzeMediumHelmet > 0) {
          countCoins += resourceCounts.bronzeMediumHelmet * 15;
          resourceCounts.bronzeMediumHelmet = 0;
          updateCoinsDisplay();
          updateDisplay(bronzeMedHelmCount, resourceCounts.bronzeMediumHelmet);
          updateInfoMessage("You sell all your Bronze Medium Helmets.");
        }
        break;
    }
  }
);

$("#sell-custom-amount-btn").on("click", function()
  {
    const customAmount = parseInt(document.getElementById("sell-custom-amount").value) || 0;

    completeObjective("coins250");

    switch(selectedOre) {
      case "resource-stone":
        if (resourceCounts.stone > customAmount && customAmount > 0) {
          countCoins += customAmount;
          resourceCounts.stone -= customAmount;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, resourceCounts.stone);
          updateInfoMessage(`You sell ${customAmount} stone.`);
          console.log("Custom amount:", customAmount)
        }
        break;
      case "resource-copper":
        if (resourceCounts.copper > 0) {
          countCoins += customAmount * 2;
          resourceCounts.copper -= customAmount;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, resourceCounts.copper);
          updateInfoMessage(`You sell ${customAmount} copper.`);
        }
        break;
      case "resource-tin":
        if (resourceCounts.tin > 0) {
          countCoins += customAmount * 2;
          resourceCounts.stone -= customAmount;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, resourceCounts.tin);
          updateInfoMessage(`You sell ${customAmount} tin.`);
          }
          break;
      case "resource-bronze":
        if (resourceCounts.bronze > 0) {
          countCoins += customAmount * 5;
          resourceCounts.bronze -= customAmount;
          updateCoinsDisplay();
          updateDisplay(counterBronzeDisplay, resourceCounts.bronze);
          updateInfoMessage("You sell some Bronze ingots.");
        }
        break;
      case "resource-bronze-med-helm":
        if (resourceCounts.bronzeMediumHelmet > 0) {
          countCoins += resourceCounts.bronzeMediumHelmet * 15;
          resourceCounts.bronzeMediumHelmet -= customAmount;
          updateCoinsDisplay();
          updateDisplay(bronzeMedHelmCount, resourceCounts.bronzeMediumHelmet);
          updateInfoMessage("You sell some Bronze Medium Helmets.");
        }
        break;
    }
  }
);



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
    const intervalDuration = 3000 / currentSmeltingRate;

    smeltingIntervalId = setInterval(() => {
      let canSmelt = true;

      for (const material in selectedIngotObj.rawMaterials) {
        const requiredAmount = selectedIngotObj.rawMaterials[material];
        if (resourceCounts[material] < requiredAmount) {
          canSmelt = false;
          break;
        }
      }

      if (canSmelt) {
        for (const material in selectedIngotObj.rawMaterials) {
          const requiredAmount = selectedIngotObj.rawMaterials[material];

          resourceCounts[material] -= requiredAmount;

          let materialDisplay = document.getElementById(`${material}-count`);

          updateDisplay(materialDisplay, resourceCounts[material]);
        }

        selectedIngotObj.count++;
        resourceCounts[ingotType]++;

        completeObjective("smeltIngot");
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
    const intervalDuration = 3000 / currentSmithingRate;

    smithingIntervalId = setInterval(() => {
      let canSmith = true;

      for (const material in selectedProductObj.ingots) {
        const requiredAmount = selectedProductObj.ingots[material];
        if (resourceCounts[material] < requiredAmount) {
          canSmith = false;
          break;
        }
      }

      if (canSmith) {
        for (const material in selectedProductObj.ingots) {
          const requiredAmount = selectedProductObj.ingots[material];

          resourceCounts[material] -= requiredAmount;

          let ingotDisplay = document.getElementById(`${material}-count`);

          updateDisplay(ingotDisplay, resourceCounts[material]);
        }

        selectedProductObj.count++;
        resourceCounts[productType]++;

        updateDisplay(selectedProductObj.counter, selectedProductObj.count);
        completeObjective("smithHelmet");

        console.log("Selected product count:", selectedProductObj.count)
        console.log('resourceCounts:', resourceCounts);
        console.log("Helmet count:", resourceCounts.bronzeMediumHelmet);
        console.log('Checking smithHelmet condition:', objective.find(obj => obj.id === "smithHelmet").condition());
        }
    }, intervalDuration);
    
  }
}
// END OF SMITHING



function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice
}


// STATS POPUP
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

const popup = document.getElementById("stats-popup");

function updatePopupPosition() {
  popup.style.transform = `translate(${mouseX - 100}px, ${mouseY - 60}px)`;

  if (isMouseMoving) {
    requestAnimationFrame(updatePopupPosition);
  }
}

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  const hoveredElement = document.elementFromPoint(mouseX, mouseY);
  // const purchasableItem = hoveredElement?.closest(".purchasable-item");

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

// Persist resource counts and purchases
function savePlayerProgress(resourceCounts) {
  localStorage.setItem("countCoins", JSON.stringify({countCoins}));
  localStorage.setItem("resourceCounts", JSON.stringify({resourceCounts}));
  
  // localStorage.setItem("playerItems", JSON.stringify({playerItems}));
}

// Dev tools
$("#reset-money").click(function() {
  countCoins = 0;
  updateCoinsDisplay();
});

$("#mo-money").click(function() {
  countCoins += 1000;
  updateCoinsDisplay();
});

