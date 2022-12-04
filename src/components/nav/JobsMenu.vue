<template>
  <div class="jobCategory" :key="id">
    <div class="jobCategoryHeadline">
      <div
        class="jobTypesIcon"
        :style="{ backgroundImage: 'url(' + icon + ')' }"
      ></div>
      <div class="jobTypesName">
        {{
          /* eslint-disable @intlify/vue-i18n/no-dynamic-keys */ $t(this.name)
        }}
      </div>
    </div>
    <JobEntry
      :id="job.id"
      :icon="job.icon"
      :name_de="job.name_de"
      :name_en="job.name_en"
      :name_fr="job.name_fr"
      :name_ja="job.name_ja"
      v-for="job in jobList"
      :key="job.id"
    ></JobEntry>
  </div>
</template>

<script>
import JobEntry from "@/components/nav/JobEntry.vue";

export default {
  name: "jobs-menu",
  components: {
    JobEntry,
  },
  props: {
    id: String,
    icon: String,
    name: String,
    jobList: Array,
  },
};
</script>

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
  color: #989898;
  display: inline-block;
  line-height: 28px;
  vertical-align: top;
  font-size: 23px;
}
</style>
