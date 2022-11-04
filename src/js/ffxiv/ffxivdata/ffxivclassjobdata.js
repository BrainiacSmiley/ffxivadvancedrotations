import { getXIVAPIData } from '@/js/ffxiv/ffxivdata/ffxivdata'

/**
 * @param {Number} jobId The id of the job you want the data for
 * @return {Promise}
 */
async function getJobData (jobId) {
  return getXIVAPIData('ClassJob', jobId)
}

function stripJobData (originalData, language = 'en') {
  const iconName = originalData.name.replace(/\s+/g, '')
  return {
    id: originalData.id,
    tag: originalData.abbreviation,
    name: originalData.name_english,
    icon: `https://xivapi.com/cj/companion/${iconName}.png`,
    translated: originalData[`name_${language}`]
  }
}

export { getJobData, stripJobData }
