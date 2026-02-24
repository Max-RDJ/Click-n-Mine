import { calculatePlayerStats } from "./stats.js";
import { generateEnemy } from "./enemies.js";
import { resetAll } from "../systems/dev-tools.js";
import { playerState } from "../core/state.js";
import { renderEquipment } from "../ui/render-equipment.js";
import { setState } from "./run-manager.js";
import { renderMap } from "./map.js";
import { performAttack } from "./combat.js";


let player;
let enemy;
let playerInterval;
let enemyInterval;
let combatOver = false;

function updateUI() {
  const playerPercent = (player.hp / player.maxHp) * 100;
  const enemyPercent = (enemy.hp / enemy.maxHp) * 100;

  $("#player-hp-bar").css("width", `${playerPercent}%`);
  $("#enemy-hp-bar").css("width", `${enemyPercent}%`);

  $("#player-hp-text").text(`${player.hp} / ${player.maxHp}`);
  $("#enemy-hp-text").text(`${enemy.hp} / ${enemy.maxHp}`);
}

export function startCombat() {
  if (combatOver) return;

  playerInterval = setInterval(() => {
    if (combatOver) return;

    performAttack(player, enemy, "enemy-receives");
    checkCombatEnd();
    updateUI();
  }, player.attackSpeed);

  enemyInterval = setInterval(() => {
    if (combatOver) return;

    performAttack(enemy, player, "player-receives");
    checkCombatEnd();
    updateUI();
  }, enemy.attackSpeed);
}

function stopCombat() {
  clearInterval(playerInterval);
  clearInterval(enemyInterval);
}

function checkCombatEnd() {
  if (enemy.hp <= 0) {
    combatOver = true;
    stopCombat();
    setTimeout(() => {
      setState("reward");
    }, 1000);
    return true;
  }

  if (player.hp <= 0) {
    combatOver = true;
    stopCombat();
    $("#death-screen").css("display", "flex");
    return true;
  }

  return false;
}

export function initRogueLike(enemyType) {  
  const stats = calculatePlayerStats();

  player = {
    maxHp: stats.maxHp,
    hp: stats.maxHp,
    attack: stats.attack,
    defense: stats.defense,
    accuracy: 0.85,
    attackSpeed: 1200,
    equipment: { ...playerState.value.equipment },
    items: { ...playerState.value.items },
  };

  enemy = generateEnemy(enemyType, 1);
  enemy.maxHp = enemy.hp;
  $("#enemy-sprite").attr("src", enemy.sprite);

  combatOver = false;
  updateUI();
}

$("#start-fight-btn").on("click", () => {
  $(this).hide();
  startCombat();
})

$("#victory-dismiss-btn").on("click", () => {
  $("#victory-screen").addClass("hidden");
  setState("map");
  renderMap();
});

$('#view-equipment').on("click", () => {
  const panel = $('#player-equipment-roguelike');
  
  if (panel.css("display") === "block") {
    panel.css("display", "none");
    return;
  }
  
  renderEquipment("#player-equipment-roguelike");

  panel.css("display", "block");
});

$('#view-inventory').on("click", () => {
  const panel = $('#player-inventory-roguelike');
  
  if (panel.css("display") === "block") {
    panel.css("display", "none");
    return;
  }
  
  renderEquipment("#player-inventory-roguelike");

  panel.css("display", "block");
});

$("#restart-btn").on("click", resetAll);
