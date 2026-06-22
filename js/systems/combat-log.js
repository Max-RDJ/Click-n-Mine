import { playerState } from "../core/state.js";

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
            monsterEncounter = monster;
            return;
        }
    }
}

export function generateCombat() {
    logCombat(`The group of adventurers ascends to surface level`)
    $('#combat-start').prop('disabled', true);

    const currentTier = playerState.value.tier;

    // Pick a random monster
    const monsterEncounter = selectMonster(currentTier);

    setTimeout(() => {
        logCombat(`The group encounters ${monsterEncounter.monsterName}.`)
    }, 1000);

    setTimeout(() => {
        logCombat(monsterEncounter.message);
    }, 1000);
    
    setTimeout(() => {
        logCombat(`The group prepares to fight.`)
    }, 1000);

    setTimeout(() => {
        resolveCombat(monsterEncounter);
        if (groupVictory) {
            logCombat(`The group defeats the ${monsterEncounter.monsterName}.`)
        } else {
            logCombat(`The group is defeated by the ${monsterEncounter.monsterName}.`)
        }
    }, 1000);

}

function resolveCombat(monster) {
    const groupStrength = playerState.value.playerMiners;
    const monsterStrength = monster.strength;

    const groupVictory = true;

    if (groupStrength >= monsterStrength) {
        groupVictory = true; 
    }
    else {
        groupVictory = false;
    }
}

function logCombat(combatMessage) {
    const container = document.getElementById("combat-log")
    const p = document.createElement("p");

    p.innerHTML = `${combatMessage}`;
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
}