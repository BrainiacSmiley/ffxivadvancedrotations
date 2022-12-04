<template>
  <div class="groupOfActions">
    <fieldset class="actionGroup">
      <legend>{{ categoryNameWithOrWithoutAmount }}</legend>
      <div class="actions">
        <draggable
          v-model="jobActions"
          item-key="id"
          :group="{ name: this.categoryName, pull: 'clone', put: false }"
          :sort="false"
        >
          <template #item="{ element }">
            <ActionIcon
              :id="element.id"
              :icon="element.icon"
              :name="element.name"
              :category="element.category"
              :key="element.id"
            ></ActionIcon>
          </template>
        </draggable>
      </div>
    </fieldset>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ActionIcon from "@/components/action/ActionIcon";

export default {
  name: "ActionGroup",
  components: {
    draggable,
    ActionIcon,
  },
  data() {
    return {
      jobActions: [],
    };
  },
  props: {
    locale: { type: String, default: "en" },
    categoryName: { type: String, required: true },
    actions: { type: Object, required: true },
  },
  created() {
    this.convertPropsToValue("actions");
  },
  methods: {
    convertPropsToValue(propName) {
      for (const action of Object.entries(this[propName])) {
        this.jobActions.push({
          id: action[1].id,
          icon: action[1].icon,
          name: action[1][`name_${this.locale}`],
          category: action[1].action_category,
        });
      }
    },
  },
  watched: {
    actions: {
      deep: true,
      handler() {
        console.log("watched actions");
        this.convertPropsToValue("actions");
      },
    },
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
