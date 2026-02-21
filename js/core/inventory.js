export function generateInventorySlots() {
  const container = document.querySelector(".player-items");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const slot = document.createElement("div");
    slot.classList.add("item-slot");
    container.appendChild(slot);
  }
}
