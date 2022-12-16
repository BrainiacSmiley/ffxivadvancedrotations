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
import { getJobActionsForCategoryId } from "@/js/ffxiv/ffxivdata/ffxivclassjobcategorydata";
import { getJobCategoryIds } from "@/js/ffxiv/ffxivjobcategoriyids";
import JobActionsGroup from "@/components/jobActions/JobActionsGroup.vue";
import { ref } from "vue";

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
      actionIds = actionIds.concat(actionIdsFromCategory);
    }
    delete actionGroup.ids.jobCategoryIds;
    actionGroup.ids.actionIds = actionIds;
    actionGroups[actionGroups.indexOf(actionGroup)] = actionGroup;
  }
  return actionGroups;
}

function setTooltipGridColumnSpan() {
  const numberOfGridRows =
    document.getElementsByClassName("groupOfActions").length;
  document.getElementsByClassName("actionTooltip")[0].style[
    "grid-row"
  ] = `1 / span ${numberOfGridRows - 1}`;
}

// noinspection JSUnusedGlobalSymbols
export default {
  async setup(props) {
    let actionGroups = getJobCategoryIds(props.jobId);
    actionGroups = ref(
      await convertGroupIdsIntoActionsOrItemsIds(actionGroups)
    );

    return {
      actionGroups,
    };
  },
  props: {
    jobId: { type: Number, required: true },
  },
  name: "JobActionsGroups",
  components: {
    JobActionsGroup,
  },
  mounted() {
    setTooltipGridColumnSpan();
  },
  watch: {
    jobId(newJobId) {
      let actionGroups = getJobCategoryIds(newJobId);
      convertGroupIdsIntoActionsOrItemsIds(actionGroups).then(
        (actionGroups) => {
          this.actionGroups = actionGroups;
        }
      );
    },
  },
};
</script>

<style scoped></style>
