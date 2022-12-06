<template>
  <div class="jobActions">
    <div class="jobActionsHeader">
      <Suspense>
        <template #default>
          <JobActionsHeader :jobId="jobId"></JobActionsHeader>
        </template>
        <template #fallback>
          <JobActionsHeaderSkeleton></JobActionsHeaderSkeleton>
        </template>
      </Suspense>
    </div>
  </div>
  <!--  <div class="jobRotation">-->
  <!--    <fieldset class="actionGroup" style="min-height: 100px">-->
  <!--      <legend>{{ $t("rotation") }}</legend>-->
  <!--      <draggable-->
  <!--        v-model="jobActionsToDelete"-->
  <!--        :item-key="id"-->
  <!--        :group="{ name: 'actualRotation' }"-->
  <!--        @onStart="onDelete"-->
  <!--        @onAdd="onDelete"-->
  <!--        @onRemove="onDelete"-->
  <!--        @onUpdate="onDelete"-->
  <!--        @onEnd="onDelete"-->
  <!--        @onChoose="onDelete"-->
  <!--        @onUnchoose="onDelete"-->
  <!--        @onSort="onDelete"-->
  <!--        @onFilter="onDelete"-->
  <!--        @onClone="onDelete"-->
  <!--      >-->
  <!--        <template #header>-->
  <!--          <span-->
  <!--            class="material-symbols-outlined deleteRotationIcon"-->
  <!--            v-tooltip="$t('deleteActualRotation')"-->
  <!--            @click="deleteActualRotation"-->
  <!--          >-->
  <!--            delete-->
  <!--          </span>-->
  <!--        </template>-->
  <!--        <template #item="{ element }">-->
  <!--          <RotationActionIcon-->
  <!--            :id="element.id"-->
  <!--            :icon="element.icon"-->
  <!--            :name="element.name"-->
  <!--            :category="element.category"-->
  <!--            :position="element.position"-->
  <!--          ></RotationActionIcon>-->
  <!--        </template>-->
  <!--      </draggable>-->
  <!--      <div class="rotationActions">-->
  <!--        <draggable-->
  <!--          v-model="actualRotation"-->
  <!--          item-key="id"-->
  <!--          :sort="true"-->
  <!--          :group="{ name: 'actualRotation', put: true }"-->
  <!--        >-->
  <!--          <template #item="{ element }">-->
  <!--            <RotationActionIcon-->
  <!--              :id="element.id"-->
  <!--              :icon="element.icon"-->
  <!--              :name="element.name"-->
  <!--              :category="element.category"-->
  <!--            ></RotationActionIcon>-->
  <!--          </template>-->
  <!--        </draggable>-->
  <!--      </div>-->
  <!--    </fieldset>-->
  <!--  </div>-->
  <!--  <footer class="jobActionsOverview">-->
  <!--    <div class="actionGroups">-->
  <!--      <action-group-->
  <!--        :locale="locale"-->
  <!--        :category-name="group.categoryName"-->
  <!--        :actions="group.actions"-->
  <!--        v-for="group in actionGroups"-->
  <!--        :key="group.id"-->
  <!--      ></action-group>-->
  <!--    </div>-->
  <!--  </footer>-->
</template>

<script>
import {
  // getJobActions,
  getJobActionsToReplaceThroughLevel,
} from "@/js/ffxiv/ffxivjobactions";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { FFXIVJobIds } from "@/js/ffxiv/ffxivjobids";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
// import ActionGroup from "@/components/action/ActionGroup.vue";
// import RotationActionIcon from "@/components/action/RotationActionIcon.vue";
import JobActionsHeader from "@/components/jobActions/JobActionsHeader.vue";
import JobActionsHeaderSkeleton from "@/components/jobActions/JobActionsHeaderSkeleton.vue";
// import draggable from "vuedraggable";

