<template>
  <div class="loadingAppIndicatorBackground" v-show="jobDataNotLoaded">
    <div class="loadingIndicatorIcon"></div>
    <div class="loadingIndicatorText">{{ t('loadingJobsData') }}</div>
  </div>
  <div class="jobMenu">
    <jobs-menu
        :id="jobCategory.id"
        :name="jobCategory.name"
        :icon="jobCategory.icon"
        :jobList="jobCategory.jobList"
        v-for="jobCategory in jobsMenu" :key="jobCategory.id"></jobs-menu>
  </div>
  <div class="jobActions">
    <router-view></router-view>
  </div>
</template>

<script>
import { getAllJobsData, getAllMenuData } from '@/js/ffxivadvancedrotations'
import { useI18n } from 'vue-i18n'

export default {
  name: 'App',
  setup () {
    const { t } = useI18n()

    return { t }
  },
  data: function () {
    return {
      jobDataNotLoaded: true,
      jobsMenu: Object,
      jobsData: Object
    }
  },
  created () {
    const language = 'en'
    this.jobsMenu = getAllMenuData(language)
    getAllJobsData(language).then((allJobDataResult) => {
      for (const jobDataResult of allJobDataResult) {
        this.jobsData[jobDataResult.id] = jobDataResult
      }

      for (const jobCategory of this.jobsMenu) {
        const jobsData = []
        for (const jobId of jobCategory.jobIds) {
          jobsData.push(
            {
              id: this.jobsData[jobId].id,
              icon: this.jobsData[jobId].icon,
              name: this.jobsData[jobId].name
            }
          )
        }
        jobCategory.jobList = jobsData
        delete jobCategory.jobIds
      }
      this.jobDataNotLoaded = false
    })
  }
}
</script>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c2f34;
}

.jobMenu {
  width: 250px;
  float: left;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.jobActions {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100%;
}

@keyframes loadingIndicatorRotation {
  from { background-position-x: 0 }
  to { background-position-x: -1296px }
}
.loadingIndicatorIcon {
  width: 108px;
  height: 108px;
  position: absolute;
  top: 50%;
  margin-top: -54px;
  left: 50%;
  margin-left: -54px;
  background-position-x: 0;
  background-image: url("assets/common_loading_rotate.png");
  background-color: transparent;
  animation: loadingIndicatorRotation 1s steps(12) infinite;
}

.loadingIndicatorText {
  color: white;
  position: absolute;
  top: 50%;
  margin-top: 50px;
  left: 50%;
  margin-left: -125px;
  background-color: transparent;
  font-size: 24px;
  width: 250px;
  text-align: center;
}

.loadingAppIndicatorBackground {
  background-color: black;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100000;
}

</style>
