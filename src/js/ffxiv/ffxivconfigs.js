const FFXIVMAXLVL = 90;
const FFXIVVERSION = "6.2.5.1";

const XIVAPI = require("@xivapi/js");
const xiv = new XIVAPI({
  // private_key: '',
  language: "en",
  snake_case: true,
});

const FFXIVJobCategories = {
  tanks: "tankRole",
  healer: "healerRole",
  mdps: "meleeRole",
  prdps: "physicalRangeRole",
  mrdps: "magicalRangeRole",
};

export { FFXIVMAXLVL, FFXIVVERSION, FFXIVJobCategories, xiv };
