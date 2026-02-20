export function calculateDamage(attacker, defender) {
  const raw = attacker.attack - defender.defense;
  return Math.max(1, raw);
}

export function playerAttack(player, enemy) {
  const damage = calculateDamage(player, enemy);
  enemy.hp -= damage;
  showDamage("enemy-receives", damage);
  return damage;
}

export function enemyAttack(enemy, player) {
  const damage = calculateDamage(enemy, player);
  player.hp -= damage;
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

function showDamage(targetId, amount) {
  const el = document.getElementById(targetId);

  el.textContent = `-${amount}`;
  
  el.classList.remove("damage-pop");
  void el.offsetWidth;
  el.classList.add("damage-pop");
}