<template>
  <div class="loadingActionsIndicatorBackground" v-show="jobActionsNotLoaded">
    <div class="loadingIndicatorIcon"></div>
    <div class="loadingIndicatorText">{{ $t("loadingActionData") }}</div>
  </div>
  <header class="jobActionsHeader">
    <div class="jobActionsIcon" :style="selectedJobIcon"></div>
    <div class="jobActionsName">{{ name }}</div>
  </header>
  <div class="jobRotation">
    <fieldset class="actionGroup">
      <legend>{{ $t("rotation") }}</legend>
    </fieldset>
  </div>
  <footer class="jobActionsOverview">
    <div class="actionGroups">
      <action-group
        :category-name="group.categoryName"
        :actions="group.actions"
        v-for="group in actionGroups"
        :key="group.id"
      ></action-group>
    </div>
    <div class="actionTooltip" :style="isJobActionSelected">
      <div>
        <div class="actionIcon" :style="selectedActionIcon"></div>
        <div class="actionName">{{ selectedActionName }}</div>
        <div class="actionCategory">
          <span style="color: #b6b09a">{{ selectedActionCategory }}</span>
          {{ selectedActionId }}
        </div>
        <div class="actionRange">
          <span style="color: gray; margin-right: 5px">{{ $t("range") }}</span>
          <span>{{ selectedActionRange }}</span>
        </div>
        <div class="actionRadius">
          <span style="color: gray; margin-right: 5px">{{ $t("radius") }}</span>
          <span>{{ selectedActionRadius }}</span>
        </div>
        <div class="actionCast" :style="selectedActionCastVisible">
          <div style="color: #b6b09a; font-size: 13px; text-align: right">
            {{ $t("cast") }}
          </div>
          <div style="text-align: right">{{ selectedActionCasttime }}</div>
          <div
            style="
              height: 5px;
              width: 135px;
              background-color: gray;
              border-radius: 2px;
              margin-top: -5px;
            "
          ></div>
        </div>
        <div class="actionRecast" :style="selectedActionRecastVisible">
          <div style="color: #b6b09a; font-size: 13px; text-align: right">
            {{ $t("recast") }}
          </div>
          <div style="text-align: right">{{ selectedActionRecasttime }}</div>
          <div
            style="
              height: 5px;
              width: 135px;
              background-color: gray;
              border-radius: 2px;
              margin-top: -5px;
            "
          ></div>
        </div>
        <div class="actionCost" :style="selectedActionCostVisible">
          <div style="color: #b6b09a; font-size: 13px; text-align: right">
            {{ selectedActionCostsType }}
          </div>
          <div style="text-align: right">{{ selectedActionCosts }}</div>
          <div
            style="
              height: 5px;
              width: 135px;
              background-color: gray;
              border-radius: 2px;
              margin-top: -5px;
            "
          ></div>
        </div>
      </div>
      <div class="actionDescription" v-html="selectedActionDescription"></div>
      <div class="actionAcquired">
        <div style="display: inline-block; width: 100px; color: #b6b09a">
          {{ $t("acquired") }}
        </div>
        <span style="color: #5a7744">{{ selectedActionAcquiredLvl }}</span>
      </div>
      <!--<div class="actionAffinity">
        <span style="flex:1;width:100px;color:#b6b09a;">{{ $t('affinity') }}</span>
        <span style="flex:1;margin-left:-229px;}">{{ selectedActionAffinity }}</span>
      </div>-->
    </div>
  </footer>
</template>

<script>
import {
  getJobActions,
  getJobActionsToReplaceThroughLevel,
} from "@/js/ffxiv/ffxivjobactions";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";

