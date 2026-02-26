export const SPELLS = {
    "restorative_orison": {
        name: "Restorative Orison",
        description: "Heal for 20% of your max HP.",
        icon: "images/restorative_orison.png",
        mode: "combat",
        level: 1,
        consumables: { "water_essence": 2 },
        cast: (player) => {
            const healAmount = Math.floor(player.maxHp * 0.2);
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            showDamage("player-receives", healAmount, "heal");
        }
    },
    "enfeebling_chant": {
        name: "Enfeebling Chant",
        description: "Reduce enemy damage by 25% for 2 turns.",
        mode: "combat",
        icon: "images/enfeebling_chant.png",
        level: 1,
        consumables: { water_essence: 2, air_essence: 1 },
        cast: (enemy) => {
            enemy.damageMultiplier = 0.75;
            enemy.enfeebleTurns = 2;
        }
    },
    "walk_with_me": {
        name: "Walk with Me",
        description: "A powerful black-fire attack.",
        mode: "combat",
        icon: "images/walk_with_me.png",
        level: 2,
        consumables: { fire_essence: 5 },
        cast: (player) => {
            player.damageMultiplier = 3;
            player.walkWithMeTurns = 1;
        }
    }
}

export const ESSENCE_TYPES = {
    water: {
        name: "Water Essence",
        icon: "images/water_essence.png"
    },
    fire: {
        name: "Fire Essence",
        icon: "images/fire_essence.png"
    },
    earth: {
        name: "Earth Essence",
        icon: "images/earth_essence.png"
    },
    air: {
        name: "Air Essence",
        icon: "images/air_essence.png"
    },
}