// Mineshaft
const stoneNode = document.getElementById("stone-node");
const copperNode = document.getElementById("copper-node");
const tinNode = document.getElementById("tin-node");
const motherlodeNode = document.getElementById("motherlode-node");
const oreNodeList = [stoneNode, copperNode, tinNode]; 


// Select random ore to display
// let currentOreNode = null;

// function createRandomOreNode() {
//   if (currentOreNode && currentOreNode.style.display === "block") {
//     return;
//   }

//   var ore = oreNodeList[Math.floor(Math.random() * oreNodeList.length)];

//   ore.style.display = "block";
//   ore.style.marginTop = `${Math.floor(Math.random() * 450)}px`;
//   ore.style.marginLeft = `${Math.floor(Math.random() * 80)}px`;

//   currentOreNode = ore;

//   function getRandomTimeout(min, max) {
//     return Math.floor(Math.random() * (max - min) + min);
//   }

//   const randomTimeout = getRandomTimeout(10000, 30000);
//   console.log(randomTimeout);

//   setTimeout(() => {
//     ore.style.display = "none";
//     ore.style.marginTop = "";
//     ore.style.marginLeft = "";
//     currentOreNode = null;
//   }, randomTimeout);
// }

// setInterval(createRandomOreNode, 3000);


// Keep track of player's coins
let countCoins = localStorage.getItem("countCoins") ? JSON.parse(localStorage.getItem("countCoins")).countCoins : 150;

let counterCoinsDisplay = document.querySelector('#coins-count');
function updateCoinsDisplay() {
  counterCoinsDisplay.innerHTML = countCoins;
  savePlayerProgress();
}
updateCoinsDisplay();


// Mining resources
let miningRate = 1;
let countStone = 0;
let countCopper = 0;
let countTin = 0;
let countBronze = 0;

function updateDisplay(element, count) {
  element.innerHTML = count;
}

function updateInfoMessage(message) {
  document.getElementById("info-message").textContent = message;
}


// Mining ores
const counterStoneDisplay = document.querySelector('#stone-count');
const counterCopperDisplay = document.querySelector('#copper-count');
const counterTinDisplay = document.querySelector('#tin-count');
const countermotherlodeDisplay = document.querySelector('#motherlode-count');

stoneNode.addEventListener("click", () => {
  countStone += 1 * miningRate;
  updateDisplay(counterStoneDisplay, countStone);
  completeObjective("stone10");
  completeObjective("stone30");
  updateInfoMessage("You mine some stone.");
});
// Would this be better to create a separate event listener and then removeEventListener for the objectives?

copperNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    countCopper += 0.5 * miningRate;
    updateDisplay(counterCopperDisplay, countCopper);
    updateInfoMessage("You mine some copper.");
    completeObjective("copperAndTin");
  } else {
    updateInfoMessage("You need a pickaxe.");
  }
});

tinNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    countTin += 0.5 * miningRate;
    updateDisplay(counterTinDisplay, countTin);
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
    id: "stone10",
    message: "Mine 10 stone by clicking on the node in the Mineshaft.",
    condition: (countStone) => countStone >= 10,
    complete: false,
  },
  {
    id: "stone30",
    message: "Mine 30 stone.",
    condition: (countStone) => countStone >= 30,
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
    condition: () => countCopper > 0 && countTin > 0,
    complete: false,
    unlock: () => {
      $("#furnaces").css("display", "block");
    }
  },
  {
    id: "smeltIngot",
    message: "Once you have enough money, purchase your first Furnace and select Bronze in the drop-down menu.",
    condition: () => $("#ingotSelection") = "Bronze",
    unlock: () => {
      // Display ingot counts under Resources
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

  if (obj && obj.condition(countStone, countCopper, countTin)) {
    obj.complete = true;
    updateObjectiveMessage();
    if (obj.unlock) obj.unlock();
  }
}



// Pickaxes
let hasPickaxe = false;
const pickaxes = [
  { id: "pickaxe-bronze", cost: 30, miningRate: 2, type: "bronze" },
  { id: "pickaxe-iron", cost: 150, miningRate: 4, type: "iron" },
  { id: "pickaxe-steel", cost: 500, miningRate: 8, type: "steel" },
  { id: "pickaxe-black", cost: 1000, miningRate: 10, type: "black" },
  { id: "pickaxe-gold", cost: 3000, miningRate: 15, type: "gold" },
  { id: "pickaxe-mithril", cost: 4000, miningRate: 18, type: "mithril" },
  { id: "pickaxe-adamant", cost: 10000, miningRate: 20, type: "adamant" },
  { id: "pickaxe-rune", cost: 50000, miningRate: 30, type: "rune" },
  { id: "pickaxe-dragon", cost: 250000, miningRate: 50, type: "dragon" }
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

function startMining(ore, oreCounter) {
  if (miningIntervalId) {
    clearInterval(miningIntervalId);
  }

  if (currentAutoMiningRate > 0) {
    const intervalDuration = 3000 / currentAutoMiningRate;
    miningIntervalId = setInterval(() => {
      countStone++;
      updateDisplay(counterStoneDisplay, countStone);
    }, intervalDuration);
  }
}

startMining();



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

    console.log("Selected ore: " + selectedOre)
    console.log("Selected counter: " + selectedCounter);
  }
});