export default {
  name: "job-actions",
  props: {
    locale: String,
    jobId: Number,
  },
  data() {
    return {
      id: "",
      actionGroups: [],
      actualSelectedActionId: null,
      allJobActions: {},
      jobActionsNotLoaded: true,
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
      actualJobData: {},
    };
  },
  computed: {
    name() {
      return this.actualJobData[`name_${this.$parent.$i18n.locale}`];
    },
    selectedJobIcon() {
      return { backgroundImage: `url(${this.actualJobData.icon})` };
    },
    isJobActionSelected() {
      if (
        this.actualSelectedActionId &&
        typeof this.actualSelectedActionId !== "undefined"
      ) {
        return { visibility: "visible" };
      } else {
        return { visibility: "hidden" };
      }
    },
    selectedActionIcon() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      return { backgroundImage: `url(${data["icon"]})` };
    },
    selectedActionName() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      return data[`name_${this.$parent.$i18n.locale}`];
    },
    selectedActionId() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null || process.env.VUE_APP_DEBUG_VERBOSE === "false") {
        return "";
      }
      return ` [${data["id"]}]`;
    },
    selectedActionCategory() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      const actionCategory = data["action_category"];
      if (actionCategory === 2) {
        return this.$t("categorySpell");
      } else if (actionCategory === 3) {
        return this.$t("categoryWeaponSkill");
      } else if (actionCategory === 4) {
        return this.$t("categoryAbility");
      } else {
        const errorText = `undefined action_category: ${actionCategory}`;
        console.log(errorText);
        return new Error(errorText);
      }
    },
    selectedActionRange() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      let range = data["range"];
      if (range === "-1") {
        range = "3";
      }
      return `${range}y`;
    },
    selectedActionRadius() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      return `${data["radius"]}y`;
    },
    selectedActionCastVisible() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      if (
        data["cast100ms"] > 0 &&
        this.actualSelectedActionId &&
        typeof this.actualSelectedActionId !== "undefined"
      ) {
        return "visibility:visible";
      } else {
        return "visibility:hidden";
      }
    },
    selectedActionCasttime() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      let castTime = data["cast100ms"];
      if (castTime === 0) {
        return this.$t("castTimeInstant");
      } else {
        castTime = this.roundNumberToTwoDigits(castTime);
      }
      return `${castTime}s`;
    },
    selectedActionRecastVisible() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      if (
        data["recast100ms"] > 0 &&
        this.actualSelectedActionId &&
        typeof this.actualSelectedActionId !== "undefined"
      ) {
        return { visibility: "visible" };
      } else {
        return { visibility: "hidden" };
      }
    },
    selectedActionRecasttime() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      const recastTime = this.roundNumberToTwoDigits(data["recast100ms"] / 10);
      return `${recastTime}s`;
    },
    selectedActionCostVisible() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      if (
        data["cost"] > 0 &&
        this.actualSelectedActionId &&
        typeof this.actualSelectedActionId !== "undefined"
      ) {
        if (data["costType"] === 3) {
          return { visibility: "visible" };
        }
      }
      return { visibility: "hidden" };
    },
    selectedActionCostsType() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      const costType = data["costType"];
      const costTypesToIgnore = [2, 4, 10, 57, 58, 70, 71, 76]; //Spell Effects to be Consumed
      const errorText = `Undefined costType: ${costType} for actionId: ${data["id"]}`;
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
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }

      let cost = data["cost"];
      if (this.jobId === FFXIVJobIds.PLD) {
        cost *= 50;
      } else if (
        FFXIVJobIds.isHealer(this.jobId) ||
        FFXIVJobIds.isMagicalRanged(this.jobId)
      ) {
        cost *= 100;
      }
      return cost;
    },
    selectedActionDescription() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      return data[`description_${this.$parent.$i18n.locale}`];
    },
    selectedActionAcquiredLvl() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      return `Lv. ${data["class_job_level"]}`;
    },
    selectedActionAffinity() {
      const data = this.getActionData(this.actualSelectedActionId);
      if (data === null) {
        return "";
      }
      return data["affinity"];
    },
  },
  created() {
    this.loadJobActions(this.jobId);
  },
  methods: {
    /**
     * Returns the data for the action with the provided id
     * @param {Number} actionId The actionId you want the data for
     * @return {Error|object} The data for the action
     */
    getActionData(actionId) {
      if (actionId === null) {
        return null;
      }
      if (typeof this.allJobActions[actionId] === "undefined") {
        return new Error(`no data found for actionID:${actionId}`);
      }

      return this.allJobActions[actionId];
    },
    /**
     * Formats a number to a configurable numb
     * @param {Number} value The value to format
     * @param {Number} decimalPlaces The number of digits to format to
     * @return {string} The formatted number with given number of digits
     */
    roundNumberToTwoDigits(value, decimalPlaces = 2) {
      return Number(
        Math.round(parseFloat(value + "e" + decimalPlaces)) +
          "e-" +
          decimalPlaces
      ).toFixed(decimalPlaces);
    },
    /**
     * loads the jobActions for the given jobId
     * @param {Number} jobId The jobId to get the actions for
     */
    loadJobActions(jobId) {
      this.jobActionsNotLoaded = true;
      if (typeof jobId === "undefined") {
        return;
      }

      if (typeof this.$parent.$parent["jobsData"][jobId] === "undefined") {
        this.$router["push"]("/");
        return;
      }

      this.actualJobData = this.$parent.$parent["jobsData"][jobId];
      this.id = jobId;
      this.ffxivAdvancedRotationsStore.selectedUIElements.jobId = jobId;

      const jobActions = getJobActions(jobId);
      jobActions.then((jobActionsResult) => {
        for (const group of jobActionsResult) {
          for (const [id, action] of Object.entries(group.actions)) {
            this.allJobActions[id] = action;
          }
        }
        this.actionGroups = this.removeJobsThatSwapThroughLevelUp(
          jobActionsResult,
          jobId
        );
        this.jobActionsNotLoaded = false;
      });
    },
    /**
     *
     * @param {array} allActionGroups The groups to remove the actions from
     * @param {Number} jobId The jobId we want tot remove the actions for
     * @returns {array}
     */
    removeJobsThatSwapThroughLevelUp(allActionGroups, jobId) {
      if (!this.ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions) {
        return allActionGroups;
      }

      const actionIdsToRemove = this.getActionIdsToRemove(jobId);
      for (const actionGroup of allActionGroups) {
        for (const [key, action] of Object.entries(actionGroup.actions)) {
          if (actionIdsToRemove.includes(action.id)) {
            delete actionGroup.actions[key];
          }
        }
      }
      return allActionGroups;
    },
    getActionIdsToRemove(jobId) {
      const possibleReplacedActions = getJobActionsToReplaceThroughLevel(jobId);
      const actionIdsToReplace = [];
      if (possibleReplacedActions === null) {
        return actionIdsToReplace;
      }

      let highestSpellFromGroupFound = false;
      for (const actionGroup of possibleReplacedActions) {
        highestSpellFromGroupFound = false;

        for (const actionId of actionGroup) {
          if (highestSpellFromGroupFound) {
            actionIdsToReplace.push(actionId);
            continue;
          }

          if (this.allJobActions[actionId].level > FFXIVMAXLVL) {
            actionIdsToReplace.push(actionId);
          } else {
            highestSpellFromGroupFound = true;
          }
        }
      }
      return actionIdsToReplace;
    },
  },
  watch: {
    jobId(newId) {
      this.loadJobActions(newId);
    },
    "ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions":
      function () {
        this.loadJobActions(this.id);
      },
  },
};
</script>

