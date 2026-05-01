import { countCoins, playerFurnaces } from "../core/state.js";
import { MINE_TYPES, MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";
import { savePlayerProgress } from "../core/save.js";
import { completeObjective } from "./objectives.js";
import { resourceCounts } from "../core/state.js";
import { processFurnaceSmelt } from "./smelting.js";

var newMine = {
    ore: null,
    productionRate: 1
};

export function buyFurnace() {
    const cost = getFurnaceCost();

    if (countCoins.value < cost) {
        updateInfoMessage("You don't have enough coins.");
        return;
    }

    countCoins.value -= cost;

    const furnace = {
        id: `furnace-${Date.now()}-${Math.random()}`,
        ingot: null,
        progress: 0,
        isRunning: false,
        intervalId: null
    };

    playerFurnaces.value.push(furnace);
    renderFurnace(furnace);

    completeObjective(
        "buyFurnace",
        resourceCounts.value,
        countCoins.value,
        playerFurnaces.value.length
    );

    updateCoinsDisplay();
    savePlayerProgress();
}

export function selectFurnace() {
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

    <button class="change-ingot-btn">
        <img class="selected-img" src="images/stop.png"/>
    </button>

    <div class="processor-selection ingot-menu hidden">
        <div
                class="furnace-option"
                data-furnace-type="none"
            >
                <img src="images/stop.png"/>
            </div>    
        <div
            class="furnace-option"
            data-furnace-type="bronzeIngot"
        >
            <img src="images/bronze_bar.png"/>
            </div>
        <div
            class="furnace-option"
            data-furnace-type="ironIngot"
        >
            <img src="images/iron_bar.png"/>
        </div>
    </div>
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
    const img = btn.querySelector(".selected-img");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll(".furnace-option").forEach(option => {
    option.addEventListener("click", () => {
        const type = option.dataset.furnaceType;
        const optionImg = option.querySelector("img").src;

        if (furnace.intervalId) {
            clearInterval(furnace.intervalId);
            furnace.intervalId = null;
        }

        furnace.selectedIngot = type === "none" ? null : type;
        furnace.isRunning = type !== "none";

        img.src = optionImg;

        if (furnace.isRunning) {
            furnace.intervalId = setInterval(() => {
                processFurnaceSmelt(furnace);
            }, 2000); // Adjust speed here
        }

        menu.classList.add("hidden");
        savePlayerProgress();
        });
    });
}
