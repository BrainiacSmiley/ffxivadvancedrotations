<script setup>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { getJobData } from "@/js/ffxiv/ffxivdata/ffxivclassjobdata";
import { getLocale } from "@/i18n";
import { computed, toRefs } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  jobId: { type: Number, required: true },
});

const jobIcon = computed(() => {
  return { backgroundImage: `url(${data["icon"]})` };
});
const name = computed(() => {
  const locale = getLocale();
  return data[`name_${locale}`];
});
const selected = computed(() => {
  const ffxivAdvancedRotationsStore = useFFXIVAdvancedRotationsStore();
  return ffxivAdvancedRotationsStore.selectedUIElements.jobId === props.jobId ? "btn-primary" : "btn-secondary";// "selected"
});

const router = useRouter();
function changeSelectedJob(jobId) {
  const locale = getLocale();
  router.push(`/${locale}/jobActions/${jobId}`);
}

//data initialization
let data;
const { jobId } = toRefs(props);
const init = async () => {
  data = await getJobData(jobId.value);
}
await init();
</script>

<template>
  <div
    class="job btn"
    :class="selected"
    :key="jobId"
    @click="changeSelectedJob(jobId)"
  >
    <div
      class="jobIcon"
      :style="jobIcon"
    ></div>
    <div class="jobName">{{ name }}</div>
    <div class="jobLine"></div>
  </div>
</template>

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
  left: -2px;
}

.jobName {
  font-size: 21px;
  position: absolute;
  top: 0;
  left: 65px;
  text-transform: none;
}

.jobLine {
  height: 10px;
  width: 185px;
  background-color: var(--mdb-primary);
  display: inline-block;
  position: absolute;
  top: 28px;
  left: 62px;
}

.job:hover .jobLine {
  background-color: var(--bs-primary);
}

.btn-primary:hover .jobLine,
.btn-primary .jobLine {
  background-color: var(--mdb-btn-hover-color);
}
</style>
