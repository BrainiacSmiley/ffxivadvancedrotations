import { getJobActionsToReplaceThroughLevel } from "@/js/ffxiv/ffxivjobactions";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";

/**
 *
 * @param {array} allActionGroups The groups to remove the actions from
 * @param {Number} jobId The jobId we want tot remove the actions for
 * @returns {Promise}
 */
async function removeJobsThatSwapThroughLevelUp(allActionGroups, jobId) {
  const actionIdsToRemove = await getActionIdsToRemove(jobId);
  for (const actionGroup of allActionGroups) {
    for (const [key, actionId] of Object.entries(actionGroup.ids.actionIds)) {
      if (actionIdsToRemove.includes(actionId)) {
        delete actionGroup.ids.actionIds[key];
      }
    }
    actionGroup.ids.actionIds = actionGroup.ids.actionIds.filter(Boolean);
  }
  return allActionGroups;
}

async function getActionIdsToRemove(jobId) {
  const possibleReplacedActions = getJobActionsToReplaceThroughLevel(jobId);
  const actionIdsToReplace = [];
  if (possibleReplacedActions === null) {
    return actionIdsToReplace;
  }

  let highestSpellFromGroupFound = false;
  for (const actionGroup of possibleReplacedActions) {
    highestSpellFromGroupFound = false;

    for (const actionId of actionGroup) {
      if (highestSpellFromGroupFound) {
        actionIdsToReplace.push(actionId);
        continue;
      }

      const actionData = await getActionData(actionId);
      if (actionData.level > FFXIVMAXLVL) {
        actionIdsToReplace.push(actionId);
      } else {
        highestSpellFromGroupFound = true;
      }
    }
  }
  return actionIdsToReplace;
}

export { removeJobsThatSwapThroughLevelUp };
