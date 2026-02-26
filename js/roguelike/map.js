import { initRogueLike } from "./roguelike.js";
import { setState } from "./run-manager.js";
import { pickRandomEnemy } from "./enemies.js";
import { initMining } from "./mines.js";

let currentFloor = null;
let nodeElements = {};

const NODE_IMAGES = {
  combat: "images/enemy_icon.png",
  treasure: "images/treasure_icon.png",
  mines: "images/mines_icon.png",
}

export function initMap() {
  currentFloor = generateFloor();
  renderMap();
}

function isNodeAvailable(node) {
  if (node.tier === 0) return true;

  const currentNode = currentFloor.currentNode
    ? currentFloor.nodes.find(n => n.id === currentFloor.currentNode)
    : null;

  if (currentNode && currentNode.next.includes(node.id)) {
    return true;
  }

  return currentFloor.nodes.some(
    n => n.completed && n.next.includes(node.id)
  );
}

function getRandomNodeType() {
  const roll = Math.random();

  if (roll < 0.55) return "combat";     // 55%
  if (roll < 0.80) return "treasure";   // 25%
  return "mines";                       // 20%
}

export function generateFloor(tiersCount = 5) {
  const nodes = [];
  let idCounter = 1;

  nodes.push({
    id: idCounter,
    type: "start",
    tier: 0,
    next: [],
    completed: true
  });

  for (let tier = 1; tier <= tiersCount; tier++) {
    const nodesThisTier = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < nodesThisTier; i++) {
      idCounter++;

      nodes.push({
        id: idCounter,
        type: getRandomNodeType(),
        tier,
        next: [],
        completed: false,
        enemyPoolLevel: Math.min(tier, 4),
        offsetX: (Math.random() - 0.5) * 40
      });
    }
  }

  idCounter++;
  nodes.push({
    id: idCounter,
    type: "boss",
    tier: tiersCount + 1,
    next: [],
    completed: false,
    enemyPoolLevel: 4
  });

  for (let tier = 0; tier <= tiersCount; tier++) {
    const currentTierNodes = nodes.filter(n => n.tier === tier);
    const nextTierNodes = nodes.filter(n => n.tier === tier + 1);

    if (!nextTierNodes.length) continue;

    const currentCount = currentTierNodes.length;
    const nextCount = nextTierNodes.length;

    currentTierNodes.forEach((node, i) => {
      const startIndex = Math.floor(i * nextCount / currentCount);
      const endIndex = Math.floor((i + 1) * nextCount / currentCount);

      for (let j = startIndex; j <= endIndex; j++) {
        if (j >= 0 && j < nextCount) {
          const childId = nextTierNodes[j].id;
          if (!node.next.includes(childId)) {
            node.next.push(childId);
          }
        }
      }
    });
  }

  nodes.forEach(node => {
    if (node.tier === 0) return;

    const hasIncoming = nodes.some(n =>
      n.next.includes(node.id)
    );

    if (!hasIncoming) {
      const previousTier = nodes.filter(
        n => n.tier === node.tier - 1
      );

      if (previousTier.length) {
        const randomParent =
          previousTier[Math.floor(Math.random() * previousTier.length)];

        if (!randomParent.next.includes(node.id)) {
          randomParent.next.push(node.id);
        }
      }
    }
  });

  return { currentNode: null, nodes };
}

export function renderMap() {
  const container = $("#node-container");
  const svg = $("#node-connections");

  container.empty();
  svg.empty();
  nodeElements = {};

  const tiers = {};

  currentFloor.nodes.forEach(node => {
    if (node.type === "start") return;

    if (!tiers[node.tier]) tiers[node.tier] = [];
    tiers[node.tier].push(node);
  });

  Object.keys(tiers)
    .sort((a, b) => a - b)
    .forEach(tierNum => {
      const row = $("<div>")
        .addClass("node-row")
        .css({
          display: "flex",
          justifyContent: "space-around",
          margin: "40px 0",
          position: "relative"
        });

      tiers[tierNum].forEach(node => {
        const el = $("<div>")
          .addClass("node")
          .attr("data-id", node.id)
          .css("transform", `translateX(${node.offsetX || 0}px)`);

          const img = $("<img>")
          .addClass("node-icon")
          .attr("src", NODE_IMAGES[node.type])
          .attr("alt", node.type);

          el.append(img);

        if (node.completed) el.addClass("completed");
        if (!isNodeAvailable(node)) el.addClass("locked");

        row.append(el);
        nodeElements[node.id] = el;
      });

      container.append(row);
    });

  bindNodeClicks();

  requestAnimationFrame(drawConnections);
}

function drawConnections() {
  const svg = $("#node-connections");
  svg.empty();

  const containerRect = svg[0].getBoundingClientRect();

  svg.attr("width", containerRect.width);
  svg.attr("height", containerRect.height);

  const drawn = new Set();

  currentFloor.nodes.forEach(node => {
    node.next.forEach(nextId => {

      const key = `${node.id}-${nextId}`;
      if (drawn.has(key)) return;
      drawn.add(key);

      const startEl = nodeElements[node.id];
      const endEl = nodeElements[nextId];

      if (!startEl || !endEl) return;

      const startRect = startEl[0].getBoundingClientRect();
      const endRect = endEl[0].getBoundingClientRect();

      const x1 = startRect.left + startRect.width / 2 - containerRect.left;
      const y1 = startRect.top + startRect.height / 2 - containerRect.top;
      const x2 = endRect.left + endRect.width / 2 - containerRect.left;
      const y2 = endRect.top + endRect.height / 2 - containerRect.top;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#878787");
      line.setAttribute("stroke-width", "4");

      svg.append(line);
    });
  });
}

window.addEventListener("resize", () => {
  if (currentFloor) drawConnections();
});

function bindNodeClicks() {
  $(".node").off().on("click", function () {
    const id = parseInt($(this).data("id"));
    moveToNode(id);
  });
}

function moveToNode(id) {
  const node = currentFloor.nodes.find(n => n.id === id);
  if (!isNodeAvailable(node)) return;

  node.completed = true;
  currentFloor.currentNode = id;

  if (node.type === "combat" || node.type === "boss") {
    const enemyType = pickRandomEnemy(node.enemyPoolLevel || 1);
    setState("combat");
    $("#combat-ui").show();
    initRogueLike(enemyType);
    return;
  }

  if (node.type === "mines") {
    setState("mines");
    initMining(node.tier);
    return;
  }

  renderMap();

  if (node.type === "treasure") {
    alert("You found treasure!");
  }
}