const v092Content = new Map();
v092Content.set("Features", [
  "reworked different resolutions for 1080P and 1440P",
  "predefined Rotations only visible when defined",
]);
// v092Content.set("BugFixes", [""]);
const v092 = new Map();
v092.set("version", "0.9.2");
v092.set("date", new Date("2023-01-29"));
v092.set("content", v092Content);

const v091Content = new Map();
v091Content.set("Features", ["added new PLD rotation"]);
v091Content.set("BugFixes", [
  "delete button is working again",
  "removed unused PLD predefined combo",
  "fixed bug where no rotations could be started",
]);
const v091 = new Map();
v091.set("version", "0.9.1");
v091.set("date", new Date("2023-01-22"));
v091.set("content", v091Content);

const v090Content = new Map();
v090Content.set("Features", [
  "Added all job actions for all jobs stand Patch 6.3",
  "Rotation is saved to url",
  "button to add rotation to clipboard",
  "structure to have predefined rotations for all jobs, still needs to be populated",
  "rotation groups GCDs with OCDs",
]);
v090Content.set("BugFixes", ["fixed position of tooltip in grid"]);
const v090 = new Map();
v090.set("version", "0.9.0");
v090.set("date", new Date("2023-01-22"));
v090.set("content", v090Content);

export default [v092, v091, v090];
