export const objective = [
    {
        id: "stone5",
        message: "Mine 5 stone",
        complete: false,
        condition: (resources) => resources.stone >= 5
    },
    {
        id: "stone10",
        message: "Mine 10 stone",
        complete: false,
        condition: (resources) => resources.stone >= 10,
    },
    {
        id: "sellOne",
        message: "Click on the stone icon under Resources and then click 'Sell 1'.",
        condition: (coins) => coins >= 1,
        complete: false,
        unlock: () => {
            $("#tools").css("display", "block");
        }
    },
    {
        id: "sellAll",
        message: "Click on the stone icon under Resources and then click 'Sell all'.",
        condition: (coins) => coins >= 30,
        complete: false,
        unlock: () => {
            $("#tools").css("display", "block");
        }
    },
    {
      id: "copperAndTin",
      message: "Mine at least 1 copper and 1 tin",
      complete: false,
      condition: (resources) => resources.copper >= 1 && resources.tin >= 1
    },
    {
      id: "buyPickaxe",
      message: "Buy your first pickaxe",
      complete: false,
      condition: (resources, coins, hasPickaxe) => hasPickaxe === true
    },
    {
      id: "smeltIngot",
      message: "Smelt your first bronze ingot",
      complete: false,
      condition: (resources) => resources.bronze >= 1
    },
    {
      id: "smithHelmet",
      message: "Craft your first Bronze Medium Helmet",
      complete: false,
      condition: (resources) => resources.bronzeMediumHelmet >= 1
    },
    {
      id: "coins250",
      message: "Accumulate 250 coins",
      complete: false,
      condition: (resources, coins) => coins >= 250
    },
    {
      id: "sellAll",
      message: "Sell all your resources",
      complete: false,
      condition: (resources) => {
        // Consider complete if all basic resources are zero
        return resources.stone === 0 && resources.copper === 0 && resources.tin === 0;
      }
    }
  ];
  
/**
 * Utility function to check and mark objectives as complete
 * @param {string} objectiveId - ID of the objective
 * @param {object} resources - The resourceCounts object
 * @param {number} coins - Player's current coins
 * @param {boolean} hasPickaxe - Whether the player has a pickaxe
 */
export function completeObjective(objectiveId, resources, coins = 0, hasPickaxe = false) {
    const obj = objective.find(obj => obj.id === objectiveId);
    if (!obj) return console.warn(`Objective '${objectiveId}' not found`);

    const isComplete = obj.condition(resources, coins, hasPickaxe);

    if (isComplete && !obj.complete) {
        obj.complete = true;
        console.log(`Objective '${objectiveId}' completed!`);
        if (obj.unlock) obj.unlock();
        $("#objective-message").text(getActiveObjectiveMessage);
    } else if (!isComplete) {
        console.log(`Objective '${objectiveId}' condition not met.`);
    }
}  

/**
 * Utility to get the first incomplete objective's message
 * @returns {string}
 */
export function getActiveObjectiveMessage() {
    const activeObjective = objective.find(obj => !obj.complete);
    return activeObjective ? activeObjective.message : "All objectives completed!";
}
  