<template>
  <div
    :id="itemId"
    class="itemIcon"
    v-tooltip="name"
    @mouseenter="changeSelectedItem(itemId)"
    @mouseleave="changeSelectedItem(null)"
  >
    <div
      class="itemIconItem"
      :style="{ backgroundImage: 'url(' + icon + ')' }"
    />
    <div class="itemIconHQOverlay" />
  </div>
</template>

<script>
import { getItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import { getLocale } from "@/i18n";
import { setTooltipId } from "@/composables/tooltipId";

export default {
  async setup(props) {
    const data = await getItemData(props.itemId);
    return {
      data,
    };
  },
  name: "ItemIcon",
  props: {
    itemId: { type: Number, required: true },
    isHQ: { type: Boolean, required: false, default: true },
  },
  computed: {
    name() {
      const locale = getLocale();
      return this.data[`name_${locale}`];
    },
    icon() {
      return this.data["icon"];
    },
  },
  methods: {
    /**
     * @param {Number} itemId The id of the actual selected action
     */
    changeSelectedItem(itemId) {
      setTooltipId(itemId, "item");
    },
  },
};
</script>

<style scoped>
.itemIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: lightgray;
  position: relative;
  background-size: contain;
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

.itemIcon:hover {
  border: solid white 3px;
}
</style>
