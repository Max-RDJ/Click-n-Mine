// Mineshaft

// Generate stone nodes
const stoneNodeContainer = document.getElementById("stone-node");


// Create and manage multiple sprites
// const oreNodes = [];
// for (let i = 0; i < 5; i++) {
//   const oreNode = new oreNode(`oreNode-${i}`, container);
//   oreNodes.push(oreNode);
// }

// Select random ore to display
let currentOreNode = null; // Track the currently displayed ore node

function createRandomOreNode() {
  if (currentOreNode && currentOreNode.style.display === "block") {
    // If there is already an ore node displayed, do nothing
    return;
  }
  
  const stoneNode = document.getElementById("stone-node");
  const copperNode = document.getElementById("copper-node");
  const tinNode = document.getElementById("tin-node");

  const oreNodeList = [stoneNode, copperNode, tinNode]; // Create new array to choose from

  var ore = oreNodeList[Math.floor(Math.random() * oreNodeList.length)]; // Select a random ore from said array
  
//   Make selected ore appear at random position
  ore.style.display = "block";
  ore.style.marginTop = `${Math.floor(Math.random() * 210)}px`;
  ore.style.marginLeft = `${Math.floor(Math.random() * 70)}px`;
  
currentOreNode = ore;

// Pop-in animation for new ore nodes appearing
// var id = null;
// function popInAnimation () {
//   var scale = 0;
//   clearInterval(id);
//   id = setInterval(frame, 10);
//   function frame() {
//     if (scale == 1) {
//       clearInterval(id);
//     } else {
//       scale++;
//       elem.style.scale = 0.1;
//     }
//   }
// }

//   Get random number of seconds for timeout between 10 and 30s
function getRandomTimeout(min, max) {
    return Math.floor(Math.random() * (30000 - 10000) + 10000);
  }
const randomTimeout = getRandomTimeout(10000, 30000);
console.log(randomTimeout);
  
//   Hide ore again after random seconds
setTimeout(()=>
   {
     ore.style.display = "none";
     ore.style.marginTop = "";
     ore.style.marginLeft = "";
     currentOreNode = null;
   }, randomTimeout);
}

// Call function to appear ore regularly
setInterval(createRandomOreNode, 3000);


// Keep track of player's coins
let countCoins = localStorage.getItem("countCoins") ? JSON.parse(localStorage.getItem("countCoins")).countCoins : 150;
// Update coins count
let counterCoinsDisplay = document.querySelector('#coins-count');
function updateCoinsDisplay() {
  counterCoinsDisplay.innerHTML = countCoins;
  savePlayerProgress();
}

// Keep track of player's purchased items
let playerItems = localStorage.getItem("playerItems") ? JSON.parse(localStorage.getItem("playerItems")) : [];


function updatePlayerItems(){ 
  localStorage.setItem("playerItems", JSON.stringify({playerItems}));
  console.log("Player Items:", playerItems);
}

updateCoinsDisplay();
updatePlayerItems();



// Give info to player regarding actions taken
let infoMessage = document.getElementById("info-message");

// Mine resources
let miningRate = 1;

// Mine stone
let counterPlusStone = document.querySelector('#stone-node');
let counterStoneDisplay = document.querySelector('#stone-count');
let countStone = 0;

function updateStoneDisplay()
{
  counterStoneDisplay.innerHTML = countStone;
}
updateStoneDisplay();

counterPlusStone.addEventListener("click", () => {
  countStone += 1 * miningRate;
  updateStoneDisplay();
  document.getElementById("info-message").textContent = "You mine some stone.";
});

// Mine copper
let counterPlusCopper = document.querySelector('#copper-node');
let counterCopperDisplay = document.querySelector('#copper-count');
let countCopper = 0;

function updateCopperDisplay()
{
  counterCopperDisplay.innerHTML = countCopper;
}
updateCopperDisplay();

counterPlusCopper.addEventListener("click", () => {
  const pickaxeBronze = document.getElementById("pickaxe-bronze")
  if (pickaxeBronze.style.opacity === "1"){
  countCopper += Math.floor((1 * miningRate) / 2);
  updateCopperDisplay();
  infoMessage.textContent = "You mine some copper.";
}
  else
    {
       infoMessage.textContent = "You need a pickaxe.";
    }
});

