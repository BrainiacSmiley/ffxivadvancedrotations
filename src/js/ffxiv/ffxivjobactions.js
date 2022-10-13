import { getJobCategoryIds } from '@/js/ffxiv/ffxivjobcategoriyids'
import { getAction, getJobActionsForCategoryId } from '@/js/ffxiv/ffxivdata/ffxivdata'

const FFXIVJobActionsToIgnore = {
  24: [25863, 25864, 28509], // WHM
  27: [172, 25843, 25844, 25845, 25846, 25847, 25848, 25849, 25850, 25851, 25852, 25853, 25854], // ACN
  28: [802, 803, 805, 7438, 16544, 16548, 16550, 16551, 16547], // SCH
  92: [2240, 2242, 2247, 2255, 2259, 2261, 2254, 2263, 16488, 3565, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 25775, 25877, 25878, 25879], // NIN
  98: [25756], // DRK
  99: [4401, 4402, 4403, 4404, 4405, 4406, 7440, 7441, 7444, 7445, 16558], // AST
  150: [16191, 16192, 16193, 16194, 16195, 16196], // DNC
  161: [27524, 28119] // SGE
}

const getJobActions = async (jobId) => {
  const allJobCategories = getJobCategoryIds(jobId)
  const allJobActionsInGroups = []
  for (const jobCategoriesGroups of allJobCategories) {
    let allJobActions = []
    for (const jobCategoryId of jobCategoriesGroups.jobCategoryIds) {
      allJobActions = allJobActions.concat(await getJobActionsForCategoryId(jobCategoryId))
    }
    allJobActions = removeIgnoredJobActions(jobId, allJobActions)
    jobCategoriesGroups.shortActions = allJobActions
    jobCategoriesGroups.strippedActions = stripJobActions(allJobActions)
    allJobActionsInGroups.push(jobCategoriesGroups)
  }
  return allJobActionsInGroups
}

/**
 *
 * @param {number} jobId      The jobId we want to remove ignored Actions
 * @param {array} jobActions  The jobActions which contain the to remove actions
 * @returns {array}
 */
function removeIgnoredJobActions (jobId, jobActions) {
  const jobActionsToRemove = FFXIVJobActionsToIgnore[jobId]
  if (typeof jobActionsToRemove === 'undefined') {
    return jobActions
  }

  for (const actionId of jobActionsToRemove) {
    jobActions.forEach((action, index) => {
      if (action.id === actionId) {
        jobActions.splice(index, 1)
      }
    })
  }
  return jobActions
}

/**
 *
 * @param {array} jobActions The job actions to strip unused data from
 * @return {array}
 */
function stripJobActions (jobActions) {
  for (const index in jobActions) {
    jobActions[index] = stripJobAction(jobActions[index])
  }
}

/**
 * @param {object} jobActionToStrip The jobAction to strip
 * @returns {object}
 */
function stripJobAction (jobActionToStrip) {
  console.log(jobActionToStrip)
  const fullJobData = getAction(jobActionToStrip.id)
  console.log(fullJobData)
  return jobActionToStrip
}

// function formatAllJobActions () {}

export { getJobActions }
