import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";

const FFXIVJobCategoryIds = {
  TANK: [113, 161],
  HEAL: [117, 120],
  MELEE: [114, 118, 161],
  PHYSICALRANGE: [115, 118, 161],
  MAGICALRANGE: [116, 120],
};
FFXIVJobCategoryIds[FFXIVJobIds.GLA] = [38];
FFXIVJobCategoryIds[FFXIVJobIds.PGL] = [41];
FFXIVJobCategoryIds[FFXIVJobIds.MRD] = [44];
FFXIVJobCategoryIds[FFXIVJobIds.LNC] = [47];
FFXIVJobCategoryIds[FFXIVJobIds.ARC] = [50];
FFXIVJobCategoryIds[FFXIVJobIds.CNJ] = [53];
FFXIVJobCategoryIds[FFXIVJobIds.THM] = [55];
FFXIVJobCategoryIds[FFXIVJobIds.PLD] = [38, 20];
FFXIVJobCategoryIds[FFXIVJobIds.MNK] = [41, 21];
FFXIVJobCategoryIds[FFXIVJobIds.WAR] = [44, 22];
FFXIVJobCategoryIds[FFXIVJobIds.DRG] = [47, 23];
FFXIVJobCategoryIds[FFXIVJobIds.BRD] = [50, 24];
FFXIVJobCategoryIds[FFXIVJobIds.WHM] = [53, 25];
FFXIVJobCategoryIds[FFXIVJobIds.BLM] = [55, 26];
FFXIVJobCategoryIds[FFXIVJobIds.ACN] = [68, 69];
FFXIVJobCategoryIds[FFXIVJobIds.SMN] = [68, 69, 28];
FFXIVJobCategoryIds[FFXIVJobIds.SCH] = [68, 29];
FFXIVJobCategoryIds[FFXIVJobIds.ROG] = [93];
FFXIVJobCategoryIds[FFXIVJobIds.NIN] = [93, 92];
FFXIVJobCategoryIds[FFXIVJobIds.MCH] = [96];
FFXIVJobCategoryIds[FFXIVJobIds.DRK] = [98];
FFXIVJobCategoryIds[FFXIVJobIds.AST] = [99];
FFXIVJobCategoryIds[FFXIVJobIds.SAM] = [111];
FFXIVJobCategoryIds[FFXIVJobIds.RDM] = [112];
// FFXIVJobCategoryIds[FFXIVJobIds.BLU] = []
FFXIVJobCategoryIds[FFXIVJobIds.GNB] = [149];
FFXIVJobCategoryIds[FFXIVJobIds.DNC] = [150];
FFXIVJobCategoryIds[FFXIVJobIds.RPR] = [180];
FFXIVJobCategoryIds[FFXIVJobIds.SGE] = [181];

const FFXIVLimitBreakIds = {
  3: {},
};
FFXIVLimitBreakIds[3][FFXIVJobIds.GLA] = [199];
FFXIVLimitBreakIds[3][FFXIVJobIds.PLD] = [199];
FFXIVLimitBreakIds[3][FFXIVJobIds.MRD] = [4240];
FFXIVLimitBreakIds[3][FFXIVJobIds.WAR] = [4240];
FFXIVLimitBreakIds[3][FFXIVJobIds.DRK] = [4241];
FFXIVLimitBreakIds[3][FFXIVJobIds.GNB] = [17105];
FFXIVLimitBreakIds[3][FFXIVJobIds.CNJ] = [208];
FFXIVLimitBreakIds[3][FFXIVJobIds.WHM] = [208];
FFXIVLimitBreakIds[3][FFXIVJobIds.SCH] = [4247];
FFXIVLimitBreakIds[3][FFXIVJobIds.AST] = [4248];
FFXIVLimitBreakIds[3][FFXIVJobIds.SGE] = [24859];
FFXIVLimitBreakIds[3][FFXIVJobIds.PGL] = [202];
FFXIVLimitBreakIds[3][FFXIVJobIds.MNK] = [202];
FFXIVLimitBreakIds[3][FFXIVJobIds.LNC] = [4242];
FFXIVLimitBreakIds[3][FFXIVJobIds.DRG] = [4242];
FFXIVLimitBreakIds[3][FFXIVJobIds.ROG] = [4243];
FFXIVLimitBreakIds[3][FFXIVJobIds.NIN] = [4243];
FFXIVLimitBreakIds[3][FFXIVJobIds.SAM] = [7861];
FFXIVLimitBreakIds[3][FFXIVJobIds.RPR] = [24858];
FFXIVLimitBreakIds[3][FFXIVJobIds.ARC] = [4244];
FFXIVLimitBreakIds[3][FFXIVJobIds.BRD] = [4244];
FFXIVLimitBreakIds[3][FFXIVJobIds.MCH] = [4245];
FFXIVLimitBreakIds[3][FFXIVJobIds.DNC] = [17106];
FFXIVLimitBreakIds[3][FFXIVJobIds.THM] = [205];
FFXIVLimitBreakIds[3][FFXIVJobIds.BLM] = [205];
FFXIVLimitBreakIds[3][FFXIVJobIds.ACN] = [4246];
FFXIVLimitBreakIds[3][FFXIVJobIds.SMN] = [4246];
FFXIVLimitBreakIds[3][FFXIVJobIds.RDM] = [7862];

// FFXIVLimitBreakIds[FFXIVJobIds.BLU] = []

function getJobCategoryIds(jobId) {
  const jobCategoryIds = [
    {
      categoryName: "actionGroupNames.job",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds[jobId],
      },
    },
  ];

  if (FFXIVJobIds.isTank(jobId)) {
    jobCategoryIds.push({
      categoryName: "actionGroupNames.role",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds.TANK,
      },
    });
  }

  if (FFXIVJobIds.isMelee(jobId)) {
    jobCategoryIds.push({
      categoryName: "actionGroupNames.role",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds.MELEE,
      },
    });
  }

  if (FFXIVJobIds.isPhysicalRanged(jobId)) {
    jobCategoryIds.push({
      categoryName: "actionGroupNames.role",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds.PHYSICALRANGE,
      },
    });
  }

  if (FFXIVJobIds.isMagicalRanged(jobId)) {
    jobCategoryIds.push({
      categoryName: "actionGroupNames.role",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds.MAGICALRANGE,
      },
    });
  }

  if (FFXIVJobIds.isHealer(jobId)) {
    jobCategoryIds.push({
      categoryName: "actionGroupNames.role",
      ids: {
        jobCategoryIds: FFXIVJobCategoryIds.HEAL,
      },
    });
  }

  jobCategoryIds.push({
    categoryName: "actionGroupNames.tincture",
    ids: {
      actionIds: FFXIVLimitBreakIds[3][jobId],
      itemIds: [37840, 37841, 37842, 37843, 37844],
    },
  });

  return jobCategoryIds;
}

export { getJobCategoryIds };
