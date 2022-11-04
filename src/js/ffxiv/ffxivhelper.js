import { FFXIVMAXLVL } from '@/js/ffxiv/ffxivconfigs'
import { FFXIVJobIds } from '@/js/ffxiv/ffxivjobids'

function getTankJobIds (lvl = [FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL]) {
  let tankJobIds = []

  // GLA ~ PLD
  if (lvl[0] < 30) {
    tankJobIds = [].concat(tankJobIds, FFXIVJobIds.GLA)
  } else {
    tankJobIds = [].concat(tankJobIds, FFXIVJobIds.PLD)
  }

  // MRD ~ WAR
  if (lvl[1] < 30) {
    tankJobIds = [].concat(tankJobIds, FFXIVJobIds.MRD)
  } else {
    tankJobIds = [].concat(tankJobIds, FFXIVJobIds.WAR)
  }

  tankJobIds = [].concat(tankJobIds, FFXIVJobIds.DRK)
  tankJobIds = [].concat(tankJobIds, FFXIVJobIds.GNB)

  return tankJobIds
}

function getHealerJobIds (lvl = [FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL]) {
  let healJobIds = []

  // CNJ ~ WHM
  if (lvl[0] < 30) {
    healJobIds = [].concat(healJobIds, FFXIVJobIds.CNJ)
  } else {
    healJobIds = [].concat(healJobIds, FFXIVJobIds.WHM)
  }

  // ARC ~ SCH
  if (lvl[1] < 30) {
    healJobIds = [].concat(healJobIds, FFXIVJobIds.ARC)
  } else {
    healJobIds = [].concat(healJobIds, FFXIVJobIds.SCH)
  }

  healJobIds = [].concat(healJobIds, FFXIVJobIds.AST)
  healJobIds = [].concat(healJobIds, FFXIVJobIds.SGE)

  return healJobIds
}

function getMeleeJobIds (lvl = [FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL]) {
  let meleeJobIds = []

  // PGL ~ MNK
  if (lvl[0] < 30) {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.PGL)
  } else {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.MNK)
  }

  // LNC ~ DRG
  if (lvl[1] < 30) {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.LNC)
  } else {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.DRG)
  }

  // ROG ~ NIN
  if (lvl[2] < 30) {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.ROG)
  } else {
    meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.NIN)
  }

  meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.SAM)
  meleeJobIds = [].concat(meleeJobIds, FFXIVJobIds.RPR)

  return meleeJobIds
}

function getPhysicalRangeJobIds (lvl = [FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL]) {
  let physicalRangedJobIds = []

  // ARC ~ BRD
  if (lvl[0] < 30) {
    physicalRangedJobIds = [].concat(physicalRangedJobIds, FFXIVJobIds.ARC)
  } else {
    physicalRangedJobIds = [].concat(physicalRangedJobIds, FFXIVJobIds.BRD)
  }

  physicalRangedJobIds = [].concat(physicalRangedJobIds, FFXIVJobIds.MCH)
  physicalRangedJobIds = [].concat(physicalRangedJobIds, FFXIVJobIds.DNC)

  return physicalRangedJobIds
}

function getMagicalRangeJobIds (lvl = [FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL/* , FFXIVMAXLVL-20 */]) {
  let magicalRangedJobIds = []

  // THM ~ BLM
  if (lvl[0] < 30) {
    magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.THM)
  } else {
    magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.BLM)
  }

  // ARC ~ SMN
  if (lvl[1] < 30) {
    magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.ARC)
  } else {
    magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.SMN)
  }

  magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.RDM)
  // magicalRangedJobIds = [].concat(magicalRangedJobIds, FFXIVJobIds.BLU)

  return magicalRangedJobIds
}

function getDoWDoMJobIds (lvl = [
  FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL, FFXIVMAXLVL - 20]) {
  let dowDomJobIds = []

  dowDomJobIds = [].concat(dowDomJobIds, getTankJobIds(lvl.slice(0, 4)))
  dowDomJobIds = [].concat(dowDomJobIds, getHealerJobIds(lvl.slice(4, 8)))
  dowDomJobIds = [].concat(dowDomJobIds, getMeleeJobIds(lvl.slice(8, 13)))
  dowDomJobIds = [].concat(dowDomJobIds, getPhysicalRangeJobIds(lvl.slice(13, 16)))
  dowDomJobIds = [].concat(dowDomJobIds, getMagicalRangeJobIds(lvl.slice(16, 19)))

  return dowDomJobIds
}

export {
  getTankJobIds,
  getHealerJobIds,
  getMeleeJobIds,
  getPhysicalRangeJobIds,
  getMagicalRangeJobIds,
  getDoWDoMJobIds
}
