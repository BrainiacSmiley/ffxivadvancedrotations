<template>
  <div class="groupOfActions">
    <fieldset class="actionGroup" :class="gridWidthClass">
      <legend>{{ categoryNameWithOrWithoutAmount }}</legend>
      <div class="actions">
        <ActionIcon
          v-for="action in actionIds"
          :actionId="action.id"
          :key="action.id"
        />
        <ItemIcon v-for="item in itemIds" :itemId="item.id" :key="item.id" />
        <!--        <draggable-->
        <!--          v-model="actionIds"-->
        <!--          item-key="id"-->
        <!--          :group="{ name: this.categoryName, pull: 'clone', put: false }"-->
        <!--          :sort="false"-->
        <!--        >-->
        <!--          <template #item="{ element }">-->
        <!--            <ActionIcon :actionId="element.id" :key="element.id"></ActionIcon>-->
        <!--          </template>-->
        <!--        </draggable>-->
        <!--        <draggable-->
        <!--          v-model="itemIds"-->
        <!--          item-key="id"-->
        <!--          :group="{ name: this.categoryName, pull: 'clone', put: false }"-->
        <!--          :sort="false"-->
        <!--        >-->
        <!--          <template #item="{ element }">-->
        <!--            <ItemIcon :itemId="element.id" :key="element.id"></ItemIcon>-->
        <!--          </template>-->
        <!--        </draggable>-->
      </div>
    </fieldset>
  </div>
</template>
<script>
// import draggable from "vuedraggable";
import ActionIcon from "@/components/jobActions/ActionIcon.vue";
import ItemIcon from "@/components/jobActions/ItemIcon.vue";

export default {
  name: "ActionGroup",
  components: {
    // draggable,
    ActionIcon,
    ItemIcon,
  },
  props: {
    categoryName: { type: String, required: true },
    ids: { type: Object, required: true },
  },
  computed: {
    actionIds() {
      if (typeof this.$props.ids.actionIds === "undefined") {
        return [];
      }

      const actionIds = [];
      this.$props.ids.actionIds.forEach((id) => {
        actionIds.push({
          id: id,
        });
      });
      return actionIds;
    },
    itemIds() {
      if (typeof this.$props.ids.itemIds === "undefined") {
        return [];
      }

      const actionIds = [];
      this.$props.ids.itemIds.forEach((id) => {
        actionIds.push({
          id: id,
        });
      });
      return actionIds;
    },
    gridWidthClass() {
      if (
        this.categoryName === "actionGroupNames.job" ||
        this.categoryName.indexOf("actionGroupNames.special.") === 0
      ) {
        return "fullGroupWidth";
      } else if (
        this.categoryName === "actionGroupNames.role" ||
        this.categoryName === "actionGroupNames.tincture"
      ) {
        return "halfGroupWidth";
      }
      return "";
    },
    categoryNameWithOrWithoutAmount() {
      let amount = Object.entries(this.$props.ids.actionIds).length;
      if (typeof this.$props.ids.itemIds !== "undefined") {
        amount += Object.entries(this.$props.ids.itemIds).length;
      }

      // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
      const groupName = this.$t(this.categoryName);
      if (process.env.VUE_APP_DEBUG_VERBOSE === "true") {
        return `${groupName} (${amount})`;
      } else {
        return groupName;
      }
    },
  },
};
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.groupOfActions {
  display: contents;
}

.fullGroupWidth {
  width: 1468px;
  grid-column: 2 span;
}

.halfGroupWidth {
  width: 708px;
}

legend {
  color: lightgray;
  font-size: 32px;
  border-radius: 5px;
  width: auto;
  margin-left: 10px;
  margin-top: -32px;
  padding-left: 5px;
  padding-right: 6px;
}

.actionGroup {
  border-radius: 5px;
  border: 2px solid gray;
  padding: revert;
}

.actions > div {
  display: inline-block;
}
</style>
