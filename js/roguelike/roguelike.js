import { calculatePlayerStats } from "./stats.js";
import { generateEnemy } from "./enemies.js";
import { playerAttack, enemyAttack, playerDefend, applyDefense } from "./combat.js";


let player;
let enemy;
let energy;
const maxEnergy = 3;

function bindRogueUI() {
  $("#attack-btn").off().on("click", () => {
    if (energy < 1) return;

    const damage = playerAttack(player, enemy);
    energy -= 1;

    log(`You hit for ${damage}`);

    $('#enemy-receives').text(`-${damage}`).fadeIn(0).fadeOut(800);

    if (enemy.hp <= 0) {
      log("Enemy defeated!");
      return;
    }

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
  $("#player-hp").text(`Player HP: ${player.hp}`);
  $("#enemy-hp").text(`Enemy HP: ${enemy.hp}`);
}

function log(message) {
  $("#combat-log").append(`<div>${message}</div>`);
}

export function initRogueLike() {
  const stats = calculatePlayerStats();

  player = {
    hp: stats.maxHp,
    attack: stats.attack,
    defense: stats.defense,
    defending: false
  };

  enemy = generateEnemy("goblin", 1);

  startPlayerTurn();
  bindRogueUI();
}

function startPlayerTurn() {
  energy = maxEnergy;
  player.defending = false;
  updateUI();
}

function endPlayerTurn() {
  enemyTurn();
  startPlayerTurn();
}

function enemyTurn() {
  let damage = enemyAttack(enemy, player);
  damage = applyDefense(player, damage);

  log(`Enemy hits you for ${damage}`);

  $('#player-receives').text(`-${damage}`).fadeIn(0).fadeOut(800);

  if (player.hp <= 0) {
    log("Oh dear, you are dead.");
  }
}

$('#view-equipment').on("click", () => {
    $('#player-equipment-roguelike').css("display", "block");
})