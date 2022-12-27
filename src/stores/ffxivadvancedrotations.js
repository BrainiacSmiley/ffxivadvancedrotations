import { defineStore } from "pinia";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";

export const useFFXIVAdvancedRotationsStore = defineStore({
  id: "ffxivadvancedrotations",
  state: () => ({
    settings: {
      replaceLeveledUpActions: false,
      sortActionsByAcquiredLevel: true,
      removeNotLearnedActions: true,
      characterLevel: FFXIVMAXLVL,
    },
    selectedUIElements: {
      jobId: 0,
      selectedIdForTooltip: {
        id: 0,
        type: null,
      },
    },
  }),
});
