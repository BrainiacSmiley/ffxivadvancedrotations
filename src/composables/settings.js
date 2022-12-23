import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

export function getReplaceLeveledUpActions() {
  return useFFXIVAdvancedRotationsStore().settings.replaceLeveledUpActions;
}

export function setReplaceLeveledUpActions(newState) {
  useFFXIVAdvancedRotationsStore().settings.replaceLeveledUpActions = newState;
}
export function getSortActionsByAcquiredLevel() {
  return useFFXIVAdvancedRotationsStore().settings.sortActionsByAcquiredLevel;
}

export function setSortActionsByAcquiredLevel(newState) {
  useFFXIVAdvancedRotationsStore().settings.sortActionsByAcquiredLevel =
    newState;
}
