// noinspection AllyPlainJsInspection

import { getXIVAPIData } from "@/js/ffxiv/ffxivdata/ffxivdata";
import { replaceLbWithBr } from "@/js/ffxiv/ffxivdata/ffxivdatahelper";

const LIMITBREAKACTIONIDS = [
  199, 202, 205, 208, 4240, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248,
  7861, 7862, 17105, 17106, 24858, 24859,
];
const TANKLIMITBREAKACTIONIDS = [199, 4240, 4241, 17105];
const HEALLIMITBREAKACTIONIDS = [208, 4247, 4248, 24859];
const MELEELIMITBREAKACTIONIDS = [202, 4242, 4243, 7861, 24858];
const PHYSICALRANGELIMITBREAKACTIONIDS = [4244, 4245, 17106];
const MAGICALRANGELIMITBREAKACTIONIDS = [205, 4246, 7862];
const LIMITBREAKACTIONSDATA = {
  3: {
    TANK: {},
    HEAL: {},
    MELEE: {},
    PHYSICALRANGE: {},
    MAGICALRANGE: {},
  },
};
LIMITBREAKACTIONSDATA[3]["TANK"]["description_de"] =
  "Du verringerst den erlittenen Schaden aller Gruppenmitglieder um 80%.\n\nDauer: 12 Sekunden";
LIMITBREAKACTIONSDATA[3]["TANK"]["description_en"] =
  'Reduces damage taken by all party members by 80%.\n\n<span style="color:#00cc22;">Duration:</span> 12s';
LIMITBREAKACTIONSDATA[3]["TANK"]["description_fr"] =
  'Réduit de 80% les dégâts reçus par tous les équipiers.\\n\\n<span style="color:#ffff66;">Durée:</span> 12s';
LIMITBREAKACTIONSDATA[3]["TANK"]["description_ja"] =
  "一定時間、パーティメンバーの被ダメージを80％軽減させる。\\n\\n効果時間：12秒";
LIMITBREAKACTIONSDATA[3]["TANK"]["description_json_de"] = [
  "Du verringerst den erlittenen Schaden aller Gruppenmitglieder um 80%.\n\nDauer: 12 Sekunden",
];
LIMITBREAKACTIONSDATA[3]["TANK"]["description_json_en"] = [
  'Reduces damage taken by all party members by 80%.\n\n<span style="color:#00cc22;">Duration:</span> 12s',
];
LIMITBREAKACTIONSDATA[3]["TANK"]["description_json_fr"] = [
  'Réduit de 80% les dégâts reçus par tous les équipiers.\\n\\n<span style="color:#ffff66;">Durée:</span> 12s',
];
LIMITBREAKACTIONSDATA[3]["TANK"]["description_json_ja"] = [
  "一定時間、パーティメンバーの被ダメージを80％軽減させる。\\n\\n効果時間：12秒",
];
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_de"] =
  "Du regenerierst 100 % deiner eigenen Maximal-LP und der der Gruppenmitglieder in deiner Nähe, auch der k. o. gegangenen.";
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_en"] =
  "Restores 100% of own HP and the HP of all nearby party members, including ones KO'd.";
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_fr"] =
  "Restaure tous vos PV et ceux des équipiers alentour, et ressuscite ceux inconscients.";
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_ja"] =
  "自身と周囲のパーティメンバーのＨＰを全回復し、さらに蘇生する。";
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_json_de"] = [
  "Du regenerierst 100 % deiner eigenen Maximal-LP und der der Gruppenmitglieder in deiner Nähe, auch der k. o. gegangenen.",
];
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_json_en"] = [
  "Restores 100% of own HP and the HP of all nearby party members, including ones KO'd.",
];
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_json_fr"] = [
  "Restaure tous vos PV et ceux des équipiers alentour, et ressuscite ceux inconscients.",
];
LIMITBREAKACTIONSDATA[3]["HEAL"]["description_json_ja"] = [
  "自身と周囲のパーティメンバーのＨＰを全回復し、さらに蘇生する。",
];
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_de"] =
  "Du führst eine physische Attacke aus.\\n\\nAttacke-Wert: 9000";
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_en"] =
  "Delivers an attack with a potency of 9,000.";
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_fr"] =
  'Effectue une attaque physique sur la cible.\n\n<span style="color:#ffff66;">Puissance:</span> 9000';
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_ja"] =
  "対象に物理攻撃。　威力：9000";
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_json_de"] = [
  "Du führst eine physische Attacke aus.\\n\\nAttacke-Wert: 9000",
];
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_json_en"] = [
  "Delivers an attack with a potency of 9,000.",
];
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_json_fr"] = [
  'Effectue une attaque physique sur la cible.\n\n<span style="color:#ffff66;">Puissance:</span> 9000',
];
LIMITBREAKACTIONSDATA[3]["MELEE"]["description_json_ja"] = [
  "対象に物理攻撃。　威力：9000",
];
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_de"] =
  "Du führst eine elementneutrale physische Attacke auf alle Gegner um den Einschlagort aus.\\n\\nAttacke-Wert: 6150";
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_en"] =
  "Deals unaspected damage with a potency of 6,150 to all enemies near point of impact.";
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_fr"] =
  'Effectue une attaque physique neutre dans l\'aire ciblée.\\n\\n<span style="color:#ffff66;">Puissance:</span> 6150';
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_ja"] =
  "指定した地面の周囲に無属性の魔法攻撃。　威力：6150";
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_json_de"] = [
  "Du führst eine elementneutrale magische Attacke auf alle Gegner um den Einschlagort aus.\\n\\nAttacke-Wert: 6150",
];
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_json_en"] = [
  "Deals unaspected damage with a potency of 6,150 to all enemies near point of impact.",
];
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_json_fr"] = [
  'Effectue une attaque physique neutre dans l\'aire ciblée.\\n\\n<span style="color:#ffff66;">Puissance:</span> 6150',
];
LIMITBREAKACTIONSDATA[3]["PHYSICALRANGE"]["description_json_ja"] = [
  "指定した地面の周囲に無属性の魔法攻撃。　威力：6150",
];
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_de"] =
  "Du führst eine elementneutrale magische Attacke auf alle Gegner um den Einschlagort aus.\\n\\nAttacke-Wert: 6150";
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_en"] =
  "Deals unaspected damage with a potency of 6,150 to all enemies near point of impact.";
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_fr"] =
  'Effectue une attaque magique neutre dans l\'aire ciblée.\\n\\n<span style="color:#ffff66;">Puissance:</span> 6150';
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_ja"] =
  "指定した地面の周囲に無属性の魔法攻撃。　威力：6150";
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_json_de"] = [
  "Du führst eine elementneutrale magische Attacke auf alle Gegner um den Einschlagort aus.\\n\\nAttacke-Wert: 6150",
];
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_json_en"] = [
  "Deals unaspected damage with a potency of 6,150 to all enemies near point of impact.",
];
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_json_fr"] = [
  'Effectue une attaque magique neutre dans l\'aire ciblée.\\n\\n<span style="color:#ffff66;">Puissance:</span> 6150',
];
LIMITBREAKACTIONSDATA[3]["MAGICALRANGE"]["description_json_ja"] = [
  "指定した地面の周囲に無属性の魔法攻撃。　威力：6150",
];

