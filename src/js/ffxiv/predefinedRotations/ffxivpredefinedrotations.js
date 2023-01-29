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
const PLDRotation1 = new JobRotation(
  "Opener",
  TANK1_ICON,
  FFXIVJobIds.PLD,
  90,
  [
    { type: "action", id: 9, position: 1 },
    { type: "item", id: 37840, position: 2 },
    { type: "action", id: 15, position: 3 },
    { type: "action", id: 3539, position: 4 },
    { type: "action", id: 20, position: 5 },
    { type: "action", id: 7383, position: 6 },
    { type: "action", id: 3538, position: 7 },
    { type: "action", id: 23, position: 8 },
    { type: "action", id: 25747, position: 9 },
    { type: "action", id: 16459, position: 10 },
    { type: "action", id: 16461, position: 11 },
    { type: "action", id: 25748, position: 12 },
    { type: "action", id: 16461, position: 13 },
    { type: "action", id: 25749, position: 14 },
    { type: "action", id: 25750, position: 15 },
    { type: "action", id: 7384, position: 16 },
    { type: "action", id: 16460, position: 17 },
    { type: "action", id: 16460, position: 18 },
    { type: "action", id: 16460, position: 19 },
  ]
);
const PLDRotation2 = new JobRotation("Burst", TANK2_ICON, FFXIVJobIds.PLD, 90, [
  { type: "action", id: 20, position: 1 },
  { type: "action", id: 7383, position: 2 },
  { type: "action", id: 3538, position: 3 },
  { type: "action", id: 23, position: 4 },
  { type: "action", id: 25747, position: 5 },
  { type: "action", id: 16459, position: 6 },
  { type: "action", id: 16461, position: 7 },
  { type: "action", id: 25748, position: 8 },
  { type: "action", id: 16461, position: 9 },
  { type: "action", id: 25749, position: 10 },
  { type: "action", id: 25750, position: 11 },
]);
PLD_ROTATIONS.set("rotation1", PLDRotation1);
PLD_ROTATIONS.set("rotation2", PLDRotation2);
predefinedRotations.set(FFXIVJobIds.PLD, PLD_ROTATIONS);

function getPredefinedRotations(jobId) {
  const predefinedJobRotations = predefinedRotations.get(jobId);
  if (predefinedJobRotations === undefined) {
    return [];
  }

  return predefinedJobRotations;
}

export { getPredefinedRotations };
