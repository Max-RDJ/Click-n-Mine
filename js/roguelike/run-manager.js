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
  $("#victory-screen").hide();

  switch (runState.state) {
    case "map":
      $("#node-map").show();
      $("#combat-ui").hide();
      break;

    case "combat":
      $("#combat-ui").show();
      break;

    case "reward":
      $("#victory-screen").show();
      break;

    case "gameover":
      $('#death-screen').show();
      break;
  }
}