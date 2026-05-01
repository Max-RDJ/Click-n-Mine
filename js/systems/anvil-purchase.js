import { countCoins, playerAnvils } from "../core/state.js";
import { MINE_CONFIG } from "../core/config.js";
import { updateInfoMessage, updateCoinsDisplay } from "../ui/ui-update.js";
import { capitalize } from "../utils/utils.js";
import { savePlayerProgress } from "../core/save.js";
import { completeObjective } from "./objectives.js";
import { resourceCounts } from "../core/state.js";
import { processAnvilSmith, productList } from "./smithing.js";

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
    product: null,
    isRunning: false,
    intervalId: null
};
}

export function renderAnvil(anvil) {
  const anvilEl = document.createElement("div");
  anvilEl.classList.add("purchased-anvil");
  anvilEl.dataset.id = anvil.id;

  anvilEl.innerHTML = `
    <img src="images/Anvil.png" class="anvil-img">

    <button class="change-product-btn">
        <img class="selected-img" src="images/stop.png"/>
    </button>

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
            data-anvil-type="bronzeSword"
        >
            <img src="images/bronze_sword.png"/>
        </div>
    </div>
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
  const menu = el.querySelector(".product-menu");
  const btn = el.querySelector(".change-product-btn");
  const img = btn.querySelector(".selected-img");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll(".anvil-option").forEach(option => {
    option.addEventListener("click", () => {
        const type = option.dataset.anvilType;
        const optionImg = option.querySelector("img").src;

        if (anvil.intervalId) {
        clearInterval(anvil.intervalId);
        anvil.intervalId = null;
        }

        anvil.product = type === "none" ? null : type;
        anvil.isRunning = type !== "none";
        img.src = optionImg;

        if (anvil.isRunning) {
        const product = productList.find(p => p.type === anvil.product);

        anvil.intervalId = setInterval(() => {
            processAnvilSmith(anvil);
        }, product.timeToSmith);
        }

        menu.classList.add("hidden");
        savePlayerProgress();
    });
    });
}
