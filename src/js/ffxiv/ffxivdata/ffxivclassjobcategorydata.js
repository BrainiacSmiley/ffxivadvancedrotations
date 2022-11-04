import { getXIVAPIData } from '@/js/ffxiv/ffxivdata/ffxivdata'

/**
 *
 * @param {Number} categoryId The categoryId to get the actions for
 * @returns {Promise<object>}
 */
async function getJobActionsForCategoryId (categoryId) {
  return getXIVAPIData('ClassJobCategory', categoryId)
}

function stripJobCategoryData (originalData) {
  const actionIds = []

  for (const actionShortData of originalData) {
    actionIds.push(actionShortData.id)
  }

  return actionIds
}

export { getJobActionsForCategoryId, stripJobCategoryData }
