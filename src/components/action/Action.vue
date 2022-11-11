<template>
  <div
      :id="id"
      class="actionIcon"
      :style="{ backgroundImage: 'url(' + icon + ')' }"
      v-tooltip="name"
      @mouseenter="changeSelectedAction(id)">
<!--      @mouseleave="changeSelectedAction()">-->
    <div :class="isGCDAction"></div>
  </div>
</template>

<script>
export default {
  name: 'Action',
  props: {
    id: Number,
    icon: String,
    name: String,
    category: Number
  },
  computed: {
    /**
     * Checks if the actual action is a GCD or OCD action
     * @return {string}
     */
    isGCDAction () {
      if (this.category === 2 || this.category === 3) {
        return 'actionGCD'
      }
      return 'actionOGCD'
    }
  },
  methods: {
    /**
     * @param {Number} actionId The id of the actual selected action
     */
    changeSelectedAction (actionId) {
      this.$parent.$parent.actualSelectedActionId = actionId
    }
  }
}
</script>

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
</style>
