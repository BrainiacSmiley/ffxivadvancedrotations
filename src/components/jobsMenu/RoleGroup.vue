<script setup>
import JobEntry from "@/components/jobsMenu/JobEntry.vue";
import JobEntrySkeleton from "@/components/jobsMenu/JobEntrySkeleton.vue";

const props = defineProps({
  icon: { type: String, required: true },
  name: { type: String, required: true },
  jobIds: { type: Array, required: true },
});
</script>

<template>
  <div class="jobCategory">
    <div class="jobCategoryHeadline">
      <div
        class="jobTypesIcon"
        :style="{ backgroundImage: 'url(' + icon + ')' }"
      ></div>
      <div class="jobTypesName">
        {{ /* eslint-disable @intlify/vue-i18n/no-dynamic-keys */ $t(name) }}
      </div>
    </div>
    <Suspense>
      <template #default>
        <JobEntry
          :key="jobId"
          :job-id="jobId"
          v-for="jobId in jobIds"
        ></JobEntry>
      </template>
      <template #fallback>
        <JobEntrySkeleton
          :key="jobId"
          :job-id="jobId"
          v-for="jobId in jobIds"
        ></JobEntrySkeleton>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.jobCategory {
  margin-bottom: 15px;
}

.jobCategoryHeadline {
  margin-bottom: 3px;
}

.jobTypesIcon {
  width: 32px;
  height: 32px;
  display: inline-block;
  transform: scale(0.8);
  margin-top: -3px;
}

.jobTypesName {
  display: inline-block;
  line-height: 28px;
  vertical-align: top;
  font-size: 23px;
  margin-left: 3px;
}
</style>
