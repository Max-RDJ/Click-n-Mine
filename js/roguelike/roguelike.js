import { calculatePlayerStats } from "./stats.js";
import { generateEnemy } from "./enemies.js";
import { playerAttack, enemyAttack, playerDefend, applyDefense } from "./combat.js";
import { resetAll } from "../systems/dev-tools.js";
import { playerState } from "../core/state.js";
import { renderEquipment } from "../ui/render-equipment.js";
import { setState } from "./run-manager.js";


let player;
let enemy;
let energy;
const maxEnergy = 3;
let combatOver = false;

function bindRogueUI() {
  $("#attack-btn").off().on("click", () => {
    if (energy < 1) return;

    const damage = playerAttack(player, enemy);
    energy -= 1;

    log(`You hit for ${damage}`);

    $('#enemy-receives').text(`-${damage}`).fadeIn(0).fadeOut(800);

    checkCombatEnd();

    updateUI();
  });

  $("#defend-btn").off().on("click", () => {
    if (energy < 1) return;

    playerDefend(player);
    energy -= 1;

    log("You brace for impact.");
    updateUI();
  });

  $("#use-item-btn").off().on("click", () => {
    if (energy < 2) return;

    player.hp += 5;
    energy -= 2;

    log("You healed 5 HP.");
    updateUI();
  });

  $("#end-turn-btn").off().on("click", () => {
    endPlayerTurn();
  });
}

function updateUI() {
  $("#energy-display").text(`Energy: ${energy}`);

  const playerPercent = (player.hp / player.maxHp) * 100;
  const enemyPercent = (enemy.hp / enemy.maxHp) * 100;

  $("#player-hp-bar").css("width", `${playerPercent}%`);
  $("#enemy-hp-bar").css("width", `${enemyPercent}%`);

  $("#player-hp-text").text(`${player.hp} / ${player.maxHp}`);
  $("#enemy-hp-text").text(`${enemy.hp} / ${enemy.maxHp}`);
}

function log(message) {
  $("#combat-log").append(`<div>${message}</div>`);
}

export function initRogueLike(enemyType) {  
  const stats = calculatePlayerStats();

  player = {
    maxHp: stats.maxHp,
    hp: stats.maxHp,
    attack: stats.attack,
    defense: stats.defense,
    defending: false,
    equipment: { ...playerState.value.equipment },
    items: { ...playerState.value.items },
  };

  enemy = generateEnemy(enemyType, 1);
  enemy.maxHp = enemy.hp;

  startPlayerTurn();
  bindRogueUI();
}

function startPlayerTurn() {
  energy = maxEnergy;
  player.defending = false;
  updateUI();
}

function endPlayerTurn() {
  if (combatOver) return;
  enemyTurn();
  if (combatOver) return;
  startPlayerTurn();
}

function enemyTurn() {
  checkCombatEnd();

  let damage = enemyAttack(enemy, player);
  damage = applyDefense(player, damage);

  log(`Enemy hits you for ${damage}`);

  $('#player-receives').text(`-${damage}`).fadeIn(0).fadeOut(800);

  if (player.hp <= 0) {
    log("Oh dear, you are dead.");
    $("#death-screen").css("display", "flex");
  }
}

function checkCombatEnd() {
  if (enemy.hp <= 0) {
    combatOver = true;
    log("Enemy defeated!");
    disableCombatButtons();
    setTimeout(() => {
      setState("reward");
    }, 1000);
    return true;
  }

  if (player.hp <= 0) {
    combatOver = true;
    log("Oh dear, you are dead.");
    $("#death-screen").css("display", "flex");
    return true;
  }

  return false;
}

$("#victory-dismiss-btn").on("click", () => {
  $("#victory-screen").addClass("hidden");
  setState("map");
});

function disableCombatButtons() {
  $("#attack-btn").prop("disabled", true);
  $("#defend-btn").prop("disabled", true);
  $("#use-item-btn").prop("disabled", true);
  $("#end-turn-btn").prop("disabled", true);
}

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
