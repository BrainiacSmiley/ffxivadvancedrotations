import {
  getDoWDoMJobIds,
  getTankJobIds,
  getHealerJobIds,
  getMeleeJobIds,
  getPhysicalRangeJobIds,
  getMagicalRangeJobIds,
} from "@/js/ffxiv/ffxivhelper";
import { FFXIVJobCategories } from "@/js/ffxiv/ffxivconfigs";
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivdata";

function getAllJobsData() {
  const allJobIds = getDoWDoMJobIds();
  const allJobData = [];
  allJobIds.forEach((jobId) => {
    allJobData.push(getJobData(jobId));
  });

  return Promise.all(allJobData);
}

function getAllMenuData() {
  return [
    {
      id: "tanks",
      name: FFXIVJobCategories.tanks,
      icon: "https://xivapi.com/cj/misc/clear_tank.png",
      jobIds: getTankJobIds(),
    },
    {
      id: "healer",
      name: FFXIVJobCategories.healer,
      icon: "https://xivapi.com/cj/misc/clear_healer.png",
      jobIds: getHealerJobIds(),
    },
    {
      id: "mdps",
      name: FFXIVJobCategories.mdps,
      icon: "https://xivapi.com/cj/misc/clear_dps.png",
      jobIds: getMeleeJobIds(),
    },
    {
      id: "prdps",
      name: FFXIVJobCategories.prdps,
      icon: "https://xivapi.com/cj/misc/clear_ranged.png",
      jobIds: getPhysicalRangeJobIds(),
    },
    {
      id: "mrdps",
      name: FFXIVJobCategories.mrdps,
      icon: "https://xivapi.com/cj/misc/clear_dps_magic.png",
      jobIds: getMagicalRangeJobIds(),
    },
  ];
}

export { getAllJobsData, getAllMenuData };
