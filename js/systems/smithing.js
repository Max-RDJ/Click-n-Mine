import { 
  playerAnvils, 
  playerSmithingRate, 
  resourceCounts, 
  countCoins 
} from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { updateDisplay, updateInfoMessage, updateAnvilUI, updateCoinsDisplay } from "../ui/ui-update.js";

export const ANVIL_CONFIG = {
  baseCost: 20,
  costMultiplier: 1.6,
  playerSmithingRate: 1
};

let smithingIntervalId = null;
let isSmithing = false;

export const productList = [
  {
    type: "ironSword",
    rawMaterials: { ironIngot: 2 },
    price: 15,
    timeToSmith: 5000
  },
  {
    type: "bronzeMedHelm",
    rawMaterials: { bronzeIngot: 1 },
    price: 8,
    timeToSmith: 4000
  }
];

export function getAnvilCost() {
  return Math.floor(
    ANVIL_CONFIG.baseCost * Math.pow(ANVIL_CONFIG.costMultiplier, playerAnvils.value)
  );
}

export function buyAnvil() {
  const cost = getAnvilCost();
  if (countCoins.value < cost) {
    updateInfoMessage("You don't have enough coins.");
    return;
  }
  countCoins.value -= cost;
  playerAnvils.value++;
  recalcSmithingRate();

  updateCoinsDisplay();
  completeObjective("buyAnvil", playerAnvils.value);
  updateAnvilUI();
  updateInfoMessage("You buy an anvil.");
}

export function recalcSmithingRate() {
  playerSmithingRate.value = playerAnvils.value * ANVIL_CONFIG.playerSmithingRate;
}

export function startSmithing() {
  if (isSmithing) return;

  const productType = document.getElementById("product-selection").value;
  const selectedProduct = productList.find(p => p.type === productType);
  if (!selectedProduct || playerAnvils.value <= 0) return;

  isSmithing = true;
  document.getElementById("smith-play").classList.add("hidden");
  document.getElementById("smith-pause").classList.remove("hidden");

  smithingIntervalId = setInterval(() => {
    const smithAmount = Math.max(1, playerSmithingRate.value);

    for (let i = 0; i < smithAmount; i++) {
      let canSmith = true;
      for (const mat in selectedProduct.rawMaterials) {
        if (resourceCounts.value[mat] < selectedProduct.rawMaterials[mat]) {
          canSmith = false;
          break;
        }
      }
      if (!canSmith) {
        stopSmithing();
        return;
      }

      for (const mat in selectedProduct.rawMaterials) {
        resourceCounts.value[mat] -= selectedProduct.rawMaterials[mat];
      }

      resourceCounts.value[selectedProduct.type] = (resourceCounts.value[selectedProduct.type] || 0) + 1;
    }

    completeObjective("smithHelmet", resourceCounts.value, countCoins.value);
    updateDisplay();
  }, selectedProduct.timeToSmith);
}

export function stopSmithing() {
  if (!isSmithing) return;

  clearInterval(smithingIntervalId);
  smithingIntervalId = null;
  isSmithing = false;

  document.getElementById("smith-pause").classList.add("hidden");
  document.getElementById("smith-play").classList.remove("hidden");
}

export function bindSmithingUI() {
  const playBtn = document.getElementById("smith-play");
  const pauseBtn = document.getElementById("smith-pause");
  const productSelect = document.getElementById("product-selection");

  playBtn.addEventListener("click", startSmithing);
  pauseBtn.addEventListener("click", stopSmithing);

  productSelect.addEventListener("change", () => {
    if (isSmithing) {
      stopSmithing();
      startSmithing();
    }
  });
}
