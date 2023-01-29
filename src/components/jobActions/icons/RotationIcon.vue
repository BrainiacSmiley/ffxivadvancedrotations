<!--suppress CssUnusedSymbol -->
<script setup>
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { getItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import { getLocale } from "@/i18n";
import { computed, toRefs } from "vue";
import { changeSelectedIcon, setDragData } from "@/composables/icon";

const props = defineProps({
  id: { type: Number, required: true },
  type: { type: String, required: true, default: "action" },
  position: { type: Number, required: true, default: 0 },
});

/**
 * Checks if the actual action is a GCD or OCD action
 * @return {string}
 */
const name = computed(() => {
  const locale = getLocale();
  return data[`name_${locale}`];
});

const icon = computed(() => {
  return data["icon"];
});

const isRotaGCDAction = computed(() => {
  if (
    (type.value === "action" &&
      data["cooldown_group"] !== 58 &&
      data["cooldown_group"] !== 13) ||
    type.value === "item"
  ) {
    return "rotaActionOGCD";
  }

  return "";
});

//data initialization
const { id, type } = toRefs(props);
let data;
const init = async () => {
  if (type.value === "action") {
    data = await getActionData(id.value);
  } else if (type.value === "item") {
    data = await getItemData(id.value);
  }
};
await init();
</script>

<template>
  <div
    :id="id"
    :data-bs-title="name"
    :class="isRotaGCDAction"
    :style="{ backgroundImage: 'url(' + icon + ')' }"
    :data-rotation-type="type"
    v-tooltip
    class="rotationIcon"
    @mouseenter="changeSelectedIcon(id, type)"
    @mouseleave="changeSelectedIcon(null, type)"
    @dragstart="setDragData(id, $event, type, 'rotation', position)"
  />
</template>

<style scoped>
.rotationIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: black;
  background-size: contain;
}

.rotationIcon:hover {
  border: solid var(--bs-primary) 3px;
}

.rotaActionOGCD {
  transform: scale(0.5);
  margin-top: 9px;
  margin-left: 0;
  transform-origin: top left;
  margin-right: -30px;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .rotationIcon {
    transform: scale(0.6);
    margin-right: -18px;
    margin-top: -18px;
  }

  .rotaActionOGCD {
    transform: scale(0.4);
    margin-left: 5px;
    margin-right: -50px;
  }
}
</style>

<style>
.rotationIconDragged .rotaActionOGCD {
  transform: scale(0.8) !important;
}
</style>
