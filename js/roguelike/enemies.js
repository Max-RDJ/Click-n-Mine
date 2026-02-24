export const ENEMIES = {
  goblin: {
    name: "Goblin",
    baseHp: 8,
    baseAttack: 2,
    baseDefense: 1,
    sprite: "images/300px-Goblin.png"
  },
  maneba: {
    name: "Maneba",
    baseHp: 12,
    baseAttack: 4,
    baseDefense: 2,
    sprite: "images/Maneba.png"
  },
  zoanthrope: {
    name: "Zoanthrope",
    baseHp: 18,
    baseAttack: 6,
    baseDefense: 3,
    sprite: "images/Zoanthrope_Leviathan.png"
  },
  boss: {
    name: "Swarmlord",
    baseHp: 18,
    baseAttack: 6,
    baseDefense: 3,
    sprite: "images/Swarmlord.png"
  },
};

const ENEMY_POOLS = {
  1: ["goblin"],
  2: ["maneba"],
  3: ["zoanthrope"],
  4: ["boss"]
};

export function pickRandomEnemy(poolLevel = 1) {
  const pool = ENEMY_POOLS[poolLevel] || [];
  if (pool.length === 0) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function generateEnemy(type, depth = 1) {
  const template = ENEMIES[type];

  if (!template) {
    console.error("Invalid enemy type:", type);
    return null;
  }

  return {
    name: template.name,
    sprite: template.sprite,
    hp: template.baseHp + depth * 2,
    attack: template.baseAttack + depth,
    defense: template.baseDefense + Math.floor(depth / 2),
    accuracy: 0.75 + depth * 0.02,
    attackSpeed: 1600 - depth * 50
  };
}
