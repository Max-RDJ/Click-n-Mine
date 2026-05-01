import { countCoins, playerAnvils } from "../core/state.js";
import { MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";
import { savePlayerProgress } from "../core/save.js";
import { completeObjective } from "./objectives.js";
import { resourceCounts } from "../core/state.js";
import { processAnvilSmith } from "./smithing.js";

var newMine = {
    ore: null,
    productionRate: 1
};

export function buyAnvil(anvilType) {
    const cost = getAnvilCost();

    if (countCoins.value < cost) {
        updateInfoMessage("You don't have enough coins.");
        return;
    }

    countCoins.value -= cost;

    const anvil = selectAnvil(anvilType);
    playerAnvils.value.push(anvil);
    renderAnvil(anvil);

    completeObjective(
        "buyAnvil",
        resourceCounts.value,
        countCoins.value,
        playerAnvils
    );
    updateCoinsDisplay();
    savePlayerProgress();
}

export function selectAnvil() {
  return {
    id: `anvil-${Date.now()}-${Math.random()}`,
    type,
    ingot: null,
    isRunning: false
  };
}

export function renderAnvil(anvil) {
  const anvilEl = document.createElement("div");
  anvilEl.classList.add("purchased-anvil");
  anvilEl.dataset.id = anvil.id;

  anvilEl.innerHTML = `
    <img src="images/Anvil.png" class="anvil-img">

    <button class="change-product-btn">⚙️</button>

    <div class="processor-selection product-menu hidden">
        <div
                class="anvil-option"
                data-anvil-type="none"
            >
                <img src="images/stop.png"/>
            </div>    
        <div
            class="anvil-option"
            data-anvil-type="bronzeHelm"
        >
            <img src="images/bronze_helm.png"/>
            </div>
        <div
            class="anvil-option"
            data-anvil-type="bronze_sword"
        >
            <img src="images/bronze_sword.png"/>
        </div>
    </div>

    <div class="selected-ingot">None</div>
  `;

  document.querySelector(".anvils").prepend(anvilEl);

  bindAnvilUI(anvil, anvilEl);
}
export function getAnvilCost() {
  const cost = Math.floor(
    MINE_CONFIG.baseCost *
    Math.pow(MINE_CONFIG.costMultiplier, playerAnvils.value.length)
  );
  console.log("Calculating anvil cost:", cost);
  return cost;
}

function bindAnvilUI(anvil, el) {
  const menu = el.querySelector(".ingot-menu");
  const btn = el.querySelector(".change-ingot-btn");
  const display = el.querySelector(".selected-ingot");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll(".anvil-option").forEach(option => {
    option.addEventListener("click", () => {
        const type = option.dataset.anvilType;

        if (anvil.intervalId) {
            clearInterval(anvil.intervalId);
            anvil.intervalId = null;
        }

        anvil.selectedIngot = type === "none" ? null : type;
        anvil.isRunning = type !== "none";

        display.textContent = type === "none"
        ? "None"
        : type;

        if (anvil.isRunning) {
            anvil.intervalId = setInterval(() => {
                processAnvilSmith(anvil);
            }, 2000); // Adjust speed here
        }

        menu.classList.add("hidden");
        savePlayerProgress();
        });
    });
}