export default {
  name: "job-actions",
  components: {
    // ActionGroup,
    // RotationActionIcon,
    JobActionsHeader,
    JobActionsHeaderSkeleton,
    // draggable,
  },
  props: {
    locale: String,
    jobId: Number,
    rotation: String,
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
      actualRotation: [],
      jobActionsToDelete: [],
    };
  },
  computed: {
    name() {
      return this.actualJobData[`name_${this.locale}`];
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
      return data[`name_${this.locale}`];
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
      return data[`description_${this.locale}`];
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
    this.restoreSavedRotation(this.rotation);
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
      console.log(jobId);
      return;
      // this.jobActionsNotLoaded = true;
      // if (typeof jobId === "undefined") {
      //   return;
      // }
      //
      // if (typeof this.$parent.$parent["jobsData"][jobId] === "undefined") {
      //   this.$router["push"]("/");
      //   return;
      // }
      //
      // this.actualJobData = this.$parent.$parent["jobsData"][jobId];
      // this.id = jobId;
      // this.ffxivAdvancedRotationsStore.selectedUIElements.jobId = jobId;
      // this.actualRotation = [];
      // this.savedRotation = [];
      //
      // const jobActions = getJobActions(jobId);
      // jobActions.then((jobActionsResult) => {
      //   for (const group of jobActionsResult) {
      //     for (const [id, action] of Object.entries(group.actions)) {
      //       this.allJobActions[id] = action;
      //     }
      //   }
      //   this.actionGroups = this.removeJobsThatSwapThroughLevelUp(
      //     jobActionsResult,
      //     jobId
      //   );
      //   this.jobActionsNotLoaded = false;
      // });
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
    onDelete(evt) {
      console.log(evt);
      console.log(evt.from);
      // if (event.dataTransfer.getData("source") === "job") {
      //   return;
      // }
      // const actionId = Number.parseInt(
      //   event.dataTransfer.getData("actionId"),
      //   10
      // );
      // const position = Number.parseInt(
      //   event.dataTransfer.getData("position"),
      //   10
      // );
      // this.savedRotation = this.savedRotation.filter((action) => {
      //   return action.id !== actionId && action.position !== position;
      // });
      // this.reorganizeRotationPositions();
    },
    reorganizeRotationPositions() {
      if (this.savedRotation.length === 0) {
        return;
      }

      for (const [index, action] of Object.entries(this.savedRotation)) {
        action.position = Number.parseInt(index, 10) + 1;
      }
    },
    addSavedRotationToURoute() {
      const rotationToSave = [];
      for (const action of this.savedRotation) {
        rotationToSave.push(action.id);
      }
      const serializedSavedRotation = JSON.stringify(rotationToSave);
      const base64SavedRotations = btoa(serializedSavedRotation);
      const currentLocale = this.locale;
      const newURL = `/${currentLocale}/jobActions/${this.jobId}/${base64SavedRotations}`;
      this.$router["push"](newURL);
    },
    restoreSavedRotation(newBase64SavedRotations) {
      if (newBase64SavedRotations === "") {
        return;
      }

      const serializedSavedRotation = atob(newBase64SavedRotations);
      const rotationToRestore = JSON.parse(serializedSavedRotation);
      const restoredRotation = [];
      for (const actionId of rotationToRestore) {
        restoredRotation.push({
          id: actionId,
          position: restoredRotation.length + 1,
        });
      }
      this.savedRotation = restoredRotation;
    },
    deleteActualRotation() {
      this.actualRotation = [];
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
    "ffxivAdvancedRotationsStore.selectedUIElements.actionId": function () {
      this.actualSelectedActionId =
        this.ffxivAdvancedRotationsStore.selectedUIElements.actionId;
    },
    savedRotation: {
      deep: true,
      handler(newRotation) {
        if (newRotation.length === 0) {
          this.actualRotation = [];
        }

        const actualRotation = [];
        for (const action of newRotation) {
          // eslint-disable-next-line vue/no-async-in-computed-properties
          getActionData(action.id).then((actionData) => {
            debugger;
            actualRotation.push({
              id: actionData.id,
              name: actionData[`name_${this.locale}`],
              icon: actionData.icon,
              category: actionData.action_category,
              position: actualRotation.length + 1,
            });
            this.actualRotation = actualRotation;
            this.addSavedRotationToURoute();
          });
        }
      },
    },
  },
};
</script>

<style scoped>
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

.actionIconTooltip {
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
  height: 100%;
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
  position: relative;
}

.rotationActions {
  width: calc(100% - 70px);
  min-height: 50px;
}

.rotationActions > div {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
}

.deleteRotationIcon {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 42px;
}

.deleteRotationIcon:hover {
  color: lightgray;
}
.deleteDropZone {
  height: 100%;
}

div:has(.deleteRotationIcon):not(.jobRotation) {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60px;
}
</style>
