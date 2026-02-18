import { defaultPlayerState } from "./state.js";

export function loadPlayerState() {
  const saved = localStorage.getItem("playerState");
  if (!saved) return structuredClone(defaultPlayerState);

  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaultPlayerState,
      ...parsed,
      resources: {
        ...defaultPlayerState.resources,
        ...parsed.resources
      }
    };
  } catch {
    return structuredClone(defaultPlayerState);
  }
}

import { 
  playerState, 
  countCoins, 
  resourceCounts, 
  playerMiningRate, 
  autoMiningRate, 
  playerSmeltingRate, 
  playerSmithingRate, 
  playerFurnaces, 
  playerAnvils 
} from "./state.js";

export function savePlayerProgress() {
  if (!playerState.value) return;

  playerState.value.coins = countCoins.value;
  playerState.value.resources = resourceCounts.value;
  playerState.value.playerMiningRate = playerMiningRate.value;
  playerState.value.autoMiningRate = autoMiningRate.value;
  playerState.value.playerSmeltingRate = playerSmeltingRate.value;
  playerState.value.playerSmithingRate = playerSmithingRate.value;
  playerState.value.playerFurnaces = playerFurnaces.value;
  playerState.value.playerAnvils = playerAnvils.value;

  localStorage.setItem("playerState", JSON.stringify(playerState.value));
}
