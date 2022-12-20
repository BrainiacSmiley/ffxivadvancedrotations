<template>
  <div
    :id="actionId"
    class="actionIcon"
    :style="{ backgroundImage: 'url(' + icon + ')' }"
    v-tooltip="name"
    @mouseenter="changeSelectedAction(actionId)"
    @mouseleave="changeSelectedAction(null)"
  >
    <div class="actionGCD" v-if="isGCD" />
  </div>
</template>

<script>
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { getLocale } from "@/i18n";
import { setTooltipId } from "@/composables/tooltipId";

export default {
  async setup(props) {
    const data = await getActionData(props.actionId);
    return {
      data,
    };
  },
  name: "ActionIcon",
  props: {
    actionId: { type: Number, required: true },
  },
  computed: {
    /**
     * Checks if the actual action is a GCD or OCD action
     * @return {string}
     */
    name() {
      const locale = getLocale();
      return this.data[`name_${locale}`];
    },
    icon() {
      return this.data["icon"];
    },
    /**
     * Checks if the actual action is a GCD or OCD action
     * @return {boolean}
     */
    isGCD() {
      return this.data["cooldown_group"] === 58;
    },
  },
  methods: {
    /**
     * @param {Number} actionId The id of the actual selected action
     */
    changeSelectedAction(actionId) {
      setTooltipId(actionId, "action");
    },
  },
};
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.actionIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: lightgray;
  background-size: contain;
}

.actionIcon[style*="background"] {
  background-color: transparent;
}

.actionIcon:hover {
  border: solid white 3px;
}

.actionGCD {
  width: 108px;
  height: 108px;
  transform: scale(0.3);
  background-image: url("@/assets/pics/common_loading_rotate05.png");
  background-color: transparent;
  margin-top: 28px;
  margin-left: -54px;
}

.actionOGCD {
  display: none;
}

.rotationActions > .rotaActionOGCD {
  transform: scale(0.5);
  margin-top: 9px;
  margin-left: 0;
  transform-origin: top left;
  margin-right: -30px;
}

.rotationActions > .rotaActionGCD {
}
</style>
