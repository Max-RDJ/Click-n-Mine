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
let countmotherlode = 100;

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
  updateInfoMessage("You mine some stone.");
});

copperNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    countCopper += 0.5 * miningRate;
    updateDisplay(counterCopperDisplay, countCopper);
    updateInfoMessage("You mine some copper.");
  } else {
    updateInfoMessage("You need a pickaxe.");
  }
});

tinNode.addEventListener("click", () => {
  if (hasPickaxe == true) {
    countTin += 0.5 * miningRate;
    updateDisplay(counterTinDisplay, countTin);
    updateInfoMessage("You mine some tin.");
  } else {
    updateInfoMessage("You need a pickaxe.");
  }
});

motherlodeNode.addEventListener("click", () => {
  if (countmotherlode > 0) {
    countmotherlode -= 1 * miningRate;
    updateDisplay(countermotherlodeDisplay, countmotherlode);
    updateInfoMessage("You chip away at the motherlode.");
  }
});

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
  } else if (element.style.opacity === "1") {
    updateInfoMessage("You've already bought that.");
  } else {
    updateInfoMessage("You don't have enough coins.");
  }
}


// Purchasing auto-miners
const autoMiners = [
  { id: "human-miner-1", cost: 500, autoMiningRate: 1, ore: counterStoneDisplay, oreCounter: countStone },
  { id: "human-miner-2", cost: 500,autoMiningRate: 1, ore: counterStoneDisplay, oreCounter: countStone },
  { id: "human-miner-3", cost: 500,autoMiningRate: 1, ore: counterStoneDisplay, oreCounter: countStone }
] 

window.addEventListener("DOMContentLoaded", (event) => {
  autoMiners.forEach(({ id, cost, autoMiningRate, ore, oreCounter }) => {
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

    // const intervalDuration = 3000 / currentAutoMiningRate;

    // element.autoMiningInterval = setInterval(() => {
    //   countStone++;
    //   updateDisplay(ore, countStone);
    // }, intervalDuration);

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



// Selling ores
let selectedCounter;
let selectedOre;

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
$("#mo-money").click(function() {
  countCoins += 1000;
  updateCoinsDisplay();
});