<template>
  <JobActionsGroup
    :key="group.id"
    :id="group.id"
    :category-name="group.categoryName"
    :ids="group.ids"
    v-for="group in actionGroups"
  ></JobActionsGroup>
</template>

<script>
import { removeActionsThatSwapThroughLevelUp } from "@/js/ffxiv/ffxivdata/ffxivactiongroups";
import { getJobActionsForCategoryId } from "@/js/ffxiv/ffxivdata/ffxivclassjobcategorydata";
import { getJobCategoryIds } from "@/js/ffxiv/ffxivjobcategoriyids";
import JobActionsGroup from "@/components/jobActions/JobActionsGroup.vue";
import { ref } from "vue";
import {
  getRemoveNotLearnedActions,
  getReplaceLeveledUpActions,
} from "@/composables/settings";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import {
  removeIgnoredJobActions,
  removeNotLearnedJobActions,
  sortActionIds,
  splitJobActionsIntoGeneralAndSpecialGroup,
} from "@/js/ffxiv/ffxivjobactions";

export default {
  async setup(props) {
    async function convertGroupIdsIntoActionsOrItemsIds(actionGroups) {
      for (const actionGroup of actionGroups) {
        if (typeof actionGroup.ids.jobCategoryIds !== "object") {
          continue;
        }

        let actionIds = [];
        for (const categoryId of actionGroup.ids.jobCategoryIds) {
          const actionIdsFromCategory = await getJobActionsForCategoryId(
            categoryId
          );
          actionIds = [...actionIds, ...actionIdsFromCategory];
        }
        delete actionGroup.ids.jobCategoryIds;
        removeIgnoredJobActions(props.jobId, actionIds);
        actionGroup.ids.actionIds = [...actionIds].filter(Boolean);
        actionGroups[actionGroups.indexOf(actionGroup)] = actionGroup;
      }
      return actionGroups;
    }

    async function loadActionGroups(jobId) {
      let actionGroups = getJobCategoryIds(jobId);
      actionGroups = await convertGroupIdsIntoActionsOrItemsIds(actionGroups);
      if (getReplaceLeveledUpActions()) {
        actionGroups = await removeActionsThatSwapThroughLevelUp(
          actionGroups,
          jobId
        );
      }
      const splittedJobGroup = splitJobActionsIntoGeneralAndSpecialGroup(
        actionGroups[0],
        jobId
      );
      actionGroups.splice(0, 1);
      actionGroups = [].concat(splittedJobGroup, actionGroups);
      if (getRemoveNotLearnedActions()) {
        await removeNotLearnedJobActions(actionGroups);
      }
      await sortActionIds(actionGroups);
      return actionGroups;
    }

    return {
      actionGroups: ref(await loadActionGroups(props.jobId)),
      loadActionGroups,
    };
  },
  props: {
    jobId: { type: Number, required: true },
  },
  name: "JobActionsGroups",
  components: {
    JobActionsGroup,
  },
  data() {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
  mounted() {
    this.setTooltipGridColumnSpan();
  },
  methods: {
    setTooltipGridColumnSpan() {
      const numberOfGridRows =
        document.getElementsByClassName("groupOfActions").length;
      document.getElementsByClassName("actionTooltip")[0].style[
        "grid-row"
      ] = `1 / span ${numberOfGridRows - 1}`;
    },
    async reloadActionGroups(newJobId) {
      const actionGroups = await this.loadActionGroups(newJobId);
      this.actionGroups = null;
      setTimeout(() => {
        this.actionGroups = actionGroups;
        this.$nextTick(() => {
          this.setTooltipGridColumnSpan();
        });
      }, 0);
    },
  },
  watch: {
    async jobId(newJobId) {
      await this.reloadActionGroups(newJobId);
    },
    "ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions":
      async function () {
        await this.reloadActionGroups(this.jobId);
      },
    "ffxivAdvancedRotationsStore.settings.sortActionsByAcquiredLevel":
      async function () {
        await this.reloadActionGroups(this.jobId);
      },
    "ffxivAdvancedRotationsStore.settings.removeNotLearnedActions":
      async function () {
        await this.reloadActionGroups(this.jobId);
      },
    "ffxivAdvancedRotationsStore.settings.characterLevel": async function () {
      if (getRemoveNotLearnedActions()) {
        await this.reloadActionGroups(this.jobId);
      }
    },
  },
};
</script>

<style scoped></style>
