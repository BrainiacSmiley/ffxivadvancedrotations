import { getJobCategoryIds } from "@/js/ffxiv/ffxivjobcategoriyids";
import {
  getActionData,
  getJobActionsForCategoryId,
} from "@/js/ffxiv/ffxivdata/ffxivdata";
import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";

const FFXIVJobActionsToIgnore = {};
FFXIVJobActionsToIgnore[FFXIVJobIds.WHM] = [25863, 25864, 28509];
FFXIVJobActionsToIgnore[FFXIVJobIds.ACN] = [
  172, 25843, 25844, 25845, 25846, 25847, 25848, 25849, 25850, 25851, 25852,
  25853, 25854,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.SCH] = [
  802, 803, 805, 7438, 16544, 16548, 16550, 16551, 16547,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.NIN] = [
  2240, 2242, 2247, 2255, 2259, 2261, 2254, 2263, 16488, 3565, 2265, 2266, 2267,
  2268, 2269, 2270, 2271, 25775, 25877, 25878, 25879,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.DRK] = [25756];
FFXIVJobActionsToIgnore[FFXIVJobIds.AST] = [
  4401, 4402, 4403, 4404, 4405, 4406, 7440, 7441, 7444, 7445, 16558,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.DNC] = [
  16191, 16192, 16193, 16194, 16195, 16196,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.SGE] = [27524, 28119];

const FFXIVJobActionsWhichReplaceItself = {};
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.PLD] = [
  [21, 3539],
  [3542, 25746],
  [29, 25747],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.WAR] = [
  [49, 3549],
  [51, 3550],
  [3551, 25751],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.DRK] = [
  [16466, 16469],
  [16467, 16470],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.GNB] = [
  [16144, 16165],
  [16161, 25758],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.MNK] = [
  [62, 25767],
  [25763, 16474],
  [25761, 3547],
  [3543, 25769],
  [25882, 25768],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.DRG] = [
  [84, 25771],
  [88, 25772],
  [92, 16478],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.NIN] = [[2246, 3566]];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.SAM] = [[7483, 25780]];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.WHM] = [
  [139, 25860],
  [121, 132, 16532],
  [119, 127, 3568, 7431, 16533, 25859],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.SCH] = [
  [17864, 17865, 16540],
  [17869, 3584, 7435, 16541, 25865],
  [16539, 25866],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.AST] = [
  [3599, 3608, 16554],
  [3596, 3598, 7442, 16555, 25871],
  [3615, 25872],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.SGE] = [
  [24283, 24306, 24312],
  [24289, 24307, 24313],
  [24297, 24315],
  [24304, 24316],
  [24288, 24302],
  [24293, 24308, 24314],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.BRD] = [
  [100, 7406],
  [113, 7407],
  [97, 16495],
  [98, 7409],
  [106, 25783],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.MCH] = [
  [2866, 7411],
  [2868, 7412],
  [2873, 7413],
  [2872, 16500],
  [2870, 25786],
  [2864, 16501],
  [7415, 16502],
  [7416, 16503],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.DNC] = [];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.BLM] = [
  [144, 153],
  [7447, 7420],
  [147, 25794],
  [25793, 25795],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.SMN] = [
  [163, 172, 3579],
  [25800, 3581, 7427],
  [16511, 25826],
  [25802, 25805, 25838],
  [25803, 25806, 25839],
  [25804, 25807, 25840],
];
FFXIVJobActionsWhichReplaceItself[FFXIVJobIds.RDM] = [
  [7503, 7524],
  [2509, 16526],
  [7505, 25855],
  [7507, 25856],
];

/**
 *
 * @param {Number} jobId The jobId to get the actions for
 * @returns {Promise<*[]>}
 */
const getJobActions = async (jobId) => {
  const allJobCategories = getJobCategoryIds(jobId);
  const allJobActionsInGroups = [];
  for (const jobCategoriesGroups of allJobCategories) {
    let allJobActions = [];
    for (const jobCategoryId of jobCategoriesGroups.jobCategoryIds) {
      allJobActions = allJobActions.concat(
        await getJobActionsForCategoryId(jobCategoryId)
      );
    }
    allJobActions = removeIgnoredJobActions(jobId, allJobActions);
    // jobCategoriesGroups.actionIds = allJobActions
    jobCategoriesGroups.actions = {};
    for (const actionId of allJobActions) {
      jobCategoriesGroups.actions[actionId] = await getActionData(actionId);
    }
    delete jobCategoriesGroups.jobCategoryIds;
    allJobActionsInGroups.push(jobCategoriesGroups);
  }
  return allJobActionsInGroups;
};

/**
 *
 * @param {number} jobId      The jobId we want to remove ignored Actions
 * @param {array} jobActions  The jobActions which contain the to remove actions
 * @returns {array}
 */
function removeIgnoredJobActions(jobId, jobActions) {
  const jobActionsToRemove = FFXIVJobActionsToIgnore[jobId];
  if (typeof jobActionsToRemove === "undefined") {
    return jobActions;
  }

  for (const actionIdToRemove of jobActionsToRemove) {
    jobActions.forEach((actionId, index) => {
      if (actionId === actionIdToRemove) {
        jobActions.splice(index, 1);
      }
    });
  }
  return jobActions;
}

function getJobActionsToReplaceThroughLevel(jobId) {
  if (typeof FFXIVJobActionsWhichReplaceItself[jobId] === "undefined") {
    return null;
  }

  const actionIdsWhichReplaceItself = [
    ...FFXIVJobActionsWhichReplaceItself[jobId],
  ];
  for (const actionIcGroupToReverse of actionIdsWhichReplaceItself) {
    actionIcGroupToReverse.reverse();
  }
  return actionIdsWhichReplaceItself;
}

export { getJobActions, getJobActionsToReplaceThroughLevel };
