import { setState } from "./run-manager.js";
import { renderMap } from "./map.js";

export function initMining(tier) {
  $("#map-ui").hide();
  $("#combat-ui").hide();
  $("#mining-ui").show();

  generateMiningNode(tier);
}

function generateMiningNode(tier) {
  const container = $("#mining-nodes");
  container.empty();

  const nodeCount = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < nodeCount; i++) {
    const ore = pickOreByTier(tier);

    const btn = $("<button>")
      .addClass("mine-node")
      .text(`Mine ${ore}`)
      .on("click", () => mineOre(ore));

    container.append(btn);
  }
}

function pickOreByTier(tier) {
  if (tier <= 1) return "Copper";
  if (tier <= 2) return "Tin";
  if (tier <= 3) return "Iron";
  return "Mithril";
}

function mineOre(ore) {
  console.log("Mined:", ore);
}

export function exitMining() {
  $("#mines-ui").hide();
  $("#map-ui").show();
  setState("map");
  renderMap();
}