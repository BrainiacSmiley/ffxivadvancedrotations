import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

export function getJobId() {
  return useFFXIVAdvancedRotationsStore().selectedUIElements.jobId;
}

export function setJobId(jobId) {
  useFFXIVAdvancedRotationsStore().selectedUIElements.jobId = jobId;
}
