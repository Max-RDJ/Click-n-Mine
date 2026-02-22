import { playSound } from "../core/audio.js";

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

export function showObjectiveNotification(duration = 8000) {
  if (!currentObjectiveMessage) return;

  showMessage(currentObjectiveMessage, "objective");

  clearTimeout(revertTimeout);

  revertTimeout = setTimeout(() => {
    clearMessage();
  }, duration);
}

function showMessage(text, type) {
  const el = document.getElementById("game-message-text");
  const container = document.getElementById("game-message");
  if (!el || !container) return;

  el.textContent = text;
  el.classList.remove("objective", "alert");
  el.classList.add(type);

  container.classList.add("show");

  if (type === "alert") {
    playSound("alert");
  }
}

function clearMessage() {
  const el = document.getElementById("game-message-text");
  const container = document.getElementById("game-message");
  if (!el || !container) return;

  el.classList.remove("objective", "alert");

  container.classList.remove("show");
}