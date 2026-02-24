export const SPELLS = {
    "restorative_orison": {
        name: "Restorative Orison",
        description: "Heal for 20% of your max HP.",
        icon: "images/restorative_orison.png",
        level: 1,
        materials: { "water_essence": 2 },
        cast: (player) => {
            const healAmount = Math.floor(player.maxHp * 0.2);
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            showDamage("player-receives", healAmount, "heal");
        }
    },
    "enfeebling_chant": {
        name: "Enfeebling Chant",
        description: "Reduce enemy damage by 25% for 2 turns.",
        icon: "images/enfeebling_chant.png",
        level: 1,
        materials: { water_essence: 2, air_essence: 1 },
        cast: (enemy) => {
            enemy.damageMultiplier = 0.75;
            enemy.enfeebleTurns = 2;
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