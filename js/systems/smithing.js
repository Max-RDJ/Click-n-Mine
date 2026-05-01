import { resourceCounts, countCoins } from "../core/state.js";
import { completeObjective } from "./objectives.js";
import { updateDisplay } from "../ui/ui-update.js";
import { savePlayerProgress } from "../core/save.js";

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

export function processAnvilSmith(anvil) {
  if (!anvil.product) return;

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