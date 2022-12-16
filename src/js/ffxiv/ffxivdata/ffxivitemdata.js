import { getXIVAPIData } from "@/js/ffxiv/ffxivdata/ffxivdata";
import { replaceLbWithBr } from "@/js/ffxiv/ffxivdata/ffxivdatahelper";

/**
 *
 * @param {Number} itemId The categoryId to get the actions for
 * @returns {Promise<object>}
 */
async function getItemData(itemId) {
  return getXIVAPIData("Item", itemId);
}
function stripItemData(originalData) {
  return {
    id: originalData["id"],
    item_category: originalData["item_uicategory"]["id"],
    item_category_name_de: originalData["item_uicategory"]["name_de"],
    item_category_name_en: originalData["item_uicategory"]["name_en"],
    item_category_name_fr: originalData["item_uicategory"]["name_fr"],
    item_category_name_js: originalData["item_uicategory"]["name_ja"],
    description_de: replaceLbWithBr(originalData["description_de"]),
    description_en: replaceLbWithBr(originalData["description_en"]),
    description_fr: replaceLbWithBr(originalData["description_fr"]),
    description_ja: replaceLbWithBr(originalData["description_ja"]),
    description_json_de: originalData["description_json_de"],
    description_json_en: originalData["description_json_en"],
    description_json_fr: originalData["description_json_fr"],
    description_json_ja: originalData["description_json_ja"],
    icon: `https://xivapi.com${originalData["icon_hd"]}`,
    name_de: originalData["name_de"],
    name_en: originalData["name_en"],
    name_fr: originalData["name_fr"],
    name_ja: originalData["name_ja"],
    range: originalData["range"],
    radius: originalData["effect_range"],
    cost: originalData["primary_cost_value"],
    costType: originalData["primary_cost_type"],
    cast100ms: originalData["cast100ms"],
    recast100ms: originalData["recast100ms"],
    bonuses: originalData["bonuses"],
    cooldown: originalData["cooldown_s"],
  };
}

export { getItemData, stripItemData };
