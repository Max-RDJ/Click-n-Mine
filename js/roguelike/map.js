import { initRogueLike } from "./roguelike.js";
import { setState } from "./run-manager.js";

let currentFloor = null;

export function initMap() {
  currentFloor = generateFloor();
  renderMap();
}

function generateFloor() {
  return {
    currentNode: 1,
    nodes: [
      { id: 1, type: "start", next: [2, 3] },
      { id: 2, type: "combat", next: [4] },
      { id: 3, type: "treasure", next: [4] },
      { id: 4, type: "elite", next: [] }
    ]
  };
}

function moveToNode(id) {
  const current = currentFloor.nodes.find(
    n => n.id === currentFloor.currentNode
  );

  if (
    id !== currentFloor.currentNode &&
    !current.next.includes(id)
  ) {
    return;
  }

  currentFloor.currentNode = id;
  const node = currentFloor.nodes.find(n => n.id === id);

  if (node.type === "combat" || node.type === "elite") {
    $("#node-map").hide();
    $("#combat-ui").show();
    setState("combat");
    initRogueLike();
    return;
  }

  if (node.type === "treasure") {
    alert("You found treasure!");
  }

  renderMap();
}

function renderMap() {
  const container = $("#node-container");
  container.empty();

  currentFloor.nodes.forEach(node => {
    const isAvailable =
      node.id === currentFloor.currentNode ||
      currentFloor.nodes
        .find(n => n.id === currentFloor.currentNode)
        .next.includes(node.id);

    const el = $("<div>")
      .addClass("node")
      .text(node.type.toUpperCase())
      .attr("data-id", node.id);

    if (!isAvailable) {
      el.addClass("locked");
    }

    container.append(el);
  });

  bindNodeClicks();
}

function bindNodeClicks() {
  $(".node").off().on("click", function () {
    const id = parseInt($(this).data("id"));
    moveToNode(id);
  });
}