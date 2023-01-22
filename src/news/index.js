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

export default [v090];
