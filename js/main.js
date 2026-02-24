import { initIncrementalGame } from "./core/incremental.js";
import { startRun } from "./roguelike/run-manager.js";
import { loadPlayerState } from "./core/save.js";
import { applyLoadedState, initializeEquipmentUI } from "./core/state.js";
import { restorePurchasedPickaxesUI } from "./systems/pickaxes.js";
import {  bindEquipmentDrawer, bindObjectivesDrawer, bindUI } from "./ui/ui-bindings.js";
import { updateDisplay } from "./ui/ui-update.js";
import { initAudio } from "./core/audio.js";
import { bindCombatDrawers } from "./roguelike/combat.js";


$(document).ready(() => {
  const state = loadPlayerState();
  applyLoadedState(state);
  bindUI();
  updateDisplay();
  restorePurchasedPickaxesUI();
  initializeEquipmentUI();
  initIncrementalGame();
  initAudio();
  bindEquipmentDrawer();
  bindObjectivesDrawer();

  lucide.createIcons({ attrs: { width: 12, height: 12 } });

  let rogueInitialized = false;

  $("#ascend-confirm-btn").on("click", () => {
    $("#incremental-game").addClass("hidden");
    $("#rogue-like-game").removeClass("hidden");
    bindCombatDrawers();

    startRun();
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

