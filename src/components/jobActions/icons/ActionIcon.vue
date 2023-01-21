<script setup>
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { getLocale } from "@/i18n";
import { getCharacterLevel } from "@/composables/settings";
import { computed, toRefs } from "vue";
import { changeSelectedIcon, setDragData } from "@/composables/icon";

const props = defineProps({
  actionId: { type: Number, required: true },
});

/**
 * Checks if the actual action is a GCD or OCD action
 * @return {string}
 */
const name = computed(() => {
  const locale = getLocale();
  return data[`name_${locale}`];
});
const actionIcon = computed(() => {
  return { backgroundImage: `url(${data["icon"]})` };
});
/**
 * Checks if the actual action is a GCD or OCD action
 * @return {boolean}
 */
const isGCD = computed(() => {
  return data["cooldown_group"] === 58 || data["cooldown_group"] === 13;
});
const notLearned = computed(() => {
  return data["class_job_level"] > getCharacterLevel();
});

//data initialization
const { actionId } = toRefs(props);
let data;
const init = async () => {
  data = await getActionData(actionId.value);
};
await init();
</script>

<template>
  <div
    :id="actionId"
    :style="actionIcon"
    :data-bs-title="name"
    v-tooltip
    class="predefinedRotationIcon"
    draggable="true"
    @mouseenter="changeSelectedIcon(actionId, 'action')"
    @mouseleave="changeSelectedIcon(null, 'action')"
    @dragstart="setDragData(actionId, $event, 'action', 'job', null)"
  >
    <i v-if="isGCD" class="actionGCDIcon bi bi-clock-history" />
    <div v-if="notLearned" class="notLearnedAction" />
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.predefinedRotationIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: black;
  background-size: contain;
}

.predefinedRotationIcon:hover {
  border: solid var(--bs-primary) 3px;
}

.actionGCDIcon {
  position: absolute;
  color: var(--mdb-primary);
  top: 54px;
  left: -22px;
  font-size: 32px;
}

.notLearnedAction {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  background-color: black;
  opacity: 0.5;
}
</style>
