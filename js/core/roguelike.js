import { playerState } from "./state.js";
import { renderEquipment } from "../ui/render-equipment.js";

export function initRogueLike() {
  renderEquipment("#rogue-like-game .player-equipment");

  const weapon = playerState.value.equipment.weapon;
  const armor = playerState.value.equipment.chest;

  console.log("You take with you:", weapon, armor);
}
