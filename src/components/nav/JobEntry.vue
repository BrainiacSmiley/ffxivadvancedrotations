<template>
  <div class="job" :key="id" @click="changeSelectedJob(id)">
    <div class="jobIcon" :style="{ backgroundImage: 'url(' + icon + ')' }"></div>
    <div class="jobName">{{ name }}</div>
    <div class="jobLine"></div>
  </div>
</template>

<script>
export default {
  name: 'job-entry',
  props: {
    id: Number,
    icon: String,
    name: String
  },
  methods: {
    changeSelectedJob (jobId) {
      this.$router.push('/jobActions/' + jobId)
    }
  }
}
</script>

<style scoped>
.job {
  margin-bottom: -38px;
  width: 200px;
  cursor: pointer;
}

.jobIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
}

.jobName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 21px;
  vertical-align: top;
  margin-top: 12px;
}

.jobLine {
  height: 10px;
  width: 130px;
  background-color: #595b5f;
  display: inline-block;
  position: relative;
  top: -33px;
  left: 62px;
}

.job:hover .jobLine,
.job.selected .jobLine {
  background-color: #b0c3e0;
}
</style>
