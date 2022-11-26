<template>
  <div class="groupOfActions">
    <fieldset class="actionGroup">
      <legend>{{ categoryNameWithOrWithoutAmount }}</legend>
      <div class="actions">
        <action-icon
          :id="action.id"
          :icon="action.icon"
          :name="action.name"
          :category="action.action_category"
          v-for="action in actions"
          :key="action.id"
        ></action-icon>
      </div>
    </fieldset>
  </div>
</template>
<script>
export default {
  name: "ActionGroup",
  props: {
    categoryName: String,
    actions: Object,
  },
  computed: {
    categoryNameWithOrWithoutAmount() {
      // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
      const groupName = this.$t(this.categoryName);
      if (process.env.VUE_APP_DEBUG_VERBOSE === "true") {
        return `${groupName} (${Object.entries(this.actions).length})`;
      } else {
        return groupName;
      }
    },
  },
};
</script>

<style scoped>
.groupOfActions {
  margin: 5px;
}

legend {
  color: lightgray;
  font-size: 32px;
  border-radius: 5px;
  width: auto;
  margin-left: 10px;
}

.actionGroup {
  border-radius: 5px;
  border: 2px solid gray;
  padding: revert;
}
</style>
