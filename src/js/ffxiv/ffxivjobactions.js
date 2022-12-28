import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import {
  getCharacterLevel,
  getSortActionsByAcquiredLevel,
} from "@/composables/settings";
import { copyArray } from "@/js/ffxiv/ffxivdata/ffxivdatahelper";

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
  2268, 2269, 2270, 2271, 17413, 17414, 17415, 17417, 17418, 17419, 17420,
  25775, 25877, 25878, 25879,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.DRK] = [25756];
FFXIVJobActionsToIgnore[FFXIVJobIds.AST] = [
  4401, 4402, 4403, 4404, 4405, 4406, 7440, 7441, 7444, 7445, 16558,
];
// FFXIVJobActionsToIgnore[FFXIVJobIds.MCH] = [16503];
FFXIVJobActionsToIgnore[FFXIVJobIds.DNC] = [
  16191, 16192, 16193, 16194, 16195, 16196,
];
FFXIVJobActionsToIgnore[FFXIVJobIds.SGE] = [27524, 28119];
FFXIVJobActionsToIgnore[FFXIVJobIds.SMN] = [
  25843, 25844, 25845, 25846, 25847, 25848, 25849, 25850, 25851, 25852, 25853,
  25854,
];

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

const FFXIVJobActionsInSpecialGroups = {};
FFXIVJobActionsInSpecialGroups[FFXIVJobIds.NIN] = {
  categoryName: "actionGroupNames.special.ninjutsu",
  ids: {
    actionIds: [
      2272, 16491, 16492, 18873, 18876, 18877, 18878, 18879, 18880, 18881,
    ],
  },
};
FFXIVJobActionsInSpecialGroups[FFXIVJobIds.SAM] = {
  categoryName: "actionGroupNames.special.taijutsu",
  ids: {
    actionIds: [7487, 7488, 7489, 16484, 16485, 16486],
  },
};
FFXIVJobActionsInSpecialGroups[FFXIVJobIds.SCH] = {
  categoryName: "actionGroupNames.special.summonSkills",
  ids: {
    actionIds: [7437, 7869, 16537, 16538, 16543, 16546],
  },
};
FFXIVJobActionsInSpecialGroups[FFXIVJobIds.DNC] = {
  categoryName: "actionGroupNames.special.stepSkills",
  ids: {
    actionIds: [15999, 16000, 16001, 16002],
  },
};

function getSpecialActionGroup(jobId) {
  if (typeof FFXIVJobActionsInSpecialGroups[jobId] === "undefined") {
    return null;
  }

  return FFXIVJobActionsInSpecialGroups[jobId];
}

function splitJobActionsIntoGeneralAndSpecialGroup(jobActionsGroup, jobId) {
  if (typeof FFXIVJobActionsInSpecialGroups[jobId] === "undefined") {
    return jobActionsGroup;
  }

  const specialGroup = getSpecialActionGroup(jobId);
  copyArray(jobActionsGroup.ids.actionIds).forEach((actionId) => {
    if (specialGroup.ids.actionIds.includes(actionId)) {
      const index = jobActionsGroup.ids.actionIds.indexOf(actionId);
      jobActionsGroup.ids.actionIds.splice(index, 1);
    }
  });

  return [].concat(jobActionsGroup, specialGroup);
}

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

  copyArray(jobActions).forEach((actionId) => {
    if (jobActionsToRemove.includes(actionId)) {
      const index = jobActions.indexOf(actionId);
      jobActions.splice(index, 1);
    }
  });
}

async function removeNotLearnedJobActions(actionGroups) {
  const actualLevel = getCharacterLevel();
  for (const actionGroup of actionGroups) {
    if (typeof actionGroup.ids.actionIds !== "object") {
      continue;
    }
    const actionsData = await Promise.all(
      actionGroup.ids.actionIds.map((actionId) => getActionData(actionId))
    );
    copyArray(actionGroup.ids.actionIds).forEach((actionId) => {
      const actionData = actionsData.find(
        (actionData) => actionData.id === actionId
      );
      if (actionData["class_job_level"] > actualLevel) {
        const index = actionGroup.ids.actionIds.indexOf(actionId);
        actionGroup.ids.actionIds.splice(index, 1);
      }
    });
  }
}

function getJobActionsToReplaceThroughLevel(jobId) {
  if (typeof FFXIVJobActionsWhichReplaceItself[jobId] === "undefined") {
    return null;
  }

  const actionIdsWhichReplaceItself = JSON.parse(
    JSON.stringify(FFXIVJobActionsWhichReplaceItself[jobId])
  );
  for (const actionIcGroupToReverse of actionIdsWhichReplaceItself) {
    actionIcGroupToReverse.reverse();
  }
  return actionIdsWhichReplaceItself;
}

/**
 * Sort the job actions ascending by acquired lvl.
 * @param {Array} jobActions The job actions to sort
 */
async function sortByAcquiredLvlAscending(jobActions) {
  const actionsData = await Promise.all(
    jobActions.map((actionId) => getActionData(actionId))
  );
  jobActions.sort((actionId1, actionId2) => {
    const actionData1 = actionsData.find(
      (actionData) => actionData.id === actionId1
    );
    const actionData2 = actionsData.find(
      (actionData) => actionData.id === actionId2
    );
    if (actionData1["class_job_level"] < actionData2["class_job_level"]) {
      return -1;
    } else if (
      actionData1["class_job_level"] === actionData2["class_job_level"]
    ) {
      if (actionId1 < actionId2) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  });
}

/**
 * Sort the job actions ascending by id.
 * @param {Array} jobActions The job actions to sort
 */
function sortByIdAscending(jobActions) {
  jobActions.sort((actionId1, actionId2) => {
    if (actionId1 < actionId2) {
      return -1;
    } else {
      return 1;
    }
  });
}

async function sortActionIds(actionGroups) {
  for (const actionGroup of actionGroups) {
    if (typeof actionGroup.ids.actionIds !== "object") {
      continue;
    }

    if (getSortActionsByAcquiredLevel()) {
      await sortByAcquiredLvlAscending(actionGroup.ids.actionIds);
    } else {
      sortByIdAscending(actionGroup.ids.actionIds);
    }
  }
}

export {
  removeIgnoredJobActions,
  removeNotLearnedJobActions,
  getJobActionsToReplaceThroughLevel,
  splitJobActionsIntoGeneralAndSpecialGroup,
  sortActionIds,
};
