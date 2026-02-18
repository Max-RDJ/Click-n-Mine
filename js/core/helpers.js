// core/helpers.js
import { resourceCounts } from "./state.js";
import { updateDisplay } from "../ui/ui-update.js";

/**
 * Safely updates a resource by a given amount and refreshes the display.
 * @param {string} resource - The name of the resource to update.
 * @param {number} amount - The amount to add (or subtract) from the resource.
 */

export function updateResource(resource, amount) {
  if (resourceCounts.value.hasOwnProperty(resource)) {
    resourceCounts.value[resource] += amount;
    console.log(`${resource} updated to ${resourceCounts.value[resource]}`);
    updateDisplay();
  } else {
    console.error(`Resource '${resource}' does not exist in resourceCounts.`);
  }
}

/**
 * @param {string} selector - The CSS selector or element ID (e.g., "#my-element").
 * @param {string|number} value - The text value to set.
 */
export function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
