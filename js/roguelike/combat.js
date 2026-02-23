export function calculateDamage(attacker, defender) {
  const raw = attacker.attack - defender.defense;
  return Math.max(1, raw);
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

  el.classList.add("damage-number");

  const randomX = (Math.random() - 0.5) * 40;
  el.style.left = `calc(50% + ${randomX}px)`;

  el.textContent = 
    type === "heal"
      ? `+${amount}`
      : `-${amount}`;

  arena.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 800);
}