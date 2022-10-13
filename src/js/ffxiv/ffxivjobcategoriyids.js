import { FFXIVJobIds } from '@/js/ffxiv/ffxivjobids'

const FFXIVJobCategoryIds = {
  TANK: [113, 161],
  HEAL: [117, 120],
  MELEE: [114, 118, 161],
  PHYSICALRANGE: [115, 118, 161],
  MAGICALRANGE: [116, 120]
}
FFXIVJobCategoryIds[FFXIVJobIds.GLA] = [38]
FFXIVJobCategoryIds[FFXIVJobIds.PGL] = [41]
FFXIVJobCategoryIds[FFXIVJobIds.MRD] = [44]
FFXIVJobCategoryIds[FFXIVJobIds.LNC] = [47]
FFXIVJobCategoryIds[FFXIVJobIds.ARC] = [50]
FFXIVJobCategoryIds[FFXIVJobIds.CNJ] = [53]
FFXIVJobCategoryIds[FFXIVJobIds.THM] = [55]
FFXIVJobCategoryIds[FFXIVJobIds.PLD] = [38, 20]
FFXIVJobCategoryIds[FFXIVJobIds.MNK] = [41, 21]
FFXIVJobCategoryIds[FFXIVJobIds.WAR] = [44, 22]
FFXIVJobCategoryIds[FFXIVJobIds.DRG] = [47, 23]
FFXIVJobCategoryIds[FFXIVJobIds.BRD] = [50, 24]
FFXIVJobCategoryIds[FFXIVJobIds.WHM] = [53, 25]
FFXIVJobCategoryIds[FFXIVJobIds.BLM] = [55, 26]
FFXIVJobCategoryIds[FFXIVJobIds.ACN] = [68, 69]
FFXIVJobCategoryIds[FFXIVJobIds.SMN] = [68, 69, 28]
FFXIVJobCategoryIds[FFXIVJobIds.SCH] = [68, 29]
FFXIVJobCategoryIds[FFXIVJobIds.ROG] = [93]
FFXIVJobCategoryIds[FFXIVJobIds.NIN] = [93, 92]
FFXIVJobCategoryIds[FFXIVJobIds.MCH] = [96]
FFXIVJobCategoryIds[FFXIVJobIds.DRK] = [98]
FFXIVJobCategoryIds[FFXIVJobIds.AST] = [99]
FFXIVJobCategoryIds[FFXIVJobIds.SAM] = [111]
FFXIVJobCategoryIds[FFXIVJobIds.RDM] = [112]
// FFXIVJobCategoryIds[FFXIVJobIds.BLU] = []
FFXIVJobCategoryIds[FFXIVJobIds.GNB] = [149]
FFXIVJobCategoryIds[FFXIVJobIds.DNC] = [150]
FFXIVJobCategoryIds[FFXIVJobIds.RPR] = [180]
FFXIVJobCategoryIds[FFXIVJobIds.SGE] = [161]

function getJobCategoryIds (jobId) {
  const jobCategoryIds = [{ categoryName: 'Jobs', jobCategoryIds: FFXIVJobCategoryIds[jobId] }]

  if (FFXIVJobIds.isTank(jobId)) {
    jobCategoryIds.push({ categoryName: 'Role', jobCategoryIds: FFXIVJobCategoryIds.TANK })
  }

  if (FFXIVJobIds.isMelee(jobId)) {
    jobCategoryIds.push({ categoryName: 'Role', jobCategoryIds: FFXIVJobCategoryIds.MELEE })
  }

  if (FFXIVJobIds.isPhysicalRanged(jobId)) {
    jobCategoryIds.push({ categoryName: 'Role', jobCategoryIds: FFXIVJobCategoryIds.PHYSICALRANGE })
  }

  if (FFXIVJobIds.isMagicalRanged(jobId)) {
    jobCategoryIds.push({ categoryName: 'Role', jobCategoryIds: FFXIVJobCategoryIds.MAGICALRANGE })
  }

  if (FFXIVJobIds.isHealer(jobId)) {
    jobCategoryIds.push({ categoryName: 'Role', jobCategoryIds: FFXIVJobCategoryIds.HEAL })
  }

  return jobCategoryIds
}

export { getJobCategoryIds }
