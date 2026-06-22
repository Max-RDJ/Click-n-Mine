import { playerState } from "../core/state.js";
import { RESOURCES } from "../data/resources.js";
import { inventoryState } from "../core/inventory.js";

const adventurerNames = [
    "Acquilina",
    "Aileas",
    "Alke",
    "Badulf",
    "Beathan",
    "Bríd",
    "Callicrates",
    "Chrysanta",
    "Clayton",
    "Conrad",
    "Cosgrach",
    "Damocles",
    "Earna",
    "Egil",
    "Eirunn",
    "Eithne",
    "Emil",
    "Eòghann",
    "Felberta",
    "Gage",
    "Germund",
    "Groa",
    "Havardr",
    "Haywood",
    "Hella",
    "Ingegerd",
    "Innis",
    "Ivor",
    "Jorlaug",
    "Jorunn",
    "Kamden",
    "Karena",
    "Lana",
    "Levina",
    "Lillen",
    "Linn",
    "Lothar",
    "Nuala",
    "Odilie",
    "Ovid",
    "Reidun",
    "Ròidh",
    "Runar",
    "Scholastica",
    "Sèitheach",
    "Selena",
    "Stephanus",
    "Theophilus",
    "Thilde",
    "Wynnstan"
];

const monsters = [
    {
        "monsterName": "Wild Dog",
        "tier": 1,
        "strength": 1,
        "message": "Wild Dog snarls.",
        "encounterChance": 0.5
    },
    {
        "monsterName": "Reanimated Adventurer",
        "tier": 2,
        "strength": 2,
        "loot": [
            {
                "lootName": "coins",
                "lootCount": [5, 25],
                "dropChance": 1
            },
            {
                "lootName": "copperOre",
                "lootCount": [1, 5],
                "dropChance": 0.3
            },
            {
                "lootName": "tinOre",
                "lootCount": [1, 5],
                "dropChance": 0.3
            },
            {
                "lootName": "coal",
                "lootCount": [1, 5],
                "dropChance": 0.3
            },
            {
                "lootName": "ironOre",
                "lootCount": [1, 5],
                "dropChance": 0.3
            },
            {
                "lootName": "bronzeIngot",
                "lootCount": [1, 3],
                "dropChance": 0.2
            }
        ],
        "message": "Reanimated Adventurer shambles towards the group.",
        "encounterChance": 0.3
    },
    {
        "monsterName": "Zoanthrope",
        "tier": 3,
        "strength": 10,
        "loot": [
            {
                "lootName": "coins",
                "lootCount": [30, 150],
                "dropChance": 1
            },
            {
                "lootName": "ironSword",
                "lootCount": [1],
                "dropChance": 0.5
            },
        ],
        "message": "Zoanthrope is thinking."
    }

]

export const combatInProgress = false;


export function checkCombatStatus() {
    const drawer = document.getElementById('combat-drawer')
    
    if (!drawer.contains("open")) {
        combatInProgress
    }
}

function selectMonster(tier) {
    const possibleMonsters = monsters.filter(m => m.tier === tier);
    const totalEncounterChance = possibleMonsters.reduce((sum, m) => sum + m.encounterChance, 0);
    let randomValue = Math.random() * totalEncounterChance;
    for (const monster of possibleMonsters) {
        if (randomValue < monster.encounterChance) {
            return monster;
        }
    }
}

export function generateCombat() {
    logCombat("A group of adventurers ascends to Surface.");
    $('#combat-start').prop('disabled', true);

    generateEncounter();
}

function generateEncounter() {
    const currentTier = playerState.value.tier;
    const monster = selectMonster(currentTier);

    logCombat(`The group encounters ${monster.monsterName}.`);

    setTimeout(() => {
        logCombat(monster.message);
    }, 1000);

    setTimeout(() => {
        logCombat("The group prepares to fight.");
    }, 2000);

    setTimeout(() => {
        const victory = resolveCombat(monster);

        if (victory) {
            logCombat(`The group defeats the ${monster.monsterName}.`);

            setTimeout(() => {
                generateEncounter();
            }, 2000);

        } else {
            logCombat(`The group succumbs to ${monster.monsterName}.`);
            endCombat();
        }
    }, 3000);
}

function calculateGroupStrength() {
    let strength = 0;
    for (const slot of inventoryState) {
        if (!slot) continue;
        const itemData = RESOURCES[slot.id];

        if (itemData?.strength) {
            strength += itemData.strength * slot.quantity;
        }
    }
    return strength;
}

function resolveCombat(monster) {
    const groupStrength = calculateGroupStrength();
    const monsterStrength = monster.strength;

    console.log(`Group strength: ${groupStrength}`);
    console.log(`Monster strength: ${monsterStrength}`);

    const randomizedGroupStrength =
        groupStrength * (0.8 + Math.random() * 0.4);

    const randomizedMonsterStrength =
        monsterStrength * (0.8 + Math.random() * 0.4);

    console.log(`Randomized group strength: ${randomizedGroupStrength}`);
    console.log(`Randomized monster strength: ${randomizedMonsterStrength}`);

    return randomizedGroupStrength >= randomizedMonsterStrength;
}

function logCombat(combatMessage) {
    const container = document.getElementById("combat-log")
    const p = document.createElement("p");

    p.innerHTML = `${combatMessage}`;
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
}

function endCombat() {
    $('#combat-start').prop('disabled', false);
    logCombat(`Your items are lost to Surface.`);
}