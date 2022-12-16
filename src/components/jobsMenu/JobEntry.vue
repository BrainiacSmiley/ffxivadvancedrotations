<template>
  <div
    class="job"
    :class="selected"
    :key="jobId"
    @click="changeSelectedJob(jobId)"
  >
    <div
      class="jobIcon"
      :style="{ backgroundImage: 'url(' + data.icon + ')' }"
    ></div>
    <div class="jobName">{{ name }}</div>
    <div class="jobLine"></div>
  </div>
</template>

<script>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { getLocale } from "@/i18n";

export default {
  async setup(props) {
    const data = await getJobData(props.jobId);
    return {
      data,
    };
  },
  name: "JobEntry",
  props: {
    jobId: { type: Number, required: true },
  },
  data() {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
  methods: {
    changeSelectedJob(jobId) {
      const locale = getLocale();
      this.$router["push"](`/${locale}/jobActions/${jobId}`);
    },
  },
  computed: {
    name() {
      const locale = getLocale();
      return this.data[`name_${locale}`];
    },
    selected() {
      return this.ffxivAdvancedRotationsStore.selectedUIElements.jobId ===
        this.jobId
        ? "selected"
        : "";
    },
  },
};
</script>

<style scoped>
.job {
  width: 265px;
  cursor: pointer;
  height: 46px;
  margin-bottom: 2px;
  position: relative;
}

.jobIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
  position: absolute;
  top: -9px;
}

.jobName {
  color: #c2c2c2;
  font-size: 21px;
  position: absolute;
  top: 4px;
  left: 65px;
}

.jobLine {
  height: 10px;
  width: 200px;
  background-color: #595b5f;
  display: inline-block;
  position: absolute;
  top: 28px;
  left: 62px;
}

.job:hover .jobLine,
.job.selected .jobLine {
  background-color: #b0c3e0;
}
</style>
