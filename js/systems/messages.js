let currentObjectiveMessage = "";
let revertTimeout = null;

export function setObjectiveMessage(text) {
  currentObjectiveMessage = text;
}

export function showTemporaryMessage(text, duration = 2000) {
  showMessage(text, "alert");

  clearTimeout(revertTimeout);

  revertTimeout = setTimeout(() => {
    clearMessage();
  }, duration);
}

export function showObjectiveNotification(duration = 3000) {
  if (!currentObjectiveMessage) return;

  showMessage(currentObjectiveMessage, "objective");

  clearTimeout(revertTimeout);

  revertTimeout = setTimeout(() => {
    clearMessage();
  }, duration);
}

function showMessage(text, type) {
  const el = document.getElementById("game-message-text");
  if (!el) return;

  el.textContent = text;
  el.classList.remove("objective", "alert");
  el.classList.add(type);
}

function clearMessage() {
  const el = document.getElementById("game-message-text");
  if (!el) return;

  el.textContent = "";
  el.classList.remove("objective", "alert");
}