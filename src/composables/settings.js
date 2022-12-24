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

export function getCharacterLevel() {
  return useFFXIVAdvancedRotationsStore().settings.characterLevel >> 0;
}

export function setCharacterLevel(newLevel) {
  useFFXIVAdvancedRotationsStore().settings.characterLevel = newLevel;
}

export function getRemoveNotLearnedActions() {
  return useFFXIVAdvancedRotationsStore().settings.removeNotLearnedActions;
}
