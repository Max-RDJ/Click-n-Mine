import { resourceCounts, countCoins } from "../core/state.js";
import { updateDisplay, updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";
import { RESOURCES } from "../data/resources.js";

export function idToKey(id) {
  const raw = id.replace("resource__", "");
  return raw.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function sellOne(key) {
  sellAmount(key, 1);
}

export function sellAmount(key, amount) {
  const config = RESOURCES[key];
  if (!config) return;

  const current = resourceCounts.value[key] ?? 0;
  if (current < amount || amount <= 0) return;

  resourceCounts.value[key] -= amount;
  countCoins.value += amount * config.sellPrice;

  updateDisplay();
  updateCoinsDisplay();

  completeObjective("sellOre", resourceCounts.value, countCoins.value);
}