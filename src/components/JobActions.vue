<template>
    <header class="jobActionsHeader">
      <div class="jobActionsIcon" :style="{ backgroundImage: 'url(' + icon + ')' }"></div>
      <div class="jobActionsName">{{ name }}</div>
    </header>
    <footer class="jobActionsOverview">
      <div class="jobActionsIcon" :style="{ backgroundImage: 'url(' + icon + ')' }"></div>
    </footer>
</template>

<script>
import { getJobActions } from '@/js/ffxiv/ffxivjobactions'

export default {
  name: 'job-actions',
  props: {
    jobId: Number,
    allJobsData: Object
  },
  data () {
    return {
      id: '',
      icon: '',
      name: ''
    }
  },
  created () {
    this.loadJobActions(this.jobId)
  },
  methods: {
    loadJobActions (jobId) {
      const actualJobData = this.$parent.$parent.$props.jobsData[jobId]
      this.id = jobId
      this.icon = actualJobData.icon
      this.name = actualJobData.name

      const jobActions = getJobActions(jobId)
      console.log(jobActions)
    }
  },
  watch: {
    jobId (newId) {
      this.loadJobActions(newId)
    }
  }
}
</script>

<style scoped>
.jobActionsHeader {
  margin: auto;
  width: 200px;
  display: block;
}

.jobActionsIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
}

.jobActionsName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 24px;
  vertical-align: top;
  margin-top: 18px;
}

.jobActionsOverview {
  display: block;
  margin: auto;
  width: 200px;
  background-color: wheat;
}
</style>
