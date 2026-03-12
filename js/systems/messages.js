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

function showMessage(text, type, duration = 8000) {
  const el = document.getElementById("game-message-text");
  const container = document.getElementById("game-message");
  const timer = document.getElementById("game-message-timer");

  if (!el || !container || !timer) return;

  el.textContent = text;

  el.classList.remove("objective", "alert");
  el.classList.add(type);

  container.classList.add("show");

  timer.classList.remove("timer-running");
  timer.style.animationDuration = duration + "ms";
  void timer.offsetWidth;
  timer.classList.add("timer-running");

  if (type === "alert") {
    playSound("alert");
  }
}

export function clearMessage() {
  const el = document.getElementById("game-message-text");
  const container = document.getElementById("game-message");
  if (!el || !container) return;

  el.classList.remove("objective", "alert");

  container.classList.remove("show");
}