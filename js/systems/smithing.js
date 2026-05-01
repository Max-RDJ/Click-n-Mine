import { 
  playerAnvils, 
  resourceCounts, 
  countCoins 
} from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { updateDisplay, updateInfoMessage, updateAnvilUI, updateCoinsDisplay } from "../ui/ui-update.js";
import { savePlayerProgress } from "../core/save.js";
import { ANVIL_CONFIG } from "../core/config.js";

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
    type: "bronzeHelm",
    rawMaterials: { bronzeIngot: 1 },
    price: 8,
    timeToSmith: 4000
  },
  {
    type: "bronzePlatebody",
    rawMaterials: { bronzeIngot: 5 },
    price: 40,
    timeToSmith: 10000
  },
  {
    type: "bronzePlatelegs",
    rawMaterials: { bronzeIngot: 3 },
    price: 24,
    timeToSmith: 8000
  },
  {
    type: "bronzeSword",
    rawMaterials: { bronzeIngot: 1 },
    price: 8,
    timeToSmith: 4000
  },
];

export function processAnvilSmith (anvil) {
  const productData = productList.find(p => p.type === anvil.product);
  if (!productData) return;

  let canSmith = true;

  for (const mat in productData.rawMaterials) {
    if (resourceCounts.value[mat] < productData.rawMaterials[mat]) {
      canSmith = false;
      break;
    }
  }

  if (!canSmith) return;

  for (const mat in productData.rawMaterials) {
    resourceCounts.value[mat] -= productData.rawMaterials[mat];
  }

  resourceCounts.value[productData.type] += 1;

  completeObjective("smithHelmet", resourceCounts.value, countCoins.value);

  updateDisplay();
  savePlayerProgress();
}

export function startSmithing() {
  if (isSmithing) return;

  if (playerAnvils.value.length === 0) return;

  isSmithing = true;

  document.getElementById("smith-play").classList.add("hidden");
  document.getElementById("smith-pause").classList.remove("hidden");

  smithingIntervalId = setInterval(() => {
    playerAnvils.value.forEach(anvil => {
      if (!anvil.product) return;

      const product = productList.find(p => p.type === anvil.product);
      if (!product) return;

      anvil.progress += 1000;

      if (anvil.progress < product.timeToSmith) return;

      let canSmith = true;

      for (const mat in product.rawMaterials) {
        if (resourceCounts.value[mat] < product.rawMaterials[mat]) {
          canSmith = false;
          break;
        }
      }

      if (!canSmith) {
        anvil.progress = 0;
        return;
      }

      for (const mat in product.rawMaterials) {
        resourceCounts.value[mat] -= product.rawMaterials[mat];
      }

      resourceCounts.value[product.type] += 1;
      anvil.progress = 0;
    });

    savePlayerProgress();
    updateDisplay();

  }, 1000);
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
