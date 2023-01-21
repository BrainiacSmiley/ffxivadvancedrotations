<script setup>
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";
import { getCharacterLevel } from "@/composables/settings";
import { computed, ref, toRefs, watch } from "vue";
import { getLocale } from "@/i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  jobId: { type: Number, required: true },
});

const selectedJobIcon = computed(() => {
  return { backgroundImage: `url(${data.value["icon"]})` };
});
const name = computed(() => {
  const locale = getLocale();
  const jobName = data.value[`name_${locale}`];
  const jobLevel = getCharacterLevel();
  const lvl = jobLevel !== FFXIVMAXLVL ? `${t("lvl")} ${jobLevel}` : t("maxLvl");
  return `${jobName} (${lvl})`;
});

const { jobId } = toRefs(props);
watch(jobId, (newJobId, oldJobId) => {
  if (newJobId === oldJobId) {
    return;
  }
  getJobData(newJobId).then((newData) => {
    data.value = newData;
  });
});

//data initialization
let data;
const init = async () => {
  data = ref(await getJobData(jobId.value));
}
await init();
</script>

<template>
  <header class="jobActionsHeader">
    <div class="jobActionsIcon" :style="selectedJobIcon"></div>
    <div class="jobActionsName">{{ name }}</div>
  </header>
</template>

<style scoped>
.jobActionsHeader {
  grid-column: 3 span;
  justify-self: center;
  align-self: start;
  margin-top: 15px;
}

.jobActionsIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
}

.jobActionsName {
  display: inline-block;
  font-size: 36px;
  vertical-align: top;
  margin-top: 4px;
}
</style>
