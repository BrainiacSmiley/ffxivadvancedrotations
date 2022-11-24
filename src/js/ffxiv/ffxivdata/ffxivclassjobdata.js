import { getXIVAPIData } from "@/js/ffxiv/ffxivdata/ffxivdata";
import { capitalizeFirstLetter, capitalizeEveryFirstLetter } from "@/js/helper";

/**
 * @param {Number} jobId The id of the job you want the data for
 * @return {Promise}
 */
async function getJobData(jobId) {
  return getXIVAPIData("ClassJob", jobId);
}

function stripJobData(originalData) {
  const iconName = originalData.name_en.replace(/\s+/g, "");
  const nameEn = capitalizeEveryFirstLetter(originalData.name_en);
  const nameFr = capitalizeFirstLetter(originalData.name_fr);

  return {
    id: originalData.id,
    icon: `https://xivapi.com/cj/companion/${iconName}.png`,
    name_de: originalData.name_de,
    name_en: nameEn,
    name_fr: nameFr,
    name_ja: originalData.name_ja,
  };
}

export { getJobData, stripJobData };
