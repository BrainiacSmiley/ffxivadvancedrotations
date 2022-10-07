const FFXIVJobIds = {
  GLA: 1, // Gladiator
  PGL: 2, // Pugilist
  MRD: 3, // Marauder
  LNC: 4, // Lancer
  ARC: 5, // Archer
  CNJ: 6, // Conjurer
  THM: 7, // Thaumaturge
  CRP: 8, // Carpenter
  BSM: 9, // Blacksmith
  ARM: 10, // Armorer
  GSM: 11, // Goldsmith
  LTW: 12, // Leatherworker
  WVR: 13, // Weaver
  ALC: 14, // Alchemist
  CUL: 15, // Culinarian
  MIN: 16, // Miner
  BTN: 17, // Botanist
  FSH: 18, // Fisher
  PLD: 19, // Paladin
  MNK: 20, // Monk
  WAR: 21, // Warrior
  DRG: 22, // Dragoon
  BRD: 23, // Bard
  WHM: 24, // Whitemage
  BLM: 25, // Blackmage
  ACN: 26, // Arcanist
  SMN: 27, // Summoner
  SCH: 28, // Scholar
  ROG: 29, // Rouge
  NIN: 30, // Ninja
  MCH: 31, // Machinist
  DRK: 32, // Darknight
  AST: 33, // Astrologian
  SAM: 34, // Samurai
  RDM: 35, // Redmage
  BLU: 36, // Bluemage
  GNB: 37, // Gunbreaker
  DNC: 38, // Dancer
  RPR: 39, // Reaper
  SGE: 40 // Sage
}

FFXIVJobIds.TANKS = [
  FFXIVJobIds.GLA,
  FFXIVJobIds.PLD,
  FFXIVJobIds.MRD,
  FFXIVJobIds.WAR,
  FFXIVJobIds.DRK,
  FFXIVJobIds.GNB
]

FFXIVJobIds.MELEE = [
  FFXIVJobIds.PGL,
  FFXIVJobIds.MNK,
  FFXIVJobIds.LNC,
  FFXIVJobIds.DRG,
  FFXIVJobIds.ROG,
  FFXIVJobIds.NIN,
  FFXIVJobIds.SAM,
  FFXIVJobIds.RPR
]

FFXIVJobIds.PHYSICAL_RANGED = [
  FFXIVJobIds.ARC,
  FFXIVJobIds.BRD,
  FFXIVJobIds.MCH,
  FFXIVJobIds.DNC
]

FFXIVJobIds.DOW = [].concat(FFXIVJobIds.TANKS, FFXIVJobIds.MELEE, FFXIVJobIds.PHYSICAL_RANGED)

FFXIVJobIds.HEALER = [
  FFXIVJobIds.CNJ,
  FFXIVJobIds.WHM,
  FFXIVJobIds.ACN,
  FFXIVJobIds.SCH,
  FFXIVJobIds.AST,
  FFXIVJobIds.SGE
]

FFXIVJobIds.MAGICAL_RANGED = [
  FFXIVJobIds.THM,
  FFXIVJobIds.BLM,
  FFXIVJobIds.SMN,
  FFXIVJobIds.RDM,
  FFXIVJobIds.BLU
]

FFXIVJobIds.DOM = [].concat(FFXIVJobIds.HEALER, FFXIVJobIds.MAGICAL_RANGED)

FFXIVJobIds.DOH = [
  FFXIVJobIds.CRP,
  FFXIVJobIds.BSM,
  FFXIVJobIds.ARM,
  FFXIVJobIds.GSM,
  FFXIVJobIds.LTW,
  FFXIVJobIds.WVR,
  FFXIVJobIds.ALC,
  FFXIVJobIds.CUL
]

FFXIVJobIds.DOL = [
  FFXIVJobIds.MIN,
  FFXIVJobIds.BTN,
  FFXIVJobIds.FSH
]

FFXIVJobIds.LIMITED = [
  FFXIVJobIds.BLU
]

FFXIVJobIds.JOBSWITHOUTSTONE = [
  FFXIVJobIds.GLA,
  FFXIVJobIds.MRD,
  FFXIVJobIds.CNJ,
  FFXIVJobIds.ARC,
  FFXIVJobIds.PGL,
  FFXIVJobIds.LNC,
  FFXIVJobIds.ROG,
  FFXIVJobIds.ARC,
  FFXIVJobIds.THM
]

FFXIVJobIds.isTank = function (jobId) {
  return FFXIVJobIds.TANKS.contains(jobId)
}

FFXIVJobIds.isMelee = function (jobId) {
  return FFXIVJobIds.MELEE.contains(jobId)
}

FFXIVJobIds.isPhysicalRanged = function (jobId) {
  return FFXIVJobIds.PHYSICAL_RANGED.contains(jobId)
}

FFXIVJobIds.isMagicalRanged = function (jobId) {
  return FFXIVJobIds.MAGICAL_RANGED.contains(jobId)
}

FFXIVJobIds.isHealer = function (jobId) {
  return FFXIVJobIds.HEALER.contains(jobId)
}

export { FFXIVJobIds }
