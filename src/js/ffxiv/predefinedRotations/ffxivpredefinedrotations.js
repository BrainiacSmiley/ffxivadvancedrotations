import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";
import { JobRotation } from "@/js/ffxiv/predefinedRotations/JobRotation";

/* icons */
const DPS1_ICON = "i/066000/066101_hr1.png";
const DPS2_ICON = "i/066000/066102_hr1.png";
const DPS3_ICON = "i/066000/066103_hr1.png";
const TANK1_ICON = "i/066000/066121_hr1.png";
const TANK2_ICON = "i/066000/066122_hr1.png";
const TANK3_ICON = "i/066000/066123_hr1.png";
const HEAL1_ICON = "i/066000/066141_hr1.png";
const HEAL2_ICON = "i/066000/066142_hr1.png";
const HEAL3_ICON = "i/066000/066143_hr1.png";

const predefinedRotations = new Map();

const PLD_ROTATIONS = new Map();
const rotation1 = new JobRotation("120s Rotation", TANK1_ICON, FFXIVJobIds.PLD, 90, [{"id":9,"type":"action","position":1},{"id":37840,"type":"item","position":2},{"id":15,"type":"action","position":3},{"id":20,"type":"action","position":4},{"id":3539,"type":"action","position":5},{"id":23,"type":"action","position":6},{"id":7384,"type":"action","position":7},{"id":25747,"type":"action","position":8},{"id":16461,"type":"action","position":9},{"id":3538,"type":"action","position":10},{"id":7383,"type":"action","position":11},{"id":16461,"type":"action","position":12},{"id":16459,"type":"action","position":13},{"id":25748,"type":"action","position":14},{"id":25749,"type":"action","position":15},{"id":25750,"type":"action","position":16},{"id":16460,"type":"action","position":17},{"id":16460,"type":"action","position":18},{"id":16460,"type":"action","position":19},{"id":7384,"type":"action","position":20},{"id":7384,"type":"action","position":21},{"id":7384,"type":"action","position":22},{"id":23,"type":"action","position":23},{"id":9,"type":"action","position":24},{"id":25747,"type":"action","position":25},{"id":15,"type":"action","position":26},{"id":3539,"type":"action","position":27},{"id":16460,"type":"action","position":28},{"id":16460,"type":"action","position":29},{"id":16460,"type":"action","position":30},{"id":7384,"type":"action","position":31}]);
const rotation2 = new JobRotation("60s Rotation", TANK2_ICON, FFXIVJobIds.PLD, 90, []);
PLD_ROTATIONS.set("rotation1", rotation1);
PLD_ROTATIONS.set("rotation2", rotation2);
predefinedRotations.set(FFXIVJobIds.PLD, PLD_ROTATIONS);

function getPredefinedRotations(jobId) {
  const predefinedJobRotations = predefinedRotations.get(jobId);
  if (predefinedJobRotations === undefined) {
    return [];
  }

  return predefinedJobRotations;
}

export { getPredefinedRotations };
