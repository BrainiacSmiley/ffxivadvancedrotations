<script setup>
import ActionIcon from "@/components/jobActions/icons/ActionIcon.vue";
import ItemIcon from "@/components/jobActions/icons/ItemIcon.vue";
import { computed, toRefs } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  categoryName: { type: String, required: true },
  ids: { type: Object, required: true },
});

const { ids, categoryName } = toRefs(props);
const actionIds = computed(() => {
  if (typeof ids.value.actionIds === "undefined") {
    return [];
  }

  return ids.value.actionIds.map((id) => {
    return { id };
  });
});
const itemIds = computed(() => {
  if (typeof ids.value.itemIds === "undefined") {
    return [];
  }

  return ids.value.itemIds.map((id) => {
    return { id };
  });
});

const gridWidthClass = computed(() => {
  if (
    categoryName.value === "actionGroupNames.job" ||
    categoryName.value.indexOf("actionGroupNames.special.") === 0
  ) {
    return "fullGroupWidth";
  } else if (
    categoryName.value === "actionGroupNames.role" ||
    categoryName.value === "actionGroupNames.tincture"
  ) {
    return "halfGroupWidth";
  }
  return "";
});
const categoryNameWithOrWithoutAmount = computed(() => {
  let amount = ids.value.actionIds.length;
  if (typeof ids.value.itemIds !== "undefined") {
    amount += ids.value.itemIds.length;
  }

  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  const groupName = t(categoryName.value);
  if (import.meta.env.VITE_APP_DEBUG_VERBOSE === "true") {
    return `${groupName} (${amount})`;
  } else {
    return groupName;
  }
});
</script>

<template>
  <fieldset class="actionGroup" :class="gridWidthClass">
    <legend>{{ categoryNameWithOrWithoutAmount }}</legend>
    <div class="actions">
      <ActionIcon
        v-for="action in actionIds"
        :action-id="action.id"
        :key="action.id"
      />
      <ItemIcon v-for="item in itemIds" :item-id="item.id" :key="item.id" />
    </div>
  </fieldset>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.fullGroupWidth {
  width: 1468px;
  grid-column: 2 span;
}

.halfGroupWidth {
  width: 719px;
}

legend {
  font-size: 32px;
  border-radius: 5px;
  width: auto;
  margin-left: 10px;
  margin-top: -32px;
  padding-left: 5px;
  padding-right: 6px;
  background-color: var(--bs-body-bg);
}

.actionGroup {
  border-radius: 5px;
  border: 2px solid var(--bs-gray);
  padding: revert;
  overflow: visible;
}

.actions > div {
  display: inline-block;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .fullGroupWidth {
    width: calc(1600px - var(--tooltip-width) - 2rem);
  }

  .halfGroupWidth {
    width: calc((1600px - var(--tooltip-width) - 4rem) / 2);
  }
}
</style>