// Mine tin
let counterPlusTin = document.querySelector('#tin-node');
let counterTinDisplay = document.querySelector('#tin-count');
let countTin = 0;

function updateTinDisplay(){
  counterTinDisplay.innerHTML = countTin;
}
updateTinDisplay();

counterPlusTin.addEventListener("click", () => {
  const pickaxeBronze = document.getElementById("pickaxe-bronze")
  if (pickaxeBronze.style.opacity === "1"){
  countTin += Math.floor((1 * miningRate) / 2);
  updateTinDisplay();
  infoMessage.textContent = "You mine some tin.";
}
  else
    {
       infoMessage.textContent = "You need a pickaxe.";
    }
});

// Mine motherload
let counterPlusMotherload = document.querySelector('#motherload-node');
let counterMotherloadDisplay = document.querySelector('#motherload-count');
let countMotherload = 100;

function updateMotherloadDisplay()
{
  counterMotherloadDisplay.innerHTML = countMotherload;
}
updateMotherloadDisplay();

counterPlusMotherload.addEventListener("click", () => {
  if (countMotherload > 0){
  countMotherload -= 1 * miningRate;
  updateMotherloadDisplay();
    infoMessage.textContent = "You chip away at the motherload.";
  }
});


// Update opacity to buy pickaxe and make it non-repurchasable
// Buy bronze pickaxe
const pickaxeBronze = document.getElementById("pickaxe-bronze");
pickaxeBronze.addEventListener("click", buyBronzePickaxe);
function buyBronzePickaxe(){
  if (!playerItems.includes("pickaxeBronze") && countCoins >= 100)
    {
    pickaxeBronze.style.opacity = "1";
    countCoins -= 100;
    updateCoinsDisplay();
    miningRate = 2;
    infoMessage.textContent = "You buy a bronze pickaxe.";
    playerItems.push("pickaxeBronze");
    updatePlayerItems();
    savePlayerProgress();
    }
  else if (pickaxeBronze.style.opacity === "1")
  {
     infoMessage.textContent = "You've already bought that.";
  }
  else
  {
    infoMessage.textContent = "You don't have enough coins.";
  }
}

// Buy iron pickaxe
const pickaxeIron = document.getElementById("pickaxe-iron");
pickaxeIron.addEventListener("click", buyIronPickaxe);
function buyIronPickaxe(){
  if (!playerItems.includes(pickaxeIron) && countCoins >= 500)
    {
    pickaxeIron.style.opacity = "1";
    countCoins -= 500;
    updateCoinsDisplay();
    miningRate = 8;
    infoMessage.textContent = "You buy an iron pickaxe.";
    playerItems.push("pickaxeIron");
    updatePlayerItems();
    }
  else if (countCoins < 500)
  {
    infoMessage.textContent = "You don't have enough coins.";
  }
  else{
     infoMessage.textContent = "You've already bought that.";
  }
}

// Function for auto-mining
function autoMine () {
      countStone++;
      updateStoneDisplay();
    }
// Buy first auto-miner
const autoMiner1 = document.getElementById("auto-miner1");
  autoMiner1.addEventListener("click", buyAutoMiner1);
function buyAutoMiner1(){
  if (autoMiner1.style.opacity !== "1" && countCoins >= 100)
    {
    autoMiner1.style.opacity = "1";
    countCoins -= 100;
    updateCoinsDisplay();
    autoMine();
    setInterval(autoMine, 1500);
  }
  else if (countCoins < 100)
  {
    infoMessage.textContent = "You don't have enough coins.";
  }
  else{
     infoMessage.textContent = "You've already bought that.";
  }
}



// Listen for click on resource in order to show corresponding sell btns
document.querySelector("#resource-stone").addEventListener("click", () => {
  makeSellVisible("stone");
})

document.querySelector("#resource-copper").addEventListener("click", () => {
  makeSellVisible("copper");
})

document.querySelector("#resource-tin").addEventListener("click", () => {
  makeSellVisible("tin");
})

// Make corresponding sell btns visible
document.querySelectorAll('.sell-btn').forEach(button => {
  button.addEventListener('click', () => {
    const resource = button.getAttribute('data-resource');
  });
});

