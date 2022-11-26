import { getXIVAPIData } from "@/js/ffxiv/ffxivdata/ffxivdata";

/**
 *
 * @param {Number} actionId The categoryId to get the actions for
 * @returns {Promise<object>}
 */
async function getActionData(actionId) {
  return getXIVAPIData("Action", actionId);
}

function replaceLbWithBr(text) {
  const replaceTwoLbWithBr = /\n\n/g;
  const removeOnlyLb = /\n/g;
  const replaceBrTagsWithSpaces = /<br \/>[ ]+/g;
  const replaceTwoBrTagsWithOne = /<br \/><br \/>/g;
  const addMissingBrBeforeSpan = /(?<!<br \/>)<span style="color:#00cc22;">/g;
  const addMissingBrBeforeAsterisk = /(?<!<br \/><br \/>)※/g;
  let newText = text.replace(replaceTwoLbWithBr, "<br />");
  newText = newText.replace(removeOnlyLb, "");
  newText = newText.replace(replaceBrTagsWithSpaces, "<br />");
  newText = newText.replace(replaceTwoBrTagsWithOne, "<br />");
  newText = newText.replace(
    addMissingBrBeforeSpan,
    '<br /><span style="color:#00cc22;">'
  );
  newText = newText.replace(addMissingBrBeforeAsterisk, "<br />※");
  return newText;
}

function stripActionData(originalData) {
  return {
    id: originalData["id"],
    action_category: originalData["action_category"]["id"],
    class_job_level: originalData["class_job_level"],
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
    affinity: originalData["class_job_category"]["name_en"],
  };
}

export { getActionData, stripActionData };
