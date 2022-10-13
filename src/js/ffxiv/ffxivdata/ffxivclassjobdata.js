import { getXIVAPIData } from '@/js/ffxiv/ffxivdata/ffxivdata'

/**
 * @param {Number} jobId The id of the job you want the data for
 * @return {Promise}
 */
async function getJobData (jobId) {
  return getXIVAPIData('ClassJob', jobId)
}

function stripJobData (originalData, language = 'en') {
  return {
    id: originalData.id,
    tag: originalData.abbreviation,
    name: originalData.name_english,
    icon: getJobIconUrl(originalData.id),
    translated: originalData['name_' + language]
  }
}

function getJobIconUrl (jobId) {
  if (typeof jobId === 'number') {
    jobId = '' + jobId
  }

  return require(`@/assets/ffxiv/jobs/0621${jobId.padStart(2, '0')}_hr1.png`)
}

export { getJobData, stripJobData }
