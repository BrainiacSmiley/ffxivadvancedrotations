import {
  getDoWDoMJobIds,
  getTankJobIds,
  getHealerJobIds,
  getMeleeJobIds,
  getPhysicalRangeJobIds,
  getMagicalRangeJobIds
} from '@/js/ffxiv/ffxivhelper'
import { FFXIVJobCategories } from '@/js/ffxiv/ffxivconfigs'
import { getJobData } from '@/js/ffxiv/ffxivdata/ffxivdata'

function getAllJobsData () {
  const allJobIds = getDoWDoMJobIds()
  const allJobData = []
  allJobIds.forEach((jobId) => {
    allJobData.push(getJobData(jobId))
  })

  return Promise.all(allJobData)
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

export { getAllJobsData, getAllMenuData }
