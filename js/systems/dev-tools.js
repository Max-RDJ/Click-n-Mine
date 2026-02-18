import { countCoins } from "../core/state.js";
import { updateCoinsDisplay } from "../ui/ui-update.js";

export function resetMoney() {
  countCoins.value = 0;
  updateCoinsDisplay();
}

export function addMoney () {
  countCoins.value += 1000;
  updateCoinsDisplay();
}

export function resetAll() {
  localStorage.clear();
  window.location.reload();
}