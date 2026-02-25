import { initIncrementalGame } from "./core/incremental.js";
import { startRun } from "./roguelike/run-manager.js";
import { loadPlayerState } from "./core/save.js";
import { applyLoadedState, initializeEquipmentUI } from "./core/state.js";
import { restoreUnlockedPickaxesUI } from "./systems/pickaxes.js";
import {  bindEquipmentDrawer, bindMagicDrawer, bindObjectivesDrawer, bindUI } from "./ui/ui-bindings.js";
import { updateDisplay } from "./ui/ui-update.js";
import { initAudio } from "./core/audio.js";
import { setGameMode } from "./core/game-mode.js";
import { renderSpells } from "./ui/render-spells.js";


$(document).ready(() => {
  const state = loadPlayerState();
  setGameMode("incremental");
  renderSpells("incremental");
  applyLoadedState(state);
  bindUI();
  updateDisplay();
  restoreUnlockedPickaxesUI();
  initializeEquipmentUI();
  initIncrementalGame();
  initAudio();
  bindMagicDrawer();
  bindEquipmentDrawer();
  bindObjectivesDrawer();

  lucide.createIcons({ attrs: { width: 12, height: 12 } });

  $("#ascend-confirm-btn").on("click", () => {
    $("#incremental-game").addClass("hidden");
    $("#rogue-like-game").removeClass("hidden");

    $("#ascend-confirmation").removeClass("show");

    setGameMode("combat");
    renderSpells("combat");

    startRun();
  });

  $("#ascend-tab").on("click", () => {
    $("#ascend-confirmation").toggleClass("show");
  })

  $("#ascend-cancel-btn").on("click", () => {
    $("#ascend-confirmation").removeClass("show");
  })
});


document.addEventListener("click", (e) => {
  const ascendConfirmation = document.getElementById("ascend-confirmation");
  const ascendTab = document.getElementById("ascend-tab");

  const clickedInsideConfirmation = ascendConfirmation.contains(e.target);
  const clickedAscendTab = ascendTab.contains(e.target);

  if (!clickedInsideConfirmation && !clickedAscendTab) {
    $("#ascend-confirmation").removeClass("show");
  }
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

