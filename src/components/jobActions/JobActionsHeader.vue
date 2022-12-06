<template>
  <header class="jobActionsHeader">
    <div class="jobActionsIcon" :style="selectedJobIcon"></div>
    <div class="jobActionsName">{{ name }}</div>
  </header>
</template>

<script>
// import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { getLocale } from "@/i18n";

const getData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    icon: "https://xivapi.com/cj/companion/machinist.png",
    id: 31,
    name_de: "Maschinist",
    name_en: "Machinist",
    name_fr: "Machiniste",
    name_ja: "機工士",
  };
};

export default {
  async setup(props) {
    // const data = await getJobData(props.jobId);
    const data = await getData(props.jobId);
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
};
</script>

<style scoped>
.jobActionsHeader {
  margin: auto;
  width: 340px;
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