function makeSellVisible(resource) {

  //   All sell buttons initially set to hidden
  var allResources = document.getElementsByClassName('sell-btn');
for (var i=0;i<allResources.length;i+=1){
  allResources[i].style.display = 'none';
}

//   Make sell btns visible for ore clicked
  document.querySelector(`#sell-${resource}-one`).style.display = 'block';
  document.querySelector(`#sell-${resource}-all`).style.display = 'block';
}

// Sell one stone
document.getElementById("sell-stone-one").addEventListener("click", () => {
  sellOneStone();
  coinBounce();
});
function sellOneStone (){
  if (countStone > 0){
    countCoins += 1;
    countStone--;
    updateCoinsDisplay();
    updateStoneDisplay();
    infoMessage.textContent = "You sell some stone.";}}

// Sell all stone
document.getElementById("sell-stone-all").addEventListener("click", () => {
  sellAllStone();
  coinBounce();
});
function sellAllStone() {
  countCoins += countStone;
  countStone = 0;
  updateCoinsDisplay();
  updateStoneDisplay();
  infoMessage.textContent = "You sell all your stone.";}

// Sell one copper
document.getElementById("sell-copper-one").addEventListener("click", () => {
  sellOneCopper();
  coinBounce();
});
function sellOneCopper (){
  if (countCopper > 0){
    countCoins += 2;
    countCopper--;
    updateCoinsDisplay();
    updateCopperDisplay();
    infoMessage.textContent = "You sell some copper.";}}

// Sell all copper
document.getElementById("sell-copper-all").addEventListener("click", () => {
  sellAllCopper();
  coinBounce();
});
function sellAllCopper() {
  countCoins += countCopper * 2;
  countCopper = 0;
  updateCoinsDisplay();
  updateCopperDisplay();
  infoMessage.textContent = "You sell all your copper.";}

// Sell one tin
document.getElementById("sell-tin-one").addEventListener("click", () => {
  sellOneTin();
  coinBounce();
});
function sellOneTin (){
  if (countTin > 0){
    countCoins += 2;
    countTin--;
    updateCoinsDisplay();
    updateTinDisplay();
    infoMessage.textContent = "You sell some tin.";}}

// Sell all tin
document.getElementById("sell-tin-all").addEventListener("click", () => {
  sellAllTin();
  coinBounce();
});
function sellAllTin() {
  countCoins += countTin * 2;
  countTin = 0;
  updateCoinsDisplay();
  updateTinDisplay();
  infoMessage.textContent = "You sell all your tin.";}

// Temporarily increase scale of coins and its icon when number changes
function coinBounce()
{
  const coinsCount = document.getElementById("coins-count");
  const coinsImage = document.getElementById("coins-image");
  const coinsDiv = document.getElementById("coins");

   // Set the styles for bounce effect
   coinsCount.style.fontSize = "18px";
   coinsCount.style.color = "lightgreen";
   coinsImage.style.scale = 1.2; 

   // Return to normal size
   setTimeout(() => {
   coinsCount.style.fontSize = "";
   coinsCount.style.color = "";
   coinsImage.style.scale = "";
    }, 100);
}


// Persist resource counts and purchases
function savePlayerProgress() {
  localStorage.setItem("countCoins", JSON.stringify({countCoins}));
  localStorage.setItem("playerItems", JSON.stringify({playerItems}));
}




// Dev tools
let moMoneyBtn = document.getElementById("mo-money");
moMoneyBtn.addEventListener("click", () => {
  increaseMoney();
  updateCoinsDisplay();
});
function increaseMoney() {
  countCoins += 100;
}



/*TODO
- Use JS classes to create ore node sprites -- push and shift to an array
- Display number added next to resource count for a split second (e.g. "+5")
- Make shop sections appear after certain numbers mined
- Auto-miners can be set to desired ore to be mined
- Coin icon and number do not scale up or flash green if nothing to sell
- Update coinBounce function to trigger when money increases or decreases
- Add more hidden ores which will become visible when enough resources to open up caves
- Hover over purchasable items to examine stats
- Add dwarves or auto-miners
- Motherload to give mix of random resources in random amounts upon finishing 
- Power-up to greatly increase mining speed temporarily - smashing!
- Office assistant 'Picky'/'Axy'?
- Light up corresponding resource text when something mined
- Add animations via jQuery + Animate.css library
- Make shop sections reshufflable
- Add an achievements list, e.g. reach 10K coins
*/