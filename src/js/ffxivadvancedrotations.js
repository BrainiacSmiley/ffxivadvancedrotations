import {
  getDoWDoMJobIds,
  getJobIconUrl,
  getTankJobIds,
  getHealerJobIds,
  getMeleeJobIds,
  getPhysicalRangeJobIds,
  getMagicalRangeJobIds
} from '@/js/ffxiv/ffxivhelper'
import { FFXIVJobCategories } from '@/js/ffxiv/ffxivconfigs'

const XIVAPI = require('@xivapi/js')
const xiv = new XIVAPI({
  // private_key: '',
  language: 'en',
  snake_case: true
})

async function getJobData (id) {
  return xiv.data.get('ClassJob', id)
}

function getAllJobsData () {
  const allJobIds = getDoWDoMJobIds()
  const allJobData = []
  allJobIds.forEach(function (jobId) {
    allJobData.push(getJobData(jobId))
  })

  return Promise.all(allJobData)
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

function getAllMenuData (language) {
  return [
    {
      id: 'tanks',
      name: FFXIVJobCategories.tanks[language],
      icon: require('@/assets/ffxiv/TankIcon.png'),
      jobIds: getTankJobIds()
    },
    {
      id: 'healer',
      name: FFXIVJobCategories.healer[language],
      icon: require('@/assets/ffxiv/HealerIcon.png'),
      jobIds: getHealerJobIds()
    },
    {
      id: 'mdps',
      name: FFXIVJobCategories.mdps[language],
      icon: require('@/assets/ffxiv/MeleeIcon.png'),
      jobIds: getMeleeJobIds()
    },
    {
      id: 'prdps',
      name: FFXIVJobCategories.prdps[language],
      icon: require('@/assets/ffxiv/PhysicalRangedIcon.png'),
      jobIds: getPhysicalRangeJobIds()
    },
    {
      id: 'mrdps',
      name: FFXIVJobCategories.mrdps[language],
      icon: require('@/assets/ffxiv/MagicalRangedIcon.png'),
      jobIds: getMagicalRangeJobIds()
    }
  ]
}

export { getAllJobsData, getAllMenuData, stripJobData }
