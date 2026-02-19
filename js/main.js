import { initIncrementalGame } from "./core/incremental.js";
import { initRogueLike } from "./roguelike/roguelike.js";

import { loadPlayerState } from "./core/save.js";
import { applyLoadedState, initializeEquipmentUI } from "./core/state.js";
import { restorePurchasedPickaxesUI } from "./systems/pickaxes.js";
import { bindUI } from "./ui/ui-bindings.js";
import { updateDisplay } from "./ui/ui-update.js";

$(document).ready(() => {
  const state = loadPlayerState();
  applyLoadedState(state);
  bindUI();
  updateDisplay();
  restorePurchasedPickaxesUI();
  initializeEquipmentUI();
  initIncrementalGame();

  lucide.createIcons({ attrs: { width: 12, height: 12 } });

  let rogueInitialized = false;

  $("#enter-rogue-like").on("click", () => {
    $("#incremental-game").addClass("hidden");
    $("#rogue-like-game").removeClass("hidden");

    if (!rogueInitialized) {
      initRogueLike();
      rogueInitialized = true;
    }
  });


  $("#exit-rogue-like").on("click", () => {
    $("#rogue-like-game").addClass("hidden");
    $("#incremental-game").removeClass("hidden");
  });
});


// CONSIDER RANDOMLY SPAWNING NODES:
/* const nodes = document.querySelectorAll(".ore-node");

function spawnRandomNodes(count = 3) {
  // Hide all nodes first
  nodes.forEach(n => n.classList.add("hidden"));

  // Pick 'count' random nodes
  const shuffled = [...nodes].sort(() => 0.5 - Math.random());
  shuffled.slice(0, count).forEach(node => {
    const types = ["stone", "copperOre", "tinOre", "ironOre"];
    const type = types[Math.floor(Math.random() * types.length)];
    node.dataset.type = type;
    node.querySelector("img").src = `images/${type}.png`;
    node.classList.remove("hidden");
  });
}

// Example: respawn nodes every 5 seconds
setInterval(() => spawnRandomNodes(3), 5000); */

