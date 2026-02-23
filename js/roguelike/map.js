import { initRogueLike } from "./roguelike.js";
import { setState } from "./run-manager.js";
import { pickRandomEnemy } from "./enemies.js";

let currentFloor = null;
let nodeElements = {};

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

    return currentFloor.nodes.some(n => n.completed && n.next.includes(node.id));
}

export function generateFloor(tiersCount = 5, tierWidth = 5) {
  const nodes = [];
  let idCounter = 1;

  nodes.push({ id: idCounter, type: "start", next: [], tier: 0, completed: true });

  for (let tier = 1; tier <= tiersCount; tier++) {
  const nodesThisTier = Math.floor(Math.random() * 3) + 3; 

  for (let i = 0; i < nodesThisTier; i++) {
      idCounter++;
      const roll = Math.random();
      const type = roll < 0.6 ? "combat" : "treasure";

      nodes.push({
        id: idCounter,
        type,
        next: [],
        tier,
        completed: false,
        enemyPoolLevel: Math.min(tier, 4),

        offsetX: (Math.random() - 0.5) * 30
      });
    }
  }

  // Boss node
  idCounter++;
  nodes.push({
    id: idCounter,
    type: "boss",
    tier: tiersCount + 1,
    completed: false,
    next: [],
    enemyPoolLevel: 4
  });

  for (let tier = 0; tier <= tiersCount; tier++) {
    const currentTierNodes = nodes.filter(n => n.tier === tier);
    const nextTierNodes = nodes.filter(n => n.tier === tier + 1);

    const currentCount = currentTierNodes.length;
    const nextCount = nextTierNodes.length;

    currentTierNodes.forEach((node, i) => {
      if (nextCount === 0) return;

      const ratio = i / (currentCount - 1 || 1);
      const targetIndex = Math.round(ratio * (nextCount - 1));

      node.next.push(nextTierNodes[targetIndex].id);

      if (Math.random() < 0.4) {
        const neighbor = targetIndex + (Math.random() < 0.5 ? -1 : 1);
        if (neighbor >= 0 && neighbor < nextCount) {
          node.next.push(nextTierNodes[neighbor].id);
        }
      }
    });
  }


    nodes.forEach(node => {
    if (node.tier <= 1) return;

    const hasIncoming = nodes.some(n =>
        n.next.includes(node.id)
    );

    if (!hasIncoming) {
        const previousTierNodes = nodes.filter(n => n.tier === node.tier - 1);
        if (previousTierNodes.length > 0) {
        const randomParent = previousTierNodes[
            Math.floor(Math.random() * previousTierNodes.length)
        ];
        randomParent.next.push(node.id);
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

  Object.keys(tiers).sort((a,b)=>a-b).forEach(tierNum => {
    const row = $("<div>")
      .addClass("node-row")
      .css({
        display: "flex",
        justifyContent: "space-around",
        margin: "40px 0"
      });

    tiers[tierNum].forEach(node => {
      const el = $("<div>")
        .addClass("node")
        .text(node.type.toUpperCase())
        .attr("data-id", node.id);

            el.css("transform", `translateX(${node.offsetX || 0}px)`);


        if (node.completed) el.addClass("completed");
        if (!isNodeAvailable(node)) el.addClass("locked");

        row.append(el);
        nodeElements[node.id] = el;
    });

    container.append(row);
  });

  bindNodeClicks();

  requestAnimationFrame(() => {
    drawConnections();
  });
}

function drawConnections() {
  const svg = $("#node-connections");
  svg.empty();

    const containerRect = svg[0].getBoundingClientRect();

  svg.attr("width", containerRect.width);
  svg.attr("height", containerRect.height);

  currentFloor.nodes.forEach(node => {
    node.next.forEach(nextId => {
      const startEl = nodeElements[node.id];
      const endEl = nodeElements[nextId];
      if (!startEl || !endEl) return;

      const startRect = startEl[0].getBoundingClientRect();
      const endRect = endEl[0].getBoundingClientRect();

      const x1 = startRect.left + startRect.width / 2 - containerRect.left;
      const y1 = startRect.top + startRect.height / 2 - containerRect.top;
      const x2 = endRect.left + endRect.width / 2 - containerRect.left;
      const y2 = endRect.top + endRect.height / 2 - containerRect.top;

      const line = document.createElementNS("http://www.w3.org/2000/svg","line");

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
    node.completed = true; 
    if (node.type === "combat" || node.type === "boss") {
        const enemyType = pickRandomEnemy(node.enemyPoolLevel || 1);
        setState("combat");
        $("#combat-ui").show();
        initRogueLike(enemyType);
        return;
    }

    renderMap();

    if (node.type === "treasure") {
        alert("You found treasure!");
    }
}