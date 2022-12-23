import { defineStore } from "pinia";

export const useFFXIVAdvancedRotationsStore = defineStore({
  id: "ffxivadvancedrotations",
  state: () => ({
    settings: {
      replaceLeveledUpActions: true,
      sortActionsByAcquiredLevel: true,
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
