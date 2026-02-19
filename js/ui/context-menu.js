
import { RESOURCES } from "../data/resources.js";
import { updateResource } from "../core/helpers.js";
import { playerState, countCoins } from "../core/state.js";
import { updateCoinsDisplay } from "./ui-update.js";
import { equipItem } from "../core/equipment.js";

let currentResource = null;

export function bindContextMenu() {
    document.addEventListener("contextmenu", (e) => {
    const resourceEl = e.target.closest(".resources");
    if (!resourceEl) return;

    e.preventDefault();

    const id = resourceEl.id.replace("resource__", "");
    currentResource = id;

    openMenu(e.pageX, e.pageY, id);
    });

    document.addEventListener("click", () => {
    closeMenu();
    });

    document.getElementById("context-sell").onclick = sellCurrent;
    document.getElementById("context-sell-all").onclick = sellAllCurrent;

    document.getElementById("context-equip").onclick = equipCurrent;
}

function openMenu(x, y, resourceKey) {
    const menu = document.getElementById("context-menu");
    const data = RESOURCES[resourceKey];

    if (!data) return;

    document.getElementById("context-equip").style.display =
    data.type === "equipment" ? "block" : "none";

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.classList.remove("hidden");
}

function closeMenu() {
    document.getElementById("context-menu").classList.add("hidden");
}

function sellCurrent() {
    const data = RESOURCES[currentResource];
    if (!data) return;

    updateResource(currentResource, -1);
    countCoins.value += data.sellPrice;
    updateCoinsDisplay();
    closeMenu();
}

function sellAllCurrent() {
    const data = RESOURCES[currentResource];
    if (!data) return;

    const count = playerState.value.resources[currentResource] ?? 0;
    if (count <= 0) return;

    updateResource(currentResource, -count);
    countCoins.value = (countCoins.value ?? 0) + count * data.sellPrice;
    updateCoinsDisplay();
    closeMenu();
}


function equipCurrent() {
    equipItem(currentResource);
    closeMenu();
}
