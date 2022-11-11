const FFXIVMAXLVL = 90
const FFXIVVERSION = '6.5.2.1'

const XIVAPI = require('@xivapi/js')
const xiv = new XIVAPI({
  // private_key: '',
  language: 'en',
  snake_case: true
})

const FFXIVJobCategories = {
  tanks: {
    de: 'Tanks',
    en: 'Tanks',
    fr: 'Tanks',
    jp: 'Tanks'
  },
  healer: {
    de: 'Heiler',
    en: 'Healer',
    fr: 'Healer',
    jp: 'Healer'
  },
  mdps: {
    de: 'Melee DPS',
    en: 'Melee DPS',
    fr: 'Melee DPS',
    jp: 'Melee DPS'
  },
  prdps: {
    de: 'Physical Ranged DPS',
    en: 'Physical Ranged DPS',
    fr: 'Physical Ranged DPS',
    jp: 'Physical Ranged DPS'
  },
  mrdps: {
    de: 'Magical Ranged DPS',
    en: 'Magical Ranged DPS',
    fr: 'Magical Ranged DPS',
    jp: 'Magical Ranged DPS'
  }
}

export { FFXIVMAXLVL, FFXIVVERSION, FFXIVJobCategories, xiv }
