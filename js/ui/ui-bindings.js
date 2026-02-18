import { 
  updateFurnaceUI, 
  updateAnvilUI, 
  updateCoinsDisplay 
} from "./ui-update.js";
import { 
  bindSmithingUI, 
  buyAnvil, 
  startSmithing, 
  stopSmithing 
} from "../systems/smithing.js";
import { 
  buyFurnace, 
  startSmelting, 
  stopSmelting 
} from "../systems/smelting.js";
import { startAutoMining, bindMinerButtons } from "../systems/auto-mining.js";
import { bindPickaxeButtons } from "../systems/pickaxes.js";
import { bindNodeClicks } from "../systems/mining.js";
import { bindSellingUI } from "../systems/selling.js";
import { resetMoney, addMoney, resetAll } from "../systems/dev-tools.js";
import { loadObjectivesProgress, getActiveObjectiveMessage } from "../systems/objectives.js";

window.addEventListener("DOMContentLoaded", () => {
  loadObjectivesProgress();
  $("#objective-message-content").html(getActiveObjectiveMessage());
  updateFurnaceUI();
  updateAnvilUI();
  startSmithing();
  startSmelting();
});

export function bindUI() {
  $("#furnace-buy").on("click", buyFurnace);
  $("#anvil-buy").on("click", buyAnvil);

  $("#mining-selection").on("change", startAutoMining);

  $("#smelt-play").on("click", startSmelting);
  $("#smelt-pause").on("click", stopSmelting);
  $("#ingot-selection").on("change", () => {
    stopSmelting();
    startSmelting();
  });

  $("#smith-play").on("click", startSmithing);
  $("#smith-pause").on("click", stopSmithing);
  $("#product-selection").on("change", () => {
    stopSmithing();
    startSmithing();
  });

  $("#objective-message-dismiss").on("click", () => {
    $("#objective-message").hide();
  });

  bindSellingUI();
  bindSmithingUI();
  bindNodeClicks();
  bindPickaxeButtons();
  bindMinerButtons();

  // DEV TOOLS
  $("#reset-money").on("click", resetMoney);
  $("#mo-money").on("click", addMoney);
  $("#reset-all").on("click", resetAll);

  // UI REFRESH
  updateCoinsDisplay();
  updateFurnaceUI();
  updateAnvilUI();

  loadObjectivesProgress();
  $("#objective-message-content").html(getActiveObjectiveMessage());
}
