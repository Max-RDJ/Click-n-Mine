import { initMap } from "./map.js";

let runState = {
  state: "map",
  floor: 1,
  inRun: false
};

export function startRun() {
  runState = {
    state: "map",
    floor: 1,
    inRun: true
  };

  initMap();
  setState("map");
}

export function setState(newState) {
  runState.state = newState;
  updateUI();
}

export function getRunState() {
  return runState;
}

function updateUI() {
  $("#node-map").hide();
  $("#rogue-ui").addClass("hidden");

  switch (runState.state) {
    case "map":
      $("#node-map").show();
      break;

    case "combat":
      $("#rogue-ui").removeClass("hidden");
      break;

    case "reward":
      alert("Reward screen coming soon");
      break;

    case "gameover":
      alert("You died.");
      break;
  }
}