import { playerState } from "./state.js";

export function initRogueLike() {
  const weapon = playerState.value.equipment.weapon;
  const armor = playerState.value.equipment.chest;
  console.log("You take with you:", weapon, armor);
}
