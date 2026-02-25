let currentMode = "incremental";

export function setGameMode(mode) {
  currentMode = mode;
  
  const tabs = document.querySelectorAll(".drawer-tab");
  tabs.forEach(tab => {
    const modes = tab.dataset.modes.split(",");
    tab.style.display = modes.includes(mode) ? "" : "none";
  });
}

export function getGameMode() {
  return currentMode;
}