import { defineStore } from "pinia";

export const useFFXIVAdvancedRotationsStore = defineStore({
  id: "ffxivadvancedrotations",
  state: () => ({
    settings: {
      replaceLeveledUpActions: true,
    },
    selectedUIElements: {
      jobId: 0,
    },
  }),
});
