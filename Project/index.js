// Mineshaft
  const stoneNode = document.getElementById("stone-node");
  const copperNode = document.getElementById("copper-node");
  const tinNode = document.getElementById("tin-node");
  const motherloadNode = document.getElementById("motherload-node");
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
let countMotherload = 100;

function updateDisplay(element, count) {
  element.innerHTML = count;
}

const counterStoneDisplay = document.querySelector('#stone-count');
const counterCopperDisplay = document.querySelector('#copper-count');
const counterTinDisplay = document.querySelector('#tin-count');
const counterMotherloadDisplay = document.querySelector('#motherload-count');

// let selectedOre = 

stoneNode.addEventListener("click", () => {
  countStone += 1 * miningRate;
  updateDisplay(counterStoneDisplay, countStone);
  document.getElementById("info-message").textContent = "You mine some stone.";
});

copperNode.addEventListener("click", () => {
  const pickaxeBronze = document.getElementById("pickaxe-bronze");
  if (pickaxeBronze.style.opacity === "1") {
    countCopper += Math.floor((1 * miningRate) / 2);
    updateDisplay(counterCopperDisplay, countCopper);
    document.getElementById("info-message").textContent = "You mine some copper.";
  } else {
    document.getElementById("info-message").textContent = "You need a pickaxe.";
  }
});

tinNode.addEventListener("click", () => {
  const pickaxeBronze = document.getElementById("pickaxe-bronze");
  if (pickaxeBronze.style.opacity === "1") {
    countTin += Math.floor((1 * miningRate) / 2);
    updateDisplay(counterTinDisplay, countTin);
    document.getElementById("info-message").textContent = "You mine some tin.";
  } else {
    document.getElementById("info-message").textContent = "You need a pickaxe.";
  }
});

motherloadNode.addEventListener("click", () => {
  if (countMotherload > 0) {
    countMotherload -= 1 * miningRate;
    updateDisplay(counterMotherloadDisplay, countMotherload);
    document.getElementById("info-message").textContent = "You chip away at the motherload.";
  }
});

// Pickaxe purchases
function buyPickaxe(element, cost, newMiningRate, pickaxeType) {
  if (element.style.opacity !== "1" && countCoins >= cost) {
    element.style.opacity = "1";
    countCoins -= cost;
    miningRate = newMiningRate;
    updateCoinsDisplay();
    document.getElementById("info-message").textContent = `You buy a ${pickaxeType} pickaxe.`;
  } else if (element.style.opacity === "1") {
    document.getElementById("info-message").textContent = "You've already bought that.";
  } else {
    document.getElementById("info-message").textContent = "You don't have enough coins.";
  }
}

document.getElementById("pickaxe-bronze").addEventListener("click", () => buyPickaxe(document.getElementById("pickaxe-bronze"), 100, 2, "bronze"));
document.getElementById("pickaxe-iron").addEventListener("click", () => buyPickaxe(document.getElementById("pickaxe-iron"), 500, 8, "iron"));

// Auto-miner purchase
document.getElementById("auto-miner1").addEventListener("click", () => {
  const autoMiner = document.getElementById("auto-miner1");
  if (autoMiner.style.opacity !== "1" && countCoins >= 100) {
    autoMiner.style.opacity = "1";
    countCoins -= 100;
    updateCoinsDisplay();
    setInterval(() => {
      countStone++;
      updateDisplay(counterStoneDisplay, countStone);
    }, 1500);
  } else if (countCoins < 100) {
    document.getElementById("info-message").textContent = "You don't have enough coins.";
  } else {
    document.getElementById("info-message").textContent = "You've already bought that.";
  }
});

// Sell resources
$(".sellable").click(function() {
  $(".sell-btn").css("display", "block");
});

let currentCounter;
let currentOre;

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

    // Trying to select the word 'copper' or 'tin' and append it to a selector
    console.log($(this).children("span")[0].innerHTML);
    console.log(this.id);
   
    currentCounter = $(this).children("span")[0].innerHTML;
    oreNameToSplit = this.id;
    
    currentOre = oreNameToSplit.split("-").pop()
    console.log(currentOre);
  }
});

// TODO: take currentOre and use it to find e.g. 'copperCount'

let counterCurrentDisplay;
let countCurrent;
let countCurrentValue;
let increment;

$("#sell-one").on("click", function()
  {
    counterCurrentDisplay = "counter" + currentOre[0].toUpperCase() + currentOre.substring(1) + "Display";
    countCurrent = "count" + currentOre[0].toUpperCase() + currentOre.substring(1);

    console.log("counterCurrentDisplay: " + counterCurrentDisplay);
    console.log("counterCurrentDisplayValue: " + counterCurrentDisplay.valueOf);
    console.log("countCurrent: " + countCurrent);

    // countCurrentValue = window[countCurrent];
    
    sellResource(counterCurrentDisplay, countCurrentValue, 1);
    updateDisplay(counterCurrentDisplay)
    $("#info-message").html(`You sell some ${currentOre}.`);
  }
);

// $("#sell-all").on("click", function()
// {
//     sellAllResource()
//     countCoins += countStone;
//     countStone = 0;
//     updateCoinsDisplay();
//     updateDisplay(counterStoneDisplay, countStone);
//     $("info-message").textContent = `You sell all your ${currentOre}.`;
//   }
// );

function sellResource() {
  // let currentResourceCount = window[countCurrent];


  if (countCurrent = "countStone")
    {
      countCurrentValue = countStone;
      increment = 1;
    };

  if (countCurrentValue > 0)
    {
      countCoins += increment;
      countStone--;
      console.log(countStone)

      // window[counterCurrentDisplay.replace("counter", "count").replace("Display", "")] = countCurrentValue;

      updateCoinsDisplay();
      updateDisplay(counterCurrentDisplay, countCurrentValue);

    document.getElementById("info-message").textContent = `You sell some ${currentOre}.`;
  }
}


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
  countCoins += 100;
  updateCoinsDisplay();
});