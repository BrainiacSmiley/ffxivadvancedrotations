import {
  getDoWDoMJobIds,
  getTankJobIds,
  getHealerJobIds,
  getMeleeJobIds,
  getPhysicalRangeJobIds,
  getMagicalRangeJobIds,
} from "@/js/ffxiv/ffxivhelper";
import { FFXIVJobCategories } from "@/js/ffxiv/ffxivconfigs";
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { getCharacterLevel } from "@/composables/settings";

function getAllJobsData() {
  const allJobIds = getDoWDoMJobIds();
  const allJobData = [];
  allJobIds.forEach((jobId) => {
    allJobData.push(getJobData(jobId));
  });

  return Promise.all(allJobData);
}

function getAllMenuData() {
  const actualLevel = getCharacterLevel();
  const tankLevel = [actualLevel, actualLevel, actualLevel, actualLevel];
  const healLevel = [actualLevel, actualLevel, actualLevel, actualLevel];
  const meleeLevel = [
    actualLevel,
    actualLevel,
    actualLevel,
    actualLevel,
    actualLevel,
  ];
  const pRangeLevel = [actualLevel, actualLevel, actualLevel];
  const mRangeLevel = [actualLevel, actualLevel, actualLevel];
  return [
    {
      id: "tanks",
      name: FFXIVJobCategories.tanks,
      icon: "https://xivapi.com/cj/misc/clear_tank.png",
      jobIds: getTankJobIds(tankLevel),
    },
    {
      id: "healer",
      name: FFXIVJobCategories.healer,
      icon: "https://xivapi.com/cj/misc/clear_healer.png",
      jobIds: getHealerJobIds(healLevel),
    },
    {
      id: "mdps",
      name: FFXIVJobCategories.mdps,
      icon: "https://xivapi.com/cj/misc/clear_dps.png",
      jobIds: getMeleeJobIds(meleeLevel),
    },
    {
      id: "prdps",
      name: FFXIVJobCategories.prdps,
      icon: "https://xivapi.com/cj/misc/clear_ranged.png",
      jobIds: getPhysicalRangeJobIds(pRangeLevel),
    },
    {
      id: "mrdps",
      name: FFXIVJobCategories.mrdps,
      icon: "https://xivapi.com/cj/misc/clear_dps_magic.png",
      jobIds: getMagicalRangeJobIds(mRangeLevel),
    },
  ];
}

export { getAllJobsData, getAllMenuData };
