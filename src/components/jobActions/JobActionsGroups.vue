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
import { removeJobsThatSwapThroughLevelUp } from "@/js/ffxiv/ffxivdata/ffxivactiongroups";
import { getJobActionsForCategoryId } from "@/js/ffxiv/ffxivdata/ffxivclassjobcategorydata";
import { getJobCategoryIds } from "@/js/ffxiv/ffxivjobcategoriyids";
import JobActionsGroup from "@/components/jobActions/JobActionsGroup.vue";
import { ref } from "vue";
import {
  getReplaceLeveledUpActions,
  getSortActionsByAcquiredLevel,
} from "@/composables/settings";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import {
  removeIgnoredJobActions,
  sortByAcquiredLvlAscending,
  sortByIdAscending,
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
        actionIds = removeIgnoredJobActions(props.jobId, actionIds);
        if (getSortActionsByAcquiredLevel()) {
          await sortByAcquiredLvlAscending(actionIds);
        } else {
          await sortByIdAscending(actionIds);
        }
        actionGroup.ids.actionIds = [...actionIds].filter(Boolean);
        actionGroups[actionGroups.indexOf(actionGroup)] = actionGroup;
      }
      return actionGroups;
    }

    async function loadActionGroups(jobId) {
      let actionGroups = getJobCategoryIds(jobId);
      actionGroups = await convertGroupIdsIntoActionsOrItemsIds(actionGroups);
      if (getReplaceLeveledUpActions()) {
        actionGroups = await removeJobsThatSwapThroughLevelUp(
          actionGroups,
          jobId
        );
      }
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
      }, 100);
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
  },
};
</script>

<style scoped></style>
