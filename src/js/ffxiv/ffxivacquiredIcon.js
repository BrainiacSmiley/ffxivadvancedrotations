const FFXIVACQIREDICONS = {
  gla: "gladiator",
  pgl: "pugilist",
  mrd: "marauder",
  lnc: "lancer",
  arc: "archer",
  cnj: "conjurer",
  thm: "thaumaturge",
  crp: "carpenter",
  bsm: "blacksmith",
  arm: "armorer",
  gsm: "goldsmith",
  ltw: "leatherworker",
  wvr: "weaver",
  alc: "alchemist",
  cul: "culinarian",
  min: "miner",
  btn: "botanist",
  fsh: "fisher",
  pld: "paladin",
  mnk: "monk",
  war: "warrior",
  drg: "dragoon",
  brd: "bard",
  whm: "whitemage",
  blm: "blackmage",
  acn: "arcanist",
  smn: "summoner",
  sch: "scholar",
  rog: "rogue",
  nin: "ninja",
  mch: "machinist",
  drk: "darkknight",
  ast: "astrologian",
  sam: "samurai",
  rdm: "redmage",
  blu: "bluemage",
  gnb: "gunbreaker",
  dnc: "dancer",
  rpr: "reaper",
  sge: "sage",
};

function getAcquiredIcon(jobId, classJobCategory) {
  const acquiredIcons = [];
  let jobName = "";
  let roleName = "";
  const validJobTags = getIncludedJobTags(classJobCategory);

  if (validJobTags.length === 1) {
    jobName = FFXIVACQIREDICONS[validJobTags[0][0]];
    acquiredIcons.push({
      backgroundImage: `url(https://xivapi.com/cj/1/${jobName}.png)`,
    });
  } else if (validJobTags.length === 2) {
    if (jobId === 19) {
      jobName = FFXIVACQIREDICONS["gla"];
    } else if (jobId === 20) {
      jobName = FFXIVACQIREDICONS["pgl"];
    } else if (jobId === 21) {
      jobName = FFXIVACQIREDICONS["mrd"];
    } else if (jobId === 22) {
      jobName = FFXIVACQIREDICONS["lnc"];
    } else if (jobId === 23) {
      jobName = FFXIVACQIREDICONS["arc"];
    } else if (jobId === 24) {
      jobName = FFXIVACQIREDICONS["cnj"];
    } else if (jobId === 25) {
      jobName = FFXIVACQIREDICONS["thm"];
    } else if (jobId === 27 || jobId === 28) {
      jobName = FFXIVACQIREDICONS["acn"];
    } else if (jobId === 90) {
      jobName = FFXIVACQIREDICONS["rog"];
    }
    acquiredIcons.push({
      backgroundImage: `url(https://xivapi.com/cj/1/${jobName}.png)`,
    });
  } else {
    if (isTankRole(classJobCategory)) {
      roleName = "tank";
      acquiredIcons.push({
        backgroundImage: `url(https://xivapi.com/cj/misc/bordered_${roleName}.png)`,
      });
    }
    if (isHealerRole(classJobCategory)) {
      roleName = "healer";
      acquiredIcons.push({
        backgroundImage: `url(https://xivapi.com/cj/misc/bordered_${roleName}.png)`,
      });
    }
    if (isDPSRole(classJobCategory)) {
      roleName = "dps";
      acquiredIcons.push({
        backgroundImage: `url(https://xivapi.com/cj/misc/bordered_${roleName}.png)`,
      });
    }
    if (isDPSRangedRole(classJobCategory)) {
      roleName = "dps_ranged";
      acquiredIcons.push({
        backgroundImage: `url(https://xivapi.com/cj/misc/bordered_${roleName}.png)`,
      });
    }
    if (isDPSMagicRole(classJobCategory)) {
      roleName = "dps_magic";
      acquiredIcons.push({
        backgroundImage: `url(https://xivapi.com/cj/misc/bordered_${roleName}.png)`,
      });
    }
  }
  return acquiredIcons;
}

function getIncludedJobTags(classJobCategory) {
  return Object.entries(classJobCategory).filter(
    (entryToTest) => entryToTest[1] === 1
  );
}

function isTankRole(classJobCategory) {
  return (
    classJobCategory["gla"] === 1 &&
    classJobCategory["pld"] === 1 &&
    classJobCategory["mrd"] === 1 &&
    classJobCategory["war"] === 1 &&
    classJobCategory["drk"] === 1 &&
    classJobCategory["gnb"] === 1
  );
}

function isHealerRole(classJobCategory) {
  return (
    classJobCategory["cnj"] === 1 &&
    classJobCategory["whm"] === 1 &&
    classJobCategory["acn"] === 1 &&
    classJobCategory["sch"] === 1 &&
    classJobCategory["ast"] === 1 &&
    classJobCategory["sge"] === 1
  );
}

function isDPSRole(classJobCategory) {
  return (
    classJobCategory["pgl"] === 1 &&
    classJobCategory["mnk"] === 1 &&
    classJobCategory["lnc"] === 1 &&
    classJobCategory["drg"] === 1 &&
    classJobCategory["rog"] === 1 &&
    classJobCategory["nin"] === 1 &&
    classJobCategory["sam"] === 1 &&
    classJobCategory["rpr"] === 1
  );
}

function isDPSRangedRole(classJobCategory) {
  return (
    classJobCategory["arc"] === 1 &&
    classJobCategory["brd"] === 1 &&
    classJobCategory["mch"] === 1 &&
    classJobCategory["dnc"] === 1
  );
}

function isDPSMagicRole(classJobCategory) {
  return (
    classJobCategory["thm"] === 1 &&
    classJobCategory["blm"] === 1 &&
    classJobCategory["arc"] === 1 &&
    classJobCategory["smn"] === 1 &&
    classJobCategory["rdm"] === 1
  );
}

export { getAcquiredIcon };
