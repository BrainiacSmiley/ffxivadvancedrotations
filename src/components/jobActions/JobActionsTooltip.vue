<script setup>
import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { getItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import {
  capitalizeEveryFirstLetter,
  roundNumberToTwoDigits,
  secondsToMinutes,
} from "@/js/helper";
import { getLocale } from "@/i18n";
import { getJobId } from "@/composables/jobId";
import { getAcquiredIcon } from "@/js/ffxiv/ffxivacquiredIcon";
import { parseJSONDescription } from "@/js/ffxiv/ffxivdata/ffxivdatahelper";
import { getCharacterLevel } from "@/composables/settings";
import { computed, onMounted, ref, watch } from "vue";
import _ from "lodash";
import { useI18n } from "vue-i18n";
import { useEventBus } from "@vueuse/core";

const { t } = useI18n();

const type = ref("");
const data = ref({});

function isItemHQ() {
  return type.value === "item";
}
function isAction() {
  return type.value === "action";
}

function isFood() {
  return (
    !hasNoData() &&
    typeof data.value["item_category"] !== "undefined" &&
    data.value["item_category"] === 44
  );
}

function isLimitBreak() {
  if (
    hasNoData() ||
    typeof data.value["action_category_name_en"] === "undefined"
  ) {
    return false;
  }
  return data.value["action_category_name_en"] === "Limit Break";
}

function hasNoData() {
  return Object.entries(data.value).length === 0;
}

const numberOfGridRows = ref(4);
const numberOfGridRowsChanged = useEventBus("numberOfGridRowsChanged");
onMounted(() => {
  numberOfGridRowsChanged.on(setNumberOfGridRows);
});
function setNumberOfGridRows(newNumberOfGridRows) {
  numberOfGridRows.value = newNumberOfGridRows;
}
const visibilityAndGridSpawn = computed(() => {
  const styles = {};
  styles["visibility"] = hasNoData() ? "hidden" : "visible";
  styles["gridRow"] = `4 / span ${numberOfGridRows.value}`;
  return styles;
});

const getAcquiredIcons = computed(() => {
  if (hasNoData() || isItemHQ()) {
    return "";
  }

  return getAcquiredIcon(getJobId(), data.value["class_job_category"]);
});

const isEntryVisible = computed(() => {
  if (isAction() && !isLimitBreak()) {
    return "visibility:visible";
  } else {
    return "display:none";
  }
});

const selectedActionIcon = computed(() => {
  if (hasNoData()) {
    return "";
  } else {
    return { backgroundImage: `url(${data.value["icon"]})` };
  }
});

const isHQOverlayVisible = computed(() => {
  if (isItemHQ()) {
    return "visibility:visible";
  } else {
    return "display:none";
  }
});

const selectedActionName = computed(() => {
  if (hasNoData()) {
    return "";
  }

  const locale = getLocale();
  let name = data.value[`name_${locale}`];

  if (isItemHQ()) {
    const hqSymbol = "\uE03C";
    name += ` ${hqSymbol}`;
  }
  return name;
});

const selectedActionId = computed(() => {
  if (hasNoData() || import.meta.env.VITE_APP_DEBUG_VERBOSE === "false") {
    return "";
  }

  return ` [${data.value["id"]}]`;
});

const selectedActionCategory = computed(() => {
  if (hasNoData()) {
    return "";
  }

  const locale = getLocale();
  const key = isAction()
    ? `action_category_name_${locale}`
    : `item_category_name_${locale}`;
  return data.value[key];
});

const selectedActionRange = computed(() => {
  if (hasNoData()) {
    return "";
  }

  let range = data.value["range"];
  if (range === "-1") {
    range = "3";
  }
  return `${range}y`;
});

const selectedActionRadius = computed(() => {
  if (hasNoData()) {
    return "";
  }

  return `${data.value["radius"]}y`;
});

const selectedActionCastRecastCostVisible = computed(() => {
  if (hasNoData()) {
    return false;
  }

  const noCastRecastCostVisible =
    selectedActionCastVisible.value === "visibility:hidden" &&
    selectedActionRecastVisible.value === "visibility:hidden" &&
    selectedActionCostVisible.value === "visibility:hidden";
  return (
    isFood() || (isAction() && !isLimitBreak() && !noCastRecastCostVisible)
  );
});

const selectedActionCastVisible = computed(() => {
  if (hasNoData()) {
    return "";
  }

  if (isItemHQ()) {
    return "display:none";
  } else if (data.value["cast100ms"] > 0) {
    return "visibility:visible";
  } else {
    return "visibility:hidden";
  }
});

const selectedActionCasttime = computed(() => {
  if (hasNoData()) {
    return "";
  }

  let castTime = data.value["cast100ms"] / 10;
  if (castTime === 0) {
    return t("castTimeInstant");
  } else {
    castTime = roundNumberToTwoDigits(castTime);
  }
  return `${castTime}${t("s")}`;
});

const selectedActionRecastVisible = computed(() => {
  if (hasNoData()) {
    return "";
  }

  if (
    (isAction() && data.value["recast100ms"] > 0) ||
    (isItemHQ() && typeof data.value["cooldown"] !== "undefined")
  ) {
    return "visibility:visible";
  } else {
    return "visibility:hidden";
  }
});

const selectedActionRecasttime = computed(() => {
  if (hasNoData()) {
    return "";
  }

  let recastTime = 0;
  if (isAction() && data.value["recast100ms"] > 0) {
    recastTime = roundNumberToTwoDigits(data.value["recast100ms"] / 10);
  } else if (isItemHQ() && typeof data.value["cooldown"] !== "undefined") {
    recastTime = data.value["cooldown"];
    if (isItemHQ()) {
      recastTime *= 0.9;
    }
    recastTime = secondsToMinutes(recastTime);
    return `${recastTime}`;
  }
  return `${recastTime}${t("s")}`;
});

const selectedActionCostVisible = computed(() => {
  if (hasNoData()) {
    return "";
  }

  if (data.value["cost"] > 0) {
    if (data.value["costType"] === 3) {
      return "visibility:visible";
    }
  }
  return "visibility:hidden";
});

const selectedActionCostsType = computed(() => {
  if (hasNoData()) {
    return "";
  }

  const costType = data.value["costType"];
  const costTypesToIgnore = [
    2, 4, 10, 11, 28, 32, 40, 53, 57, 58, 63, 70, 71, 76, 79, 81, 82, 85, 86,
  ]; //Spell Effects to be Consumed
  const errorText = `Undefined costType: ${costType} for actionId: ${data.value["id"]}`;
  if (costTypesToIgnore.includes(costType)) {
    return "";
  }
  if (costType === 3) {
    return t("costType.MP");
  } else if (costType === 22) {
    return t("costType.BeastGauge");
  } else if (costType === 23) {
    return t("costType.Polyglot");
  } else if (costType === 25) {
    return t("costType.BloodGauge");
  } else if (costType === 27) {
    return t("costType.NinkiGauge");
  } else if (costType === 30) {
    return t("costType.AetherflowGauge");
  } else if (costType === 39) {
    return t("costType.KenkiGauge");
  } else if (costType === 41) {
    return t("costType.OathGauge");
  } else if (costType === 43) {
    return t("costType.BalanceGauge");
  } else if (costType === 54) {
    return t("costType.EspritGauge");
  } else if (costType === 55) {
    return t("costType.Cartridge");
  } else if (costType === 56) {
    return t("costType.HealingGauge");
  } else if (costType === 59) {
    return t("costType.SoulVoiceGauge");
  } else if (costType === 61) {
    return t("costType.HeatGauge");
  } else if (costType === 62) {
    return t("costType.BatteryGauge");
  } else if (costType === 64) {
    return t("costType.SoulGauge");
  } else if (costType === 65) {
    return t("costType.ShroudGauge");
  } else if (costType === 66) {
    return t("costType.LemureShroud");
  } else if (costType === 67) {
    return t("costType.VoidShroud");
  } else if (costType === 68) {
    return t("costType.Addersgall");
  } else if (costType === 69) {
    return t("costType.Addersting");
  } else if (costType === 72) {
    return t("costType.FireAttunement");
  } else if (costType === 73) {
    return t("costType.EarthAttunement");
  } else if (costType === 74) {
    return t("costType.WindAttunement");
  } else if (costType === 75) {
    return t("costType.FirstmindFocus");
  } else if (costType === 78) {
    return t("costType.ManaStack");
  } else if (costType) {
    console.error(errorText);
    return "";
  } else {
    return new Error(errorText);
  }
});

const selectedActionCosts = computed(() => {
  if (hasNoData()) {
    return "";
  }

  let cost = data.value["cost"];
  if (getJobId() === FFXIVJobIds.PLD) {
    cost *= 50;
  } else if (
    FFXIVJobIds.isHealer(getJobId()) ||
    FFXIVJobIds.isMagicalRanged(getJobId())
  ) {
    cost *= 100;
  }
  return cost;
});

const selectedActionItemEffects = computed(() => {
  if (hasNoData() || typeof data.value["bonuses"] === "undefined") {
    return "";
  }

  let bonusEffects = "";
  for (const [key, bonus] of Object.entries(data.value["bonuses"])) {
    let bonusPercent = bonus["value"];
    let bonusMax = bonus["max"];
    const maxText = t("MaxEffectText");
    const bonusValue = capitalizeEveryFirstLetter(key.replace("_", " "));
    if (isItemHQ()) {
      bonusPercent = bonus["value_hq"];
      bonusMax = bonus["max_hq"];
    }
    bonusEffects += `<div>${bonusValue} +${bonusPercent}% (${maxText} ${bonusMax})</div>`;
  }

  return bonusEffects;
});

const selectedActionDescription = computed(() => {
  if (hasNoData()) {
    return "";
  }

  const locale = getLocale();
  return parseJSONDescription(data.value[`description_json_${locale}`], "", {
    class_job_id: getJobId(),
    class_job_level: getCharacterLevel(),
  });
});

const selectedActionAcquiredLvl = computed(() => {
  if (hasNoData()) {
    return "";
  }

  return `Lv. ${data.value["class_job_level"]}`;
});

const selectedActionAffinity = computed(() => {
  if (hasNoData() || isItemHQ()) {
    return "";
  }

  const locale = getLocale();
  return data.value["class_job_category"][`name_${locale}`];
});

const ffxivAdvancedRotationsStore = ref(useFFXIVAdvancedRotationsStore());
watch(
  () => _.cloneDeep(ffxivAdvancedRotationsStore.value),
  async (newValue, oldValue) => {
    if (
      oldValue.selectedUIElements.selectedIdForTooltip.id ===
      newValue.selectedUIElements.selectedIdForTooltip.id
    ) {
      return;
    }

    if (newValue.selectedUIElements.selectedIdForTooltip.id === null) {
      type.value = "";
      data.value = {};
      return;
    }
    type.value = newValue.selectedUIElements.selectedIdForTooltip.type;
    const newId = newValue.selectedUIElements.selectedIdForTooltip.id;
    if (isItemHQ()) {
      getItemData(newId).then((newData) => {
        data.value = newData;
      });
    } else if (isAction()) {
      getActionData(newId).then((newData) => {
        data.value = newData;
      });
    }
  }
);
</script>

<template>
  <div class="actionTooltip" :style="visibilityAndGridSpawn">
    <div class="actionIconTooltip">
      <div class="actionIconTooltipIcon" :style="selectedActionIcon" />
      <div class="actionIconTooltipHQOverlay" :style="isHQOverlayVisible" />
    </div>
    <div class="actionName">{{ selectedActionName }}</div>
    <div class="actionCategory">
      <span style="color: #b6b09a">{{ selectedActionCategory }}</span>
      {{ selectedActionId }}
    </div>
    <div class="actionRangeRadius" :style="isEntryVisible">
      <div>
        <span style="color: gray; margin-right: 5px">{{ $t("range") }}</span>
        <span>{{ selectedActionRange }}</span>
      </div>
      <div>
        <span style="color: gray; margin-right: 5px">{{ $t("radius") }}</span>
        <span>{{ selectedActionRadius }}</span>
      </div>
    </div>
    <div
      class="actionCastRecastCost"
      v-if="selectedActionCastRecastCostVisible"
    >
      <div class="actionCast" :style="selectedActionCastVisible">
        <div class="actionCastRecastCostName">{{ $t("cast") }}</div>
        <div class="actionCastRecastCostValue">
          {{ selectedActionCasttime }}
        </div>
        <div class="actionCastRecastCostBar"></div>
      </div>
      <div class="actionRecast" :style="selectedActionRecastVisible">
        <div class="actionCastRecastCostName">{{ $t("recast") }}</div>
        <div class="actionCastRecastCostValue">
          {{ selectedActionRecasttime }}
        </div>
        <div class="actionCastRecastCostBar"></div>
      </div>
      <div class="actionCost" :style="selectedActionCostVisible">
        <div class="actionCastRecastCostName">
          {{ selectedActionCostsType }}
        </div>
        <div class="actionCastRecastCostValue">{{ selectedActionCosts }}</div>
        <div class="actionCastRecastCostBar" />
      </div>
    </div>
    <div class="actionItemEffect" v-if="isItemHQ()">
      <span style="color: gray">{{ $t("itemEffects") }}</span>
      <div style="margin-left: 10px" v-html="selectedActionItemEffects"></div>
    </div>
    <div class="actionDescription" v-html="selectedActionDescription" />
    <div class="actionAcquired" :style="isEntryVisible">
      <div class="selectedActionAcquiredAffinity">{{ $t("acquired") }}</div>
      <span style="color: #5a7744">
        <template v-for="iconURL in getAcquiredIcons" :key="iconURL">
          <div class="selectedActionAcquiredIcon" :style="iconURL" />
        </template>
        {{ selectedActionAcquiredLvl }}
      </span>
    </div>
    <div class="actionAffinity" :style="isEntryVisible">
      <span class="selectedActionAcquiredAffinity">{{ $t("affinity") }}</span>
      <div class="selectedActionAffinity">{{ selectedActionAffinity }}</div>
    </div>
  </div>
</template>

<style scoped>
.actionTooltip {
  position: relative;
  width: var(--tooltip-width);
  border: 2px solid gray;
  color: white;
  border-radius: 5px;
  padding: 15px;
  grid-column-start: 3;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

.actionIconTooltip {
  width: 80px;
  height: 80px;
  transform: scale(0.9);
  grid-row: 1 / span 2;
  grid-column: 1 / span 2;
  margin-left: -7px;
  margin-top: -7px;
  position: relative;
}

.actionIconTooltipIcon {
  width: 72px;
  height: 72px;
  position: absolute;
  background-size: cover;
}

.actionIconTooltipHQOverlay {
  width: 72px;
  height: 72px;
  position: absolute;
  background-image: url("@/assets/pics/HQOverlay.png");
  background-color: transparent;
  background-size: cover;
}

.actionName {
  font-size: 23px;
  color: #e2e2e2;
  grid-column: 3 / span 7;
  align-self: center;
  display: inline;
  margin-left: -15px;
}

.actionCategory {
  grid-row: 2;
  grid-column: 3 / span 3;
  margin-left: -15px;
}

.actionRangeRadius {
  grid-column: 6 / span 4;
  grid-row-start: 2;
  gap: 20px;
  display: inline-flex;
}

.actionCastRecastCost {
  grid-column: 1 / span 9;
  display: flex;
  gap: 10px;
  max-height: 46px;
}

.actionCastRecastCostName {
  color: rgb(182, 176, 154);
  font-size: 16px;
  text-align: right;
}

.actionCastRecastCostValue {
  font-size: 24px;
  text-align: right;
  font-weight: bold;
  margin-top: -10px;
  margin-bottom: -13px;
}

.actionCastRecastCostBar {
  height: 5px;
  width: 135px;
  background-color: gray;
  border-radius: 2px;
  margin-top: -5px;
}

.actionItemEffect {
  grid-column: 1 / span 9;
  margin-top: 10px;
}

.actionDescription {
  grid-column: 1 / span 9;
  margin-top: 15px;
}

.selectedActionAcquiredIcon {
  width: 26px;
  height: 26px;
  background-size: cover;
  display: inline-block;
  margin-bottom: -8px;
}

.actionAcquired {
  grid-column: 1 / span 9;
}

.actionAffinity {
  grid-column: 1 / span 9;
}

.selectedActionAcquiredAffinity {
  display: inline-block;
  width: 100px;
  color: #b6b09a;
  vertical-align: top;
}

.selectedActionAffinity {
  display: inline-block;
  width: 335px;
}
</style>
