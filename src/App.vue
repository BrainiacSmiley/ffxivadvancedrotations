<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ $t("siteName") }}</a>
    </div>
    <LocaleSwitcher></LocaleSwitcher>
    <div class="dropdown me-2">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="settings"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ $t("settings.buttonLabel") }}
      </button>
      <div
        class="dropdown-menu dropdown-menu-end p-2"
        aria-labelledby="settings"
        style="background-color: #565e64"
      >
        <div class="form-check form-switch" style="background-color: #565e64">
          <input
            class="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            v-model="
              ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions
            "
          />
          <label
            class="form-check-label"
            for="flexSwitchCheckDefault"
            style="
              background-color: #565e64;
              color: white;
              margin-top: -17px;
              margin-left: 10px;
            "
            id="flexSwitchCheckDefaultLabel"
          >
            {{ $t("settings.removeUpleveledActions") }}
          </label>
        </div>
      </div>
    </div>
  </nav>
  <div class="loadingAppIndicatorBackground" v-show="jobDataNotLoaded">
    <div class="loadingIndicatorIcon"></div>
    <div class="loadingIndicatorText">{{ $t("loadingJobsData") }}</div>
  </div>
  <div class="jobMenu">
    <JobsMenu
      :id="jobCategory.id"
      :name="jobCategory.name"
      :icon="jobCategory.icon"
      :jobList="jobCategory.jobList"
      v-for="jobCategory in jobsMenu"
      :key="jobCategory.id"
    ></JobsMenu>
  </div>
  <div class="jobActions">
    <router-view></router-view>
  </div>
</template>

<script>
import { getAllJobsData, getAllMenuData } from "@/js/ffxivadvancedrotations";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import LocaleSwitcher from "@/components/nav/LocaleSwitcher";
import JobsMenu from "@/components/nav/JobsMenu.vue";

export default {
  name: "App",
  components: {
    LocaleSwitcher,
    JobsMenu,
  },
  data: function () {
    return {
      jobDataNotLoaded: true,
      jobsMenu: Object,
      jobsData: Object,
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
  created() {
    const language = "en";
    this.jobsMenu = getAllMenuData();
    getAllJobsData(language).then((allJobDataResult) => {
      for (const jobDataResult of allJobDataResult) {
        this.jobsData[jobDataResult.id] = jobDataResult;
      }

      for (const jobCategory of this.jobsMenu) {
        const jobsData = [];
        for (const jobId of jobCategory.jobIds) {
          jobsData.push({
            id: this.jobsData[jobId].id,
            icon: this.jobsData[jobId].icon,
            name_de: this.jobsData[jobId].name_de,
            name_en: this.jobsData[jobId].name_en,
            name_fr: this.jobsData[jobId].name_fr,
            name_ja: this.jobsData[jobId].name_ja,
          });
        }
        jobCategory.jobList = jobsData;
        delete jobCategory.jobIds;
      }
      this.jobDataNotLoaded = false;
    });
  },
};
</script>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c2f34;
}

body {
  overflow: hidden;
}

.jobMenu {
  width: 265px;
  float: left;
  position: absolute;
  top: 60px;
  left: 0;
  height: 100%;
  line-height: 1;
}

.jobActions {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  position: absolute;
  top: 60px;
  left: 265px;
  width: calc(100% - 250px);
  height: calc(100% - 60px);
}

@keyframes loadingIndicatorRotation {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -1296px;
  }
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
  background-image: url("assets/pics/common_loading_rotate.png");
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
