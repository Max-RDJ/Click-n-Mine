import { SPELLS } from "../roguelike/spells.js";

export function renderSpells(mode) {
  const list = document.getElementById("magic-list");
  list.innerHTML = "";

  Object.entries(SPELLS).forEach(([id, spell]) => {
    if (spell.mode !== mode) return;

    const img = document.createElement("img");
    img.src = spell.icon;
    img.classList.add("spell-btn");
    img.dataset.spell = id;

    list.appendChild(img);
  });
}