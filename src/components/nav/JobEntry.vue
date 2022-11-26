<template>
  <div class="job" :class="selected" :key="id" @click="changeSelectedJob(id)">
    <div
      class="jobIcon"
      :style="{ backgroundImage: 'url(' + icon + ')' }"
    ></div>
    <div class="jobName">{{ name }}</div>
    <div class="jobLine"></div>
  </div>
</template>

<script>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

export default {
  name: "job-entry",
  props: {
    id: Number,
    icon: String,
    name_de: String,
    name_en: String,
    name_fr: String,
    name_ja: String,
  },
  data() {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
  methods: {
    changeSelectedJob(jobId) {
      this.ffxivAdvancedRotationsStore.selectedUIElements.jobId = jobId;
      this.$router["push"](`/${this.$parent.$i18n.locale}/jobActions/${jobId}`);
    },
  },
  computed: {
    name() {
      return this[`name_${this.$parent.$i18n.locale}`];
    },
    selected() {
      return this.ffxivAdvancedRotationsStore.selectedUIElements.jobId ===
        this.id
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
}

.jobIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
  margin-top: -9px;
}

.jobName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 21px;
  vertical-align: top;
  margin-top: 4px;
}

.jobLine {
  height: 10px;
  width: 200px;
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
