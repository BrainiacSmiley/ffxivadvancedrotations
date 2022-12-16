<template>
  <header class="jobActionsHeader">
    <div class="jobActionsIcon" :style="selectedJobIcon"></div>
    <div class="jobActionsName">{{ name }}</div>
  </header>
</template>

<script>
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { getLocale } from "@/i18n";
import { ref } from "vue";

export default {
  async setup(props) {
    let data = ref(await getJobData(props.jobId));
    return {
      data,
    };
  },
  name: "JobActionsHeader",
  props: {
    jobId: { type: Number, required: true },
  },
  computed: {
    name() {
      const locale = getLocale();
      return this.data[`name_${locale}`];
    },
    selectedJobIcon() {
      return { backgroundImage: `url(${this.data["icon"]})` };
    },
  },
  watch: {
    jobId: {
      deep: true,
      handler(newJobId) {
        getJobData(newJobId).then((newData) => {
          this.data = newData;
        });
      },
    },
  },
};
</script>

<style scoped>
.jobActionsHeader {
  margin: auto;
  width: 340px;
  justify-self: flex-start;
}

.jobActionsIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
}

.jobActionsName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 36px;
  vertical-align: top;
  margin-top: 4px;
}
</style>
