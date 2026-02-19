export const ENEMIES = {
  goblin: {
    name: "Goblin",
    baseHp: 8,
    baseAttack: 2,
    baseDefense: 1
  },
  orc: {
    name: "Orc",
    baseHp: 15,
    baseAttack: 4,
    baseDefense: 2
  }
};

export function generateEnemy(type, depth = 1) {
  const template = ENEMIES[type];

  return {
    name: template.name,
    hp: template.baseHp + depth * 2,
    attack: template.baseAttack + depth,
    defense: template.baseDefense + Math.floor(depth / 2)
  };
}
