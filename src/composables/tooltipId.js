import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

export function getTooltipId() {
  return useFFXIVAdvancedRotationsStore().selectedUIElements
    .selectedIdForTooltip.id;
}

export function setTooltipId(id, type) {
  useFFXIVAdvancedRotationsStore().selectedUIElements.selectedIdForTooltip.id =
    id;
  useFFXIVAdvancedRotationsStore().selectedUIElements.selectedIdForTooltip.type =
    type;
}