function isTankLB(actionId) {
  return TANKLIMITBREAKACTIONIDS.includes(actionId);
}

function isHealLB(actionId) {
  return HEALLIMITBREAKACTIONIDS.includes(actionId);
}

function isMeleeLB(actionId) {
  return MELEELIMITBREAKACTIONIDS.includes(actionId);
}

function isPhysicalLB(actionId) {
  return PHYSICALRANGELIMITBREAKACTIONIDS.includes(actionId);
}

function isMagicalLB(actionId) {
  return MAGICALRANGELIMITBREAKACTIONIDS.includes(actionId);
}

function replaceMissingDescriptions(originalData) {
  const actionId = originalData["id"];
  let key;
  if (isTankLB(actionId)) {
    key = "TANK";
  } else if (isHealLB(actionId)) {
    key = "HEAL";
  } else if (isMeleeLB(actionId)) {
    key = "MELEE";
  } else if (isPhysicalLB(actionId)) {
    key = "PHYSICALRANGE";
  } else if (isMagicalLB(actionId)) {
    key = "MAGICALRANGE";
  }
  originalData["description_de"] =
    LIMITBREAKACTIONSDATA[3][key]["description_de"];
  originalData["description_en"] =
    LIMITBREAKACTIONSDATA[3][key]["description_en"];
  originalData["description_fr"] =
    LIMITBREAKACTIONSDATA[3][key]["description_fr"];
  originalData["description_ja"] =
    LIMITBREAKACTIONSDATA[3][key]["description_ja"];
  originalData["description_json_de"] =
    LIMITBREAKACTIONSDATA[3][key]["description_json_de"];
  originalData["description_json_en"] =
    LIMITBREAKACTIONSDATA[3][key]["description_json_en"];
  originalData["description_json_fr"] =
    LIMITBREAKACTIONSDATA[3][key]["description_json_fr"];
  originalData["description_json_ja"] =
    LIMITBREAKACTIONSDATA[3][key]["description_json_ja"];
}

/**
 *
 * @param {Number} actionId The categoryId to get the actions for
 * @returns {Promise<object>}
 */
async function getActionData(actionId) {
  return getXIVAPIData("Action", actionId);
}

function stripActionData(originalData) {
  if (
    originalData["class_job_target_id"] === "-1" &&
    import.meta.env.VITE_APP_DEBUG_VERBOSE === "true"
  ) {
    console.error("maybe unused action found");
    console.log(originalData);
  }

  if (LIMITBREAKACTIONIDS.includes(originalData["id"])) {
    replaceMissingDescriptions(originalData);
  }
  return {
    id: originalData["id"],
    action_category_name_de: originalData["action_category"]["name_de"],
    action_category_name_en: originalData["action_category"]["name_en"],
    action_category_name_fr: originalData["action_category"]["name_fr"],
    action_category_name_ja: originalData["action_category"]["name_ja"],
    class_job_level: originalData["class_job_level"],
    cooldown_group: originalData["cooldown_group"],
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
    class_job_category: originalData["class_job_category"],
  };
}

export { getActionData, stripActionData };
