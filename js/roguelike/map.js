let currentFloor = null;

export function initMap() {
  currentFloor = generateFloor();
  renderMap();
  $("#node-map").show();
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