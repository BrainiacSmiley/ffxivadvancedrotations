<template>
  <div class="jobCategory" :key="id">
    <div class="jobCategoryHeadline">
      <div class="jobTypesIcon" :style="{ backgroundImage: 'url(' + icon + ')' }"></div>
      <div class="jobTypesName">{{ name }}</div>
    </div>
    <div class="jobList" v-for="job in jobList" :key="job.id">
      <job-entry
        :id="job.id"
        :icon="job.icon"
        :name="job.name"></job-entry>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jobs-menu',
  props: {
    id: String,
    icon: String,
    name: String,
    jobList: Array
  }
}
</script>

<style scoped>
.jobCategory {
  margin-bottom: 25px;
}

.jobCategoryHeadline {
  margin-bottom: -13px;
}

.jobTypesIcon {
  width: 32px;
  height: 32px;
  display: inline-block;
  transform: scale(0.8);
  margin-top: 6px;
}

.jobTypesName {
  color: #989898;
  display: inline-block;
  line-height: 46px;
  vertical-align: top;
  font-size: 20px;
}

</style>
