<script setup>
import { removeActionsThatSwapThroughLevelUp } from "@/js/ffxiv/ffxivdata/ffxivactiongroups";
import { getJobActionsForCategoryId } from "@/js/ffxiv/ffxivdata/ffxivclassjobcategorydata";
import { getJobCategoryIds } from "@/js/ffxiv/ffxivjobcategoriyids";
import JobActionsGroup from "@/components/jobActions/JobActionsGroup.vue";
import { ref, toRefs, watch } from "vue";
import {
  getRemoveNotLearnedActions,
  getReplaceLeveledUpActions,
} from "@/composables/settings";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import _ from "lodash";
import {
  removeIgnoredJobActions,
  removeNotLearnedJobActions,
  sortActionIds,
  splitJobActionsIntoGeneralAndSpecialGroup,
} from "@/js/ffxiv/ffxivjobactions";
import { useEventBus } from "@vueuse/core";
import JobActionsGroupSkeleton from "@/components/jobActions/JobActionsGroupSkeleton.vue";

const props = defineProps({
  jobId: { type: Number, required: true },
});

const isLoading = ref(true);

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
  isLoading.value = false;
  return actionGroups;
}

const numberOfGridRowsChanged = useEventBus("numberOfGridRowsChanged");
async function reloadActionGroups(newJobId) {
  isLoading.value = true;
  actionGroups.value = [];
  setTimeout(async () => {
    actionGroups.value = await loadActionGroups(newJobId);
    isLoading.value = false;
    numberOfGridRowsChanged.emit(actionGroups.value.length);
  }, 0);
}

const { jobId } = toRefs(props);
const eventBusJobIdChanged = useEventBus("jobIdChanged");
watch(jobId, async (newJobId, oldJobId) => {
  if (newJobId === oldJobId) {
    return;
  }
  eventBusJobIdChanged.emit(newJobId);
  await reloadActionGroups(jobId.value);
});

const ffxivAdvancedRotationsStore = ref(useFFXIVAdvancedRotationsStore());
watch(
  () => _.cloneDeep(ffxivAdvancedRotationsStore.value),
  async (newValue, oldValue) => {
    if (
      (oldValue.settings.replaceLeveledUpActions ===
        newValue.settings.replaceLeveledUpActions &&
        oldValue.settings.sortActionsByAcquiredLevel ===
          newValue.settings.sortActionsByAcquiredLevel &&
        oldValue.settings.removeNotLearnedActions ===
          newValue.settings.removeNotLearnedActions) ||
      (oldValue.settings.characterLevel !== newValue.settings.characterLevel &&
        getRemoveNotLearnedActions())
    ) {
      return;
    }

    await reloadActionGroups(jobId.value);
  }
);

//data initialization
let actionGroups;
const init = async () => {
  actionGroups = ref(await loadActionGroups(props.jobId));
};
await init();
</script>

<template>
  <template v-if="!isLoading">
    <JobActionsGroup
      :key="group.id"
      :id="group.id"
      :category-name="group.categoryName"
      :ids="group.ids"
      v-for="group in actionGroups"
    />
  </template>
  <JobActionsGroupSkeleton v-if="isLoading" />
</template>

<style scoped></style>
