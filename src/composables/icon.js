import { setTooltipId } from "@/composables/tooltipId";

/**
 * @param {Number} id The id of the actual selected icon
 * @param {String} type The type of the actual selected icon
 */
function changeSelectedIcon(id, type) {
  setTooltipId(id, type);
}
/**
 * Sets the data needed for the drag and drop action
 * @param {Number} itemId The actionId of the dragged action
 * @param {object} event The drag event
 * @param {String} type The type of the element that is dragged
 * @param {String} source The source the element is dragged from
 * @param {Number} position The position of the element that is dragged
 */
function setDragData(itemId, event, type, source, position) {
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.effectAllowed = "copyMove";
  if (source === "rotation") {
    event.dataTransfer.dropEffect = "move";
  }
  event.dataTransfer.setData("type", type);
  event.dataTransfer.setData("id", `${itemId}`);
  event.dataTransfer.setData("source", source);
  event.dataTransfer.setData("position", position);
}

export { changeSelectedIcon, setDragData };
