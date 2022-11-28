<template>
  <div
    :id="id"
    class="actionIcon"
    :class="isRotaGCDAction"
    :style="{ backgroundImage: 'url(' + icon + ')' }"
    v-tooltip="name"
    @mouseenter="changeSelectedAction(id)"
    draggable="true"
    @dragstart="startDrag($event, { id: id, position: position })"
  >
    <div :class="isGCDAction"></div>
  </div>
</template>

<script>
export default {
  name: "ActionIcon",
  props: {
    id: Number,
    icon: String,
    name: String,
    category: Number,
    position: Number,
  },
  computed: {
    /**
     * Checks if the actual action is a GCD or OCD action
     * @return {string}
     */
    isGCDAction() {
      if (this.category === 2 || this.category === 3) {
        return "actionGCD";
      }
      return "actionOGCD";
    },
    isRotaGCDAction() {
      if (this.category === 2 || this.category === 3) {
        return "rotaActionGCD";
      }
      return "rotaActionOGCD";
    },
  },
  methods: {
    /**
     * @param {Number} actionId The id of the actual selected action
     */
    changeSelectedAction(actionId) {
      this.$parent.$parent.actualSelectedActionId = actionId;
    },
    startDrag(event, actionData) {
      event.dataTransfer.setData("actionId", actionData.id);
      event.dataTransfer.setData("position", actionData.position);
      event.dataTransfer.setData("source", "rotation");
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
}

.actionIcon:hover {
  border: solid white 3px;
}

.actionGCD {
  width: 108px;
  height: 108px;
  transform: scale(0.3);
  background-image: url("../../assets/common_loading_rotate05.png");
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
