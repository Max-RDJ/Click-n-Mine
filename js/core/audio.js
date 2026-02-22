const sounds = {
  alert: new Audio("../audio/alert.mp3"),

};

let isMuted = false;
let volume = 0.5;

Object.values(sounds).forEach(sound => {
  sound.volume = volume;
});

export function playSound(name) {
  if (isMuted) return;

  const sound = sounds[name];
  if (!sound) return;

  const clone = sound.cloneNode();
  clone.volume = sound.volume;
  clone.play();
}

export function setVolume(value) {
  volume = value;
}

export function toggleMute() {
  isMuted = !isMuted;
}