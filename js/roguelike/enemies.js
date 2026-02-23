export const ENEMIES = {
  goblin: {
    name: "Goblin",
    baseHp: 8,
    baseAttack: 2,
    baseDefense: 1
  },
  maneba: {
    name: "Maneba",
    baseHp: 12,
    baseAttack: 4,
    baseDefense: 2
  },
  zoanthrope: {
    name: "Zoanthrope",
    baseHp: 18,
    baseAttack: 6,
    baseDefense: 3
  },
};

const ENEMY_POOLS = {
  1: ["goblin"],
  2: ["maneba"],
  3: ["zoanthrope"]
};

export function pickRandomEnemy(poolLevel = 1) {
  const pool = ENEMY_POOLS[poolLevel] || [];
  if (pool.length === 0) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function generateEnemy(type, depth = 1) {
  const template = ENEMIES[type];

  return {
    name: template.name,
    hp: template.baseHp + depth * 2,
    attack: template.baseAttack + depth,
    defense: template.baseDefense + Math.floor(depth / 2)
  };
}
