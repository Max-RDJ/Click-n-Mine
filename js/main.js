import { initIncrementalGame } from "./core/incremental.js";
import { loadPlayerState, savePlayerProgress } from "./core/save.js";
import { applyLoadedState, createFreshState, defaultPlayerState, playerState, initializeEquipmentUI } from "./core/state.js";
import { restoreUnlockedPickaxesUI } from "./systems/pickaxes.js";
import {  bindShopDrawer, bindCombatDrawer, bindMagicDrawer, bindUI } from "./ui/ui-bindings.js";
import { initializeResourceImages, updateDisplay, renderMines, updateMinerUI } from "./ui/ui-update.js";
import { initAudio } from "./core/audio.js";
import { setGameMode } from "./core/game-mode.js";
import { renderSpells } from "./ui/render-spells.js";
import { showObjectiveNotification, setObjectiveMessage, clearMessage } from "./systems/messages.js";
import { getActiveObjectiveMessage } from "./systems/objectives.js";
import { generateCombat } from "./systems/combat-log.js";
import { initMiningUI } from "./systems/auto-mining.js";
import { RESOURCES } from "./data/resources.js";
import { buyMine } from "./systems/mine-purchase.js";


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
  renderMines();
  updateMinerUI();
  initIncrementalGame();
  initAudio();
  bindShopDrawer();
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
    setTimeout(() => {
      $("#objectives-tutorial")
      .removeClass("hidden")
      .addClass("show");
    }, 9000);
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

  $('#toggle-aside-resources').on('click', function() {
    const aside = $('#aside-resources');
    aside.toggleClass('collapsed open');
    $('#toggle-aside-resources').toggleClass('open');
  });

  $('#toggle-aside-tools').on('click', function() {
    const aside = $('#aside-tools');
    aside.toggleClass('collapsed open');
    $('#toggle-aside-tools').toggleClass('open');
  });

  $("#mines-new").on("click", function () {
    $(".mines-new-selection").toggleClass("open");
  });

  $(".mine-option").on("click", function (e) {
    e.stopPropagation();
    const mineType = this.dataset.mineType;
    buyMine(mineType);
    $(".mines-new-selection").removeClass("open");
  });

  document.querySelectorAll(".resources").forEach(el => {
    const key = el.dataset.resource;

    if (!key) return;
  
    const resource = RESOURCES[key];

    if (!resource) return;

    const displayName =
      (resource.displayName || resource.name || key)
        .replace(/\b\w/g, c => c.toUpperCase());

    const sellPrice =
      resource.sellPrice || key;

    el.setAttribute("data-name", displayName);
    el.setAttribute("data-price", sellPrice);


    const img = el.querySelector("img");
    if (img && resource.image) {
      img.src = resource.image;
      img.alt = displayName;
    }
  });

  const tooltip = document.getElementById("tooltip");

  document.querySelectorAll(".resources").forEach(el => {
    el.addEventListener("mouseenter", e => {
      const key = el.dataset.resource;
      const resource = RESOURCES[key];

      if (!resource) return;

      const name = (resource.displayName || resource.name || key) .replace(/\b\w/g, c => c.toUpperCase());
      const price = resource.sellPrice;

      tooltip.innerHTML = price
        ? `<strong>${name}</strong><br>Sell: ${price}`
        : `<strong>${name}</strong>`;

      tooltip.classList.add("show");
    });

    el.addEventListener("mousemove", e => {
      const offset = 12;

      tooltip.style.left = `${e.clientX + offset}px`;
      tooltip.style.top = `${e.clientY + offset}px`;
    });

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
});



