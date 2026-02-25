import { countCoins, playerState, resourceCounts, playerMiningRate } from "../core/state.js";


export const pickaxes = [
  { itemName: "Bronze pickaxe", id: "bronzePickaxe", miningRate: 2, level: 1, type: "bronze" },
  { itemName: "Iron pickaxe", id: "ironPickaxe", miningRate: 4, level: 2, type: "iron" },
  { itemName: "Steel pickaxe", id: "steelPickaxe", miningRate: 8, level: 3, type: "steel" },
  { itemName: "Black pickaxe", id: "blackPickaxe", miningRate: 10, level: 4, type: "black" },
  { itemName: "Gold pickaxe", id: "goldPickaxe", miningRate: 15, level: 5, type: "gold" },
  { itemName: "Mithril pickaxe", id: "mithrilPickaxe", miningRate: 18, level: 6, type: "mithril" },
  { itemName: "Adamant pickaxe", id: "adamantPickaxe", miningRate: 20, level: 7, type: "adamant" },
  { itemName: "Runite pickaxe", id:"runitePickaxe", miningRate :30 ,level :8 ,type :"rune"},
  { itemName: "Dragon pickaxe", id: "dragonPickaxe", miningRate: 50, level: 9, type: "dragon" }
];

export const pickaxeLevel = pickaxes.reduce((acc, p) => {
  acc[p.id] = p.level;
  return acc;
}, {});

/* document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  const hovered = document
    .elementFromPoint(mouseX, mouseY)
    ?.closest(".purchasable-item");

  if (!hovered) {
    popup.style.display = "none";
    isMouseMoving = false;
    return;
  }

  const data = pickaxes.find(p => p.id === hovered.id);
  if (!data) return;

  popup.style.display = "block";
  popup.innerHTML = `
    <span class="orange-highlight item-title">${data.itemName}</span><br>
    Price: <span class="orange-highlight">${data.cost}</span><br>
    Yield: <span class="orange-highlight">x${data.miningRate}</span>
  `;

  if (!isMouseMoving) {
    isMouseMoving = true;
    requestAnimationFrame(updatePopupPosition);
  }
}); */

/* document.addEventListener("mouseout", () => {
  isMouseMoving = false;
  popup.style.display = "none";
});
 */

export function restoreUnlockedPickaxesUI() {
  const unlocked = playerState.value.unlockedPickaxes;

  pickaxes.forEach(p => {
    const el = document.getElementById(p.id);
    if (!el) return;

    el.style.opacity = unlocked[p.id] ? "1" : "0.4";
  });
}

export function unlockNextPickaxe(level) {
  const pickaxe = pickaxes.find(p => p.level === level);
  if (!pickaxe) return;

  playerState.value.unlockedPickaxes[pickaxe.id] = true;

  const el = document.getElementById(pickaxe.id);
  if (el) el.style.opacity = "1";

  if ((playerState.value.equipment.utility === null) || (pickaxe.miningRate > (RESOURCES[playerState.value.equipment.utility]?.miningRate ?? 0))) {
    equipItem(pickaxe.id);
  }
}
