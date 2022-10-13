import { FFXIVVERSION } from '@/js/ffxiv/ffxivconfigs'
import { getJobData, stripJobData } from '@/js/ffxiv/ffxivdata/ffxivclassjobdata'
const XIVAPI = require('@xivapi/js')
const xiv = new XIVAPI({
  // private_key: '',
  language: 'en',
  snake_case: true
})
const LOCAL_STORAGE_KEY_NAME = 'ffxivadvancedrotations'
let XIVAPI_DATA = { version: FFXIVVERSION, data: {} }

/**
 *
 * @param {String} key The key you want data for
 * @param {Number} id The id want the data for
 * @return {Promise}
 */
async function getXIVAPIData (key, id) {
  let data = readFromStoredLocal(key, id)
  if (data) {
    return data
  }

  // https://xivapi.com/{Action}/{25488}
  data = await xiv.data.get(key, id)
  data = stripData(key, data)
  writeToStoredLocal(key, id, data)
  return data
}

/**
 *
 * @param {String} key
 * @param {object} originalData
 * @return {object}
 */
function stripData (key, originalData) {
  if (key === 'ClassJob') {
    return stripJobData(originalData)
  }
}

/**
 *
 * @param {Number} categoryId The categoryId to get the actions for
 * @returns {Promise<object>}
 */
async function getJobActionsForCategoryId (categoryId) {
  let data = readFromStoredLocal('ClassJobCategory', categoryId)
  if (data) {
    return data
  }

  // https://xivapi.com/search?indexes=Action&filters=ClassJobCategory.ID=92,IsPvP=0
  const res = await xiv.search('', { indexes: 'Action', filters: `ClassJobCategory.ID=${categoryId}, IsPvP=0` })
  data = res.results
  writeToStoredLocal('ClassJobCategory', categoryId, data)
  return data
}

/**
 *
 * @param {Number} actionId The actionId to get the data for
 * @returns {Promise<number|string>}
 */
async function getAction (actionId) {
  return getXIVAPIData('Action', actionId)
}

/**
 *
 * @param {array} actionIds The actionIds to get the data for
 * @returns {Promise<number|string>}
 */
const getActions = async (actionIds) => {
  // https://xivapi.com/Action/25488
  const res = await xiv.data.get('Action', { ids: actionIds })
  return res.results
}

/**
 * reads the XIVAPIData stored local storage and invalidates it if the game version has changed
 */
function readXIVAPIData () {
  const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY_NAME)
  const storedXIVAPIData = JSON.parse(jsonData)
  if (!!storedXIVAPIData === false) {
    return
  }

  if (storedXIVAPIData && storedXIVAPIData.version !== FFXIVVERSION) {
    clearXIVAPIData()
  }
  XIVAPI_DATA = storedXIVAPIData
}

/**
 * writes the XIVAPIData to local storage and marks it with the actual game version
 */
function saveXIVAPIData () {
  const jsonData = JSON.stringify(XIVAPI_DATA)
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, jsonData)
}

/**
 * invalidates the local stored XIVAPIData
 */
function clearXIVAPIData () {
  localStorage.removeItem(LOCAL_STORAGE_KEY_NAME)
}

/**
 *
 * @param {String} key The key the value is stored with
 * @param {Number} id The id the value is stored within the key
 */
function readFromStoredLocal (key, id) {
  if (isXIVAPIInitial()) {
    readXIVAPIData()
  }

  if (typeof XIVAPI_DATA.data[key] === 'undefined') {
    return null
  }

  return XIVAPI_DATA.data[key][id]
}

/**
 * Tests if XIVAPI_DATA is in its initial state
 * @returns {boolean}
 */
function isXIVAPIInitial () {
  return !!(XIVAPI_DATA && XIVAPI_DATA.data)
}

/**
 *
 * @param {String} key The key the value is stored into
 * @param {Number} id The id the value is stored under the key
 * @param {array|object} data The data to be stored
 */
function writeToStoredLocal (key, id, data) {
  if (typeof XIVAPI_DATA.data[key] === 'undefined') {
    XIVAPI_DATA.data[key] = {}
  }
  XIVAPI_DATA.data[key][id] = data
  saveXIVAPIData()
}

export { getJobData, getXIVAPIData, getJobActionsForCategoryId, getAction, getActions, clearXIVAPIData }
