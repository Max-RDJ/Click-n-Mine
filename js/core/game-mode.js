let currentMode = "incremental";

export function setGameMode(mode) {
  currentMode = mode;
}

export function getGameMode() {
  return currentMode;
}