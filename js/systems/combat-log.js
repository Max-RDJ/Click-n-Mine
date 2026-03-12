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

export const combatInProgress = false;


export function checkCombatStatus() {
    const drawer = document.getElementById('combat-drawer')
    
    if (!drawer.contains("open")) {
        combatInProgress
    }
}

export function generateCombat() {
    // Pick a random name
    const adventurerName = adventurerNames[Math.floor(Math.random() * adventurerNames.length)];

    logCombat(`${adventurerName} ascends to surface level`)

    // Have adventurer do an action every few seconds that returns resources or results in their death

    // After death or a certain number of actions, have adventurer  return
}

function logCombat(combatMessage) {
    const container = document.getElementById("combat-log")
    const p = document.createElement("p");

    p.innerHTML = `${combatMessage}`;
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
}