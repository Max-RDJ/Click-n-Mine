export function performAttack(attacker, defender, arenaId) {
  const hitChance = attacker.accuracy - defender.defense * 0.02;
  const roll = Math.random();

  if (roll > hitChance) {
    showDamage(arenaId, 0, "miss");
    return 0;
  }

  const min = Math.floor(attacker.attack * 0.5);
  const max = attacker.attack;

  const damage = Math.floor(Math.random() * (max - min + 1)) + min;

  defender.hp -= damage;
  defender.hp = Math.max(0, defender.hp);

  showDamage(arenaId, damage);
  return damage;
}

export function playerAttack(player, enemy) {
  const damage = calculateDamage(player, enemy);
  enemy.hp -= damage;
  enemy.hp = Math.max(0, enemy.hp);
  showDamage("enemy-receives", damage);
  return damage;
}

export function enemyAttack(enemy, player) {
  const damage = calculateDamage(enemy, player);
  player.hp -= damage;
  player.hp = Math.max(0, player.hp);
  return damage;
}

export function playerDefend(player) {
  player.defending = true;
}

export function applyDefense(player, damage) {
  if (player.defending) {
    damage = Math.floor(damage / 2);
    player.defending = false;
  }
  return damage;
}

function showDamage(arenaId, amount, type = "damage") {
  const arena = document.getElementById(arenaId);

  const el = document.createElement("div");
  el.classList.add("damage-number");

  const randomX = (Math.random() - 0.5) * 40;
  el.style.left = `calc(50% + ${randomX}px)`;

  if (type === "heal") {
    el.textContent = `+${amount}`;
  } else if (amount === 0) {
    el.textContent = "MISS";
    el.classList.add("miss");
  } else {
    el.textContent = `-${amount}`;
  }

  arena.appendChild(el);

  setTimeout(() => el.remove(), 800);
}
