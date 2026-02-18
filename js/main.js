import { loadPlayerState } from "./core/save.js";
import { applyLoadedState } from "./core/state.js";
import { restorePurchasedPickaxesUI } from "./systems/pickaxes.js";
import { bindUI } from "./ui/ui-bindings.js";
import { updateDisplay } from "./ui/ui-update.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = loadPlayerState()
  applyLoadedState(state)
  bindUI()
  updateDisplay()
  restorePurchasedPickaxesUI()
});

$(document).ready(() => {
  lucide.createIcons({
    attrs: {
      width: 12,
      height: 12
    }
  });
});
