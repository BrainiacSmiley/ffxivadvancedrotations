// noinspection AllyPlainJsInspection

import { FFXIVVERSION } from "@/js/ffxiv/ffxivconfigs";
import { stripJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { stripJobCategoryData } from "@/js/ffxiv/ffxivdata/ffxivclassjobcategorydata";
import { stripActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { stripItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import Bottleneck from "bottleneck";

const API_OPT = { mode: "cors" };
const XIVAPI_GET_PARAMS = "snake_case=true&language=en";
const LOCAL_STORAGE_KEY_NAME = "ffxivadvancedrotations";
let XIVAPI_DATA = { version: FFXIVVERSION, data: {} };
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
});

/**
 *
 * @param {String} key The key you want data for
 * @param {Number} id The id want the data for
 * @return {Promise}
 */
async function getXIVAPIData(key, id) {
  let data = readFromStoredLocal(key, id);
  if (data) {
    return data;
  }

  data = await limiter.schedule(() => getXIVAPIDataCall(key, id));
  writeToStoredLocal(key, id, data);
  return data;
}

async function getXIVAPIDataCall(key, id) {
  let data;
  if (key === "ClassJob" || key === "Action" || key === "Item") {
    // https://xivapi.com/{key}/{25488}
    data = await fetch(
      `https://xivapi.com/${key}/${id}?${XIVAPI_GET_PARAMS}`,
      API_OPT
    );
    data = await data.json();
  } else if (key === "ClassJobCategory") {
    // https://xivapi.com/search?indexes=Action&filters=ClassJobCategory.ID=25,IsPvP=0
    data = await fetch(
      `https://xivapi.com/search?indexes=Action&filters=ClassJobCategory.ID=${id},IsPvP=0&${XIVAPI_GET_PARAMS}`,
      API_OPT
    );
    data = (await data.json()).results;
  }
  data = stripData(key, data);
  return data;
}

/**
 *
 * @param {String} key
 * @param {object} originalData
 * @return {object}
 */
function stripData(key, originalData) {
  if (key === "ClassJob") {
    return stripJobData(originalData);
  } else if (key === "ClassJobCategory") {
    return stripJobCategoryData(originalData);
  } else if (key === "Action") {
    return stripActionData(originalData);
  } else if (key === "Item") {
    return stripItemData(originalData);
  }
}

/**
 * reads the XIVAPIData stored local storage and invalidates it if the game version has changed
 */
function readXIVAPIData() {
  const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
  const storedXIVAPIData = JSON.parse(jsonData);
  if (!!storedXIVAPIData === false) {
    return;
  }

  if (storedXIVAPIData && storedXIVAPIData.version !== FFXIVVERSION) {
    clearXIVAPIData();
  }
  XIVAPI_DATA = storedXIVAPIData;
}

/**
 * writes the XIVAPIData to local storage and marks it with the actual game version
 */
function saveXIVAPIData() {
  const jsonData = JSON.stringify(XIVAPI_DATA);
  localStorage.setItem(LOCAL_STORAGE_KEY_NAME, jsonData);
}

/**
 * invalidates the local stored XIVAPIData
 */
function clearXIVAPIData() {
  localStorage.removeItem(LOCAL_STORAGE_KEY_NAME);
}

/**
 *
 * @param {String} key The key the value is stored with
 * @param {Number} id The id the value is stored within the key
 */
function readFromStoredLocal(key, id) {
  if (isXIVAPIInitial()) {
    readXIVAPIData();
  }

  if (typeof XIVAPI_DATA.data[key] === "undefined") {
    return null;
  }

  return XIVAPI_DATA.data[key][id];
}

/**
 * Tests if XIVAPI_DATA is in its initial state
 * @returns {boolean}
 */
function isXIVAPIInitial() {
  return !!(XIVAPI_DATA && XIVAPI_DATA.data);
}

/**
 *
 * @param {String} key The key the value is stored into
 * @param {Number} id The id the value is stored under the key
 * @param {array|object} data The data to be stored
 */
function writeToStoredLocal(key, id, data) {
  if (typeof XIVAPI_DATA.data[key] === "undefined") {
    XIVAPI_DATA.data[key] = {};
  }
  XIVAPI_DATA.data[key][id] = data;
  saveXIVAPIData();
}

export { getXIVAPIData, clearXIVAPIData };