$("#sell-one").on("click", function()
  {
    switch(selectedOre) {
      case "resource-stone":
        if (countStone > 0) {
          countCoins++;
          countStone--;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, countStone);
          updateInfoMessage("You sell some stone.");
        }
        break;
      case "resource-copper":
        if (countCopper > 0) {
          countCoins += 2;
          countCopper--;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, countCopper);
          updateInfoMessage("You sell some copper.");
        }
        break;
      case "resource-tin":
        if (countTin > 0) {
          countCoins += 2;
          countStone--;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, countTin);
          updateInfoMessage("You sell some tin.");
          }
          break;
    }
  }
);

$("#sell-all").on("click", function()
  {
    switch(selectedOre) {
      case "resource-stone":
        if (countStone > 0) {
          countCoins += countStone;
          countStone = 0;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, countStone);
          updateInfoMessage("You sell all your stone.");
          completeObjective("sellAll");
        }
        break;
      case "resource-copper":
        if (countCopper > 0) {
          countCoins += countCopper * 2;
          countCopper = 0;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, countCopper);
          updateInfoMessage("You sell all your copper.");
        }
        break;
      case "resource-tin":
        if (countTin > 0) {
          countCoins += countTin * 2;
          countTin = 0;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, countTin);
          updateInfoMessage("You sell all your tin.");
        }
        break;
    }
  }
);

let customAmount = document.getElementById("sell-custom-amount").value;

$("#sell-custom-amount-btn").on("click", function()
  {
    switch(selectedOre) {
      case "resource-stone":
        if (countStone > 0) {
          countCoins += customAmount;
          countStone =- customAmount;
          updateCoinsDisplay();
          updateDisplay(counterStoneDisplay, countStone);
          updateInfoMessage(`You sell ${customAmount} stone.`);
        }
        break;
      case "resource-copper":
        if (countCopper > 0) {
          countCoins += customAmount * 2;
          countCopper += customAmount;
          updateCoinsDisplay();
          updateDisplay(counterCopperDisplay, countCopper);
          updateInfoMessage(`You sell ${customAmount} copper.`);
        }
        break;
      case "resource-tin":
        if (countTin > 0) {
          countCoins += customAmount * 2;
          countStone += customAmount;
          updateCoinsDisplay();
          updateDisplay(counterTinDisplay, countTin);
          updateInfoMessage(`You sell ${customAmount} tin.`);
          }
          break;
    }
  }
);


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
  { type: "bronze", count: countBronze, counter: counterBronzeDisplay, rawMaterials: {copper: 1, tin: 1} }
]


window.addEventListener("DOMContentLoaded", (event) => {
  furnaceList.forEach(({ id, cost, smeltingRate, ingotCounter }) => {
    document.getElementById(id).addEventListener("click", () => buyFurnace(id, cost, smeltingRate, ingotCounter));
  });
})

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

        if (window[`count${capitalize(material)}`] < requiredAmount) {
          canSmelt = false;
          break;
        }
      }

      if (canSmelt) {
        for (const material in selectedIngotObj.rawMaterials) {
          const requiredAmount = selectedIngotObj.rawMaterials[material];

          const materialVariable = `count${capitalize(material)}`;
          console.log(materialVariable)
          console.log(countTin)

          const materialDisplay = document.getElementById(`counter${material}Display`);
          console.log(materialDisplay)

          window[materialVariable] -= requiredAmount;

          console.log(window[materialVariable])

          updateDisplay(materialDisplay, materialVariable);

          console.log(materialVariable)
        }

        selectedIngotObj.count++;
        updateDisplay(selectedIngotObj.counter, selectedIngotObj.count);
      }
    }, intervalDuration);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("ingot-selection").addEventListener("change", () => startSmelting());
  });


// Temporarily increase scale of coins and its icon when number changes
// function coinBounce()
// {
//   const coinsCount = document.getElementById("coins-count");
//   const coinsImage = document.getElementById("coins-image");
//   const coinsDiv = document.getElementById("coins");

//    // Set the styles for bounce effect
//    coinsCount.style.fontSize = "18px";
//    coinsCount.style.color = "lightgreen";
//    coinsImage.style.scale = 1.2; 

//    // Return to normal size
//    setTimeout(() => {
//    coinsCount.style.fontSize = "";
//    coinsCount.style.color = "";
//    coinsImage.style.scale = "";
//     }, 100);
// }

// Persist resource counts and purchases
function savePlayerProgress() {
  localStorage.setItem("countCoins", JSON.stringify({countCoins}));
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

