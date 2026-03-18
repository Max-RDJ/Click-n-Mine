import { initIncrementalGame } from "./core/incremental.js";
import { startRun } from "./roguelike/run-manager.js";
import { loadPlayerState, savePlayerProgress } from "./core/save.js";
import { applyLoadedState, createFreshState, defaultPlayerState, playerState, initializeEquipmentUI } from "./core/state.js";
import { restoreUnlockedPickaxesUI } from "./systems/pickaxes.js";
import {  bindCombatDrawer, bindMagicDrawer, bindUI } from "./ui/ui-bindings.js";
import { initializeResourceImages, updateDisplay } from "./ui/ui-update.js";
import { initAudio } from "./core/audio.js";
import { setGameMode } from "./core/game-mode.js";
import { renderSpells } from "./ui/render-spells.js";
import { showObjectiveNotification, setObjectiveMessage, clearMessage } from "./systems/messages.js";
import { getActiveObjectiveMessage } from "./systems/objectives.js";
import { generateCombat } from "./systems/combat-log.js";
import { initMiningUI } from "./systems/auto-mining.js";


$(document).ready(() => {
  const state = loadPlayerState();
  setGameMode("incremental");

  const loaded = loadPlayerState();
  if (loaded) {
    applyLoadedState(loaded);
  } else {
    createFreshState();
  }

  bindUI();
  updateDisplay();
  initializeResourceImages();
  restoreUnlockedPickaxesUI();
  initializeEquipmentUI();
  initMiningUI();
  initIncrementalGame();
  initAudio();
  bindCombatDrawer();
  bindMagicDrawer();

  const activeMessage = getActiveObjectiveMessage();
  setObjectiveMessage(activeMessage);
  showObjectiveNotification(8000);

  lucide.createIcons({ attrs: { width: 12, height: 12 } });

  $("#combat-start").on("click", () => {
    generateCombat();
  })

  $("#ascend-tab").on("click", () => {
    $("#ascend-confirmation").toggleClass("show");
  })

  $("#ascend-cancel-btn").on("click", () => {
    $("#ascend-confirmation").removeClass("show");
  })

  $("#objectives-tab").on("click", () => {
    const activeMessage = getActiveObjectiveMessage();
    setObjectiveMessage(activeMessage);
    showObjectiveNotification(8000);
  });

  if (!playerState.value.objectivesHintDismissed) {
    $("#objectives-tutorial")
      .removeClass("hidden")
      .addClass("show");
  }

  $("#dismiss-objectives-tutorial").on("click", () => {
    $("#objectives-tutorial").removeClass("show").addClass("hidden");
    playerState.value.objectivesHintDismissed = true;
    savePlayerProgress();
  })

  $("#show-dev-tools").on("click", () => {
    $("#dev-tools").toggleClass("hidden");
  })

  $("#game-message-close").on("click", () => {
    clearMessage();  
  });
});


/* document.addEventListener("click", (e) => {
  const ascendConfirmation = document.getElementById("ascend-confirmation");
  const ascendTab = document.getElementById("ascend-tab");

  const clickedInsideConfirmation = ascendConfirmation.contains(e.target);
  const clickedAscendTab = ascendTab.contains(e.target);

  if (!clickedInsideConfirmation && !clickedAscendTab) {
    $("#ascend-confirmation").removeClass("show");
  }
}); */


// CONSIDER RANDOMLY SPAWNING NODES:
/* const nodes = document.querySelectorAll(".ore-node");

function spawnRandomNodes(count = 3) {
  // Hide all nodes first
  nodes.forEach(n => n.classList.add("hidden"));

  // Pick 'count' random nodes
  const shuffled = [...nodes].sort(() => 0.5 - Math.random());
  shuffled.slice(0, count).forEach(node => {
    const types = ["copperOre", "tinOre", "ironOre"];
    const type = types[Math.floor(Math.random() * types.length)];
    node.dataset.type = type;
    node.querySelector("img").src = `images/${type}.png`;
    node.classList.remove("hidden");
  });
}

// Example: respawn nodes every 5 seconds
setInterval(() => spawnRandomNodes(3), 5000); */

