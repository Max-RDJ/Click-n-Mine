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
  playerAnvils,
} from "./state.js";

export function savePlayerProgress() {
  const p = playerState.value
  if (!p) return;

  p.coins = countCoins.value;
  p.resources = resourceCounts.value;
  p.playerMiningRate = playerMiningRate.value;
  p.autoMiningRate = autoMiningRate.value;
  p.playerSmeltingRate = playerSmeltingRate.value;
  p.playerSmithingRate = playerSmithingRate.value;
  p.playerFurnaces = playerFurnaces.value;
  p.playerAnvils = playerAnvils.value;

  localStorage.setItem("playerState", JSON.stringify(p));
}