<style scoped>
.jobActionsHeader {
  margin: auto;
  width: 340px;
  display: block;
}

.jobActionsIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
}

.jobActionsName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 36px;
  vertical-align: top;
  margin-top: 4px;
}

.jobActionsOverview {
  margin: auto;
}

.actionTooltip {
  width: 440px;
  border: 2px solid gray;
  margin: auto;
  position: relative;
  color: white;
  display: inline-block;
  bottom: -5px;
  left: 0;
  border-radius: 5px;
}

.actionIcon {
  width: 80px;
  height: 80px;
  position: absolute;
  top: -5px;
  left: -5px;
  transform: scale(0.6);
}

.actionName {
  position: absolute;
  top: 10px;
  left: 65px;
  font-size: 20px;
  color: #e2e2e2;
}

.actionCategory {
  position: absolute;
  top: 40px;
  left: 65px;
}

.actionRange {
  position: absolute;
  top: 40px;
  left: 200px;
}

.actionRadius {
  position: absolute;
  top: 40px;
  left: 320px;
}

.actionCast {
  position: absolute;
  top: 70px;
  left: 10px;
}

.actionRecast {
  position: absolute;
  top: 70px;
  left: 152px;
}

.actionCost {
  position: absolute;
  top: 70px;
  left: 295px;
}

.actionDescription {
  margin-top: 115px;
  margin-left: 10px;
}

.actionAcquired {
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
}

.actionAffinity {
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
}

.actionGroups {
  width: 1500px;
  display: inline-block;
}

.jobRotation {
  width: 1944px;
  height: 750px;
  margin: auto;
}

.loadingActionsIndicatorBackground {
  background-color: black;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100000;
}

legend {
  color: lightgray;
  font-size: 32px;
  border-radius: 5px;
  width: auto;
  margin-left: 10px;
}

.actionGroup {
  border-radius: 5px;
  border: 2px solid gray;
  padding: revert;
}
</style>
