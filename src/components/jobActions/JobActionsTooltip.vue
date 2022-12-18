<template>
  <div class="actionTooltip" :style="isJobActionSelected">
    <div class="actionIconTooltip">
      <div class="actionIconTooltipIcon" :style="selectedActionIcon"></div>
      <div class="actionIconTooltipHQOverlay" :style="isHQOverlayVisible"></div>
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
        <div class="actionCastRecastCostBar"></div>
      </div>
    </div>
    <div class="actionItemEffect" v-if="this.type === 'item'">
      <span style="color: gray">{{ $t("itemEffects") }}</span>
      <div style="margin-left: 10px" v-html="selectedActionItemEffects"></div>
    </div>
    <div class="actionDescription" v-html="selectedActionDescription"></div>
    <div class="actionAcquired" :style="isEntryVisible">
      <div class="selectedActionAcquiredAffinity">{{ $t("acquired") }}</div>
      <span style="color: #5a7744">
        <template v-for="iconURL in getAcquiredIcon" :key="iconURL">
          <div class="selectedActionAcquiredIcon" :style="iconURL"></div>
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

<script>
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

export default {
  name: "JobActionsTooltip",
  data() {
    return {
      data: null,
      type: null,
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
  methods: {
    isItemHQ() {
      return this.type === "item";
    },
    isFood() {
      return (
        typeof this.data["item_category"] !== "undefined" &&
        this.data["item_category"] === 44
      );
    },
    isLimitBreak() {
      return this.data["action_category_name_en"] === "Limit Break";
    },
    isAction() {
      return this.type === "action";
    },
  },
  computed: {
    getAcquiredIcon() {
      if (this.data === null || this.type === "item") {
        return "";
      }

      return getAcquiredIcon(getJobId(), this.data["class_job_category"]);
    },
    isJobActionSelected() {
      if (this.data !== null) {
        return { visibility: "visible" };
      } else {
        return { visibility: "hidden" };
      }
    },
    isEntryVisible() {
      if (this.isAction() && !this.isLimitBreak()) {
        return "visibility:visible";
      } else {
        return "display:none";
      }
    },
    selectedActionIcon() {
      if (this.data === null) {
        return "";
      }

      return { backgroundImage: `url(${this.data["icon"]})` };
    },
    isHQOverlayVisible() {
      if (this.isItemHQ()) {
        return "visibility:visible";
      } else {
        return "display:none";
      }
    },
    selectedActionName() {
      if (this.data === null) {
        return "";
      }

      const locale = getLocale();
      let name = this.data[`name_${locale}`];

      if (this.isItemHQ()) {
        const hqSymbol = "\uE03C";
        name += ` ${hqSymbol}`;
      }
      return name;
    },
    selectedActionId() {
      if (this.data === null || process.env.VUE_APP_DEBUG_VERBOSE === "false") {
        return "";
      }

      return ` [${this.data["id"]}]`;
    },
    selectedActionCategory() {
      if (this.data === null) {
        return "";
      }

      const locale = getLocale();
      if (this.type === "action") {
        return this.data[`action_category_name_${locale}`];
      } else {
        return this.data[`item_category_name_${locale}`];
      }
    },
    selectedActionRange() {
      if (this.data === null) {
        return "";
      }

      let range = this.data["range"];
      if (range === "-1") {
        range = "3";
      }
      return `${range}y`;
    },
    selectedActionRadius() {
      if (this.data === null) {
        return "";
      }

      return `${this.data["radius"]}y`;
    },
    selectedActionCastRecastCostVisible() {
      if (this.data === null) {
        return false;
      }

      return this.isFood() || (this.isAction() && !this.isLimitBreak());
    },
    selectedActionCastVisible() {
      if (this.data === null) {
        return "";
      }

      if (this.type === "item") {
        return "display:none";
      } else if (this.data["cast100ms"] > 0) {
        return "visibility:visible";
      } else {
        return "visibility:hidden";
      }
    },
    selectedActionCasttime() {
      if (this.data === null) {
        return "";
      }

      let castTime = this.data["cast100ms"] / 10;
      if (castTime === 0) {
        return this.$t("castTimeInstant");
      } else {
        castTime = roundNumberToTwoDigits(castTime);
      }
      return `${castTime}${this.$t("s")}`;
    },
    selectedActionRecastVisible() {
      if (this.data === null) {
        return "";
      }

      if (
        (this.type === "action" && this.data["recast100ms"] > 0) ||
        (this.type === "item" && typeof this.data["cooldown"] !== "undefined")
      ) {
        return { visibility: "visible" };
      } else {
        return { visibility: "hidden" };
      }
    },
    selectedActionRecasttime() {
      if (this.data === null) {
        return "";
      }

      let recastTime = 0;
      if (this.type === "action" && this.data["recast100ms"] > 0) {
        recastTime = roundNumberToTwoDigits(this.data["recast100ms"] / 10);
      } else if (
        this.type === "item" &&
        typeof this.data["cooldown"] !== "undefined"
      ) {
        recastTime = this.data["cooldown"];
        if (this.isItemHQ()) {
          recastTime *= 0.9;
        }
        recastTime = secondsToMinutes(recastTime);
        return `${recastTime}`;
      }
      return `${recastTime}${this.$t("s")}`;
    },
    selectedActionCostVisible() {
      if (this.data === null) {
        return "";
      }

      if (this.data["cost"] > 0) {
        if (this.data["costType"] === 3) {
          return { visibility: "visible" };
        }
      }
      return { visibility: "hidden" };
    },
    selectedActionCostsType() {
      if (this.data === null) {
        return "";
      }

      const costType = this.data["costType"];
      const costTypesToIgnore = [2, 4, 10, 11, 57, 58, 70, 71, 76]; //Spell Effects to be Consumed
      const errorText = `Undefined costType: ${costType} for actionId: ${this.data["id"]}`;
      if (costTypesToIgnore.includes(costType)) {
        return "";
      }
      if (costType === 3) {
        return this.$t("costType.MP");
      } else if (costType === 22) {
        return this.$t("costType.BeastGauge");
      } else if (costType === 23) {
        return this.$t("costType.Polyglot");
      } else if (costType === 25) {
        return this.$t("costType.BloodGauge");
      } else if (costType === 27) {
        return this.$t("costType.NinkiGauge");
      } else if (costType === 30) {
        return this.$t("costType.AetherflowGauge");
      } else if (costType === 41) {
        return this.$t("costType.OathGauge");
      } else if (costType === 55) {
        return this.$t("costType.Cartridge");
      } else if (costType === 56) {
        return this.$t("costType.HealingGauge");
      } else if (costType === 68) {
        return this.$t("costType.Addersgall");
      } else if (costType === 69) {
        return this.$t("costType.Addersting");
      } else if (costType === 72) {
        return this.$t("costType.FireAttunement");
      } else if (costType === 73) {
        return this.$t("costType.EarthAttunement");
      } else if (costType === 74) {
        return this.$t("costType.WindAttunement");
      } else if (costType) {
        console.log(errorText);
        return "";
      } else {
        return new Error(errorText);
      }
    },
    selectedActionCosts() {
      if (this.data === null) {
        return "";
      }

      let cost = this.data["cost"];
      if (getJobId() === FFXIVJobIds.PLD) {
        cost *= 50;
      } else if (
        FFXIVJobIds.isHealer(getJobId()) ||
        FFXIVJobIds.isMagicalRanged(getJobId())
      ) {
        cost *= 100;
      }
      return cost;
    },
    selectedActionItemEffects() {
      if (this.data === null || typeof this.data["bonuses"] === "undefined") {
        return "";
      }

      let bonusEffects = "";
      for (const [key, bonus] of Object.entries(this.data["bonuses"])) {
        let bonusPercent = bonus["value"];
        let bonusMax = bonus["max"];
        const maxText = this.$t("MaxEffectText");
        const bonusValue = capitalizeEveryFirstLetter(key.replace("_", " "));
        if (this.isItemHQ()) {
          bonusPercent = bonus["value_hq"];
          bonusMax = bonus["max_hq"];
        }
        bonusEffects += `<div>${bonusValue} +${bonusPercent}% (${maxText} ${bonusMax})</div>`;
      }

      return bonusEffects;
    },
    selectedActionDescription() {
      if (this.data === null) {
        return "";
      }

      const locale = getLocale();
      return this.data[`description_${locale}`];
    },
    selectedActionAcquiredLvl() {
      if (this.data === null) {
        return "";
      }

      return `Lv. ${this.data["class_job_level"]}`;
    },
    selectedActionAffinity() {
      if (this.data === null || this.type === "item") {
        return "";
      }

      const locale = getLocale();
      return this.data["class_job_category"][`name_${locale}`];
    },
  },
  watch: {
    "ffxivAdvancedRotationsStore.selectedUIElements.selectedIdForTooltip.id":
      async function (newId) {
        if (newId === null) {
          this.type = null;
          this.data = null;
          return;
        }

        this.type =
          this.ffxivAdvancedRotationsStore.selectedUIElements.selectedIdForTooltip.type;
        if (this.type === "item") {
          this.data = await getItemData(newId);
        } else if (this.type === "action") {
          this.data = await getActionData(newId);
        }
      },
  },
};
</script>

<style scoped>
.actionTooltip {
  position: relative;
  width: 470px;
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
