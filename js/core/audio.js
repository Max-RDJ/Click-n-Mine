let audioContext;
const buffers = {};

let isMuted = false;
let volume = 0.5;
let masterGain;

export async function initAudio() {
  if (audioContext) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  masterGain = audioContext.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(audioContext.destination);

  await loadSound("alert", "../audio/alert.mp3");
  await loadSound("mining", "../audio/mining.wav");
  await loadSound("equip_metal", "../audio/Equip_metal.ogg");
  await loadSound("objective_update", "../audio/Objective_update.ogg");

  console.log("Audio initialized");
}

async function loadSound(name, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  buffers[name] = audioBuffer;
}

export function playSound(name) {
  if (isMuted || !audioContext) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const buffer = buffers[name];
  if (!buffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  source.playbackRate.value = 0.98 + Math.random() * 0.04;

  source.connect(masterGain);
  source.start(0);
}

export function setVolume(value) {
  volume = value;
  if (masterGain) {
    masterGain.gain.value = value;
  }
}

export function toggleMute() {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : volume;
  }
}