import { countCoins, playerState, resourceCounts, playerMiningRate } from "../core/state.js";
import { updateCoinsDisplay, updateInfoMessage } from "../ui/ui-update.js";
import { completeObjective } from "./objectives.js";

export const pickaxes = [
  { itemName: "Bronze pickaxe", id: "pickaxe-bronze", cost: 10, miningRate: 2, level: 1, type: "bronze" },
  { itemName: "Iron pickaxe", id: "pickaxe-iron", cost: 150, miningRate: 4, level: 2, type: "iron" },
  { itemName: "Steel pickaxe", id: "pickaxe-steel", cost: 500, miningRate: 8, level: 3, type: "steel" },
  { itemName: "Black pickaxe", id: "pickaxe-black", cost: 1000, miningRate: 10, level: 4, type: "black" },
  { itemName: "Gold pickaxe", id: "pickaxe-gold", cost: 3000, miningRate: 15, level: 5, type: "gold" },
  { itemName: "Mithril pickaxe", id: "pickaxe-mithril", cost: 4000, miningRate: 18, level: 6, type: "mithril" },
  { itemName: "Adamant pickaxe", id: "pickaxe-adamant", cost: 10000, miningRate: 20, level: 7, type: "adamant" },
  { itemName: "Runite pickaxe", id: "pickaxe-runite", cost: 50000, miningRate: 30, level: 8, type: "rune" },
  { itemName: "Dragon pickaxe", id: "pickaxe-dragon", cost: 250000, miningRate: 50, level: 9, type: "dragon" }
];

export const pickaxeLevel = pickaxes.reduce((acc, p) => {
  acc[p.id] = p.level;
  return acc;
}, {});

export function getHighestPickaxeLevel() {
  return Object.keys(playerState.value.purchasedPickaxes)
    .map(id => pickaxeLevel[id] || 0)
    .reduce((max, val) => Math.max(max, val), 0);
}

export function buyPickaxe(id, cost, miningRate, type) {
  const element = document.getElementById(id);
  if (!element) return;

  if (element.style.opacity !== "1" && countCoins.value >= cost) {
    element.style.opacity = "1";

    playerState.value.purchasedPickaxes[id] = true;

    if (playerMiningRate.value < miningRate) {
      playerMiningRate.value = miningRate;
    }

    countCoins.value -= cost;
    updateCoinsDisplay();
    updateInfoMessage(`You buy a ${type} pickaxe.`);

    completeObjective("buyPickaxe", resourceCounts.value, countCoins.value, true);
  } else if (element.style.opacity === "1") {
    updateInfoMessage("You've already bought that.");
  } else {
    updateInfoMessage("You don't have enough coins.");
  }
}

export function bindPickaxeButtons() {
  pickaxes.forEach(p => {
    const element = document.getElementById(p.id);
    if (!element) return;

    element.addEventListener("click", () => {
      buyPickaxe(p.id, p.cost, p.miningRate, p.type);
      updateCoinsDisplay();
    });
  });
}

let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

const popup = document.getElementById("stats-popup");

function updatePopupPosition() {
  const popupRect = popup.getBoundingClientRect();
  const popupWidth = popupRect.width;

  const offsetX = 10;
  const offsetY = -80;

  let x = mouseX + offsetX;
  let y = mouseY + offsetY;

  if (x + popupWidth > window.innerWidth) {
    x = mouseX - popupWidth - offsetX;
  }

  if (y < 0) {
    y = mouseY + 20;
  }

  popup.style.transform = `translate(${x}px, ${y}px)`;

  if (isMouseMoving) {
    requestAnimationFrame(updatePopupPosition);
  }
}

document.addEventListener("mousemove", (event) => {
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
    Mult: <span class="orange-highlight">x${data.miningRate}</span>
  `;

  if (!isMouseMoving) {
    isMouseMoving = true;
    requestAnimationFrame(updatePopupPosition);
  }
});

document.addEventListener("mouseout", () => {
  isMouseMoving = false;
  popup.style.display = "none";
});

export function restorePurchasedPickaxesUI() {
  const purchased = playerState.value.purchasedPickaxes;

  pickaxes.forEach(p => {
    if (purchased[p.id]) {
      const el = document.getElementById(p.id);
      if (el) el.style.opacity = "1";
    }
  });
}
