<script setup>
import JobActionsHeaderSkeleton from "@/components/jobActions/JobActionsHeaderSkeleton.vue";
import JobActionsTooltip from "@/components/jobActions/JobActionsTooltip.vue";
import JobActionsHeader from "@/components/jobActions/JobActionsHeader.vue";
import JobActionsGroups from "@/components/jobActions/JobActionsGroups.vue";
import RotationPlanner from "@/components/jobActions/RotationPlanner.vue";
import { setJobId } from "@/composables/jobId";
import { onMounted, toRefs, watch } from "vue";
import JobActionsGroupSkeleton from "@/components/jobActions/JobActionsGroupSkeleton.vue";
import { useEventBus } from "@vueuse/core";
import { getSpecialActionGroup } from "@/js/ffxiv/ffxivjobactions";

const props = defineProps({
  jobId: { type: Number, required: true, defaultValue: 19 },
  rotation: { type: String, required: false, default: null },
});

const numberOfGridRowsChanged = useEventBus("numberOfGridRowsChanged");
const { jobId } = toRefs(props);
function storeJobId(jobId) {
  setJobId(jobId);
  if (getSpecialActionGroup(jobId) !== null) {
    numberOfGridRowsChanged.emit(4);
  }
}
onMounted(() => {
  storeJobId(jobId.value);
});
watch(jobId, (newJobId) => {
  storeJobId(newJobId);
});
</script>

<template>
  <div class="jobActions">
    <Suspense>
      <template #default>
        <JobActionsHeader :job-id="jobId" />
      </template>
      <template #fallback>
        <JobActionsHeaderSkeleton />
      </template>
    </Suspense>
    <RotationPlanner :saved-rotation="rotation" />
    <Suspense timeout="0">
      <template #default>
        <JobActionsGroups :job-id="jobId" />
      </template>
      <template #fallback>
        <JobActionsGroupSkeleton />
      </template>
    </Suspense>
    <JobActionsTooltip />
  </div>
</template>

<style scoped>
.jobActions {
  position: relative;
  bottom: 0;
  left: 50%;
  margin-left: -980px;
  width: 1972px;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr var(--tooltip-width);
  grid-template-rows: 72px 130px 150px 1fr auto;
  align-items: end;
  justify-self: flex-end;
  margin-bottom: 15px;
  /*noinspection CssInvalidPropertyValue*/
  height: -webkit-fill-available;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .jobActions {
    margin-left: -800px;
    width: 1600px;
    grid-template-rows: 29px 87px 150px 1fr auto;
  }
}
</style>
