import { countCoins, playerFurnaces } from "../core/state.js";
import { MINE_TYPES, MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";
import { savePlayerProgress } from "../core/save.js";
import { completeObjective } from "./objectives.js";
import { resourceCounts } from "../core/state.js";

var newMine = {
    ore: null,
    productionRate: 1
};

export function buyFurnace(furnaceType) {
    console.log("Attempting to buy furnace of type:", furnaceType);
    const cost = getFurnaceCost();

    if (countCoins.value < cost) {
        updateInfoMessage("You don't have enough coins.");
        return;
    }

    countCoins.value -= cost;

    const furnace = selectFurnace(furnaceType);
    playerFurnaces.value.push(furnace);
    renderFurnace(furnace);

    completeObjective(
        "buyFurnace",
        resourceCounts.value,
        countCoins.value,
        playerFurnaces
    );
    updateCoinsDisplay();
    savePlayerProgress();
}

export function selectFurnace(type) {
  return {
    id: `furnace-${Date.now()}-${Math.random()}`,
    type,
    ingot: null,
    isRunning: false
  };
}

export function renderFurnace(furnace) {
  const furnaceEl = document.createElement("div");
  furnaceEl.classList.add("purchased-furnace");
  furnaceEl.dataset.id = furnace.id;

  furnaceEl.innerHTML = `
    <img src="images/Furnace.png" class="furnace-img">

    <button class="change-ingot-btn">⚙️</button>

    <div class="ingot-menu hidden">
      <button data-ingot="bronzeIngot">Bronze</button>
      <button data-ingot="ironIngot">Iron</button>
    </div>

    <div class="selected-ingot">None</div>
  `;

  document.querySelector(".furnaces").prepend(furnaceEl);

  bindFurnaceUI(furnace, furnaceEl);
}
export function getFurnaceCost() {
  const cost = Math.floor(
    MINE_CONFIG.baseCost *
    Math.pow(MINE_CONFIG.costMultiplier, playerFurnaces.value.length)
  );
  console.log("Calculating furnace cost:", cost);
  return cost;
}

function bindFurnaceUI(furnace, el) {
  const menu = el.querySelector(".ingot-menu");
  const btn = el.querySelector(".change-ingot-btn");
  const display = el.querySelector(".selected-ingot");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("button").forEach(option => {
    option.addEventListener("click", () => {
      furnace.selectedIngot = option.dataset.ingot;
      display.textContent = option.textContent;
      menu.classList.add("hidden");

      savePlayerProgress();
    });
  });
}
