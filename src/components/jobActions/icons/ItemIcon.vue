<script setup>
import { getItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import { getLocale } from "@/i18n";
import { computed, toRefs } from "vue";
import { changeSelectedIcon, setDragData } from "@/composables/icon";

const props = defineProps({
  itemId: { type: Number, required: true },
  isHQ: { type: Boolean, required: false, default: true },
});

const name = computed(() => {
  const locale = getLocale();
  return data[`name_${locale}`];
});
const icon = computed(() => {
  return data["icon"];
});

//data initialization
const { itemId } = toRefs(props);
let data;
const init = async () => {
  data = await getItemData(itemId.value);
};
await init();
</script>

<template>
  <div
    :id="itemId"
    :data-bs-title="name"
    v-tooltip
    class="itemIcon"
    draggable="true"
    @mouseenter="changeSelectedIcon(itemId, 'item')"
    @mouseleave="changeSelectedIcon(null, 'item')"
    @dragstart="setDragData(itemId, $event, 'item', 'job', null)"
  >
    <div
      class="itemIconItem"
      :style="{ backgroundImage: 'url(' + icon + ')' }"
    />
    <div class="itemIconHQOverlay" />
  </div>
</template>

<style scoped>
.itemIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: black;
  position: relative;
  background-size: contain;
}

.itemIcon:hover {
  border: solid var(--bs-primary) 3px;
}

.itemIconItem {
  width: 74px;
  height: 74px;
  display: inline-block;
  position: absolute;
  background-size: contain;
}

.itemIconHQOverlay {
  width: 74px;
  height: 74px;
  display: inline-block;
  position: absolute;
  background-size: contain;
  background-image: url("@/assets/pics/HQOverlay.png");
  background-color: transparent;
}
</style>
