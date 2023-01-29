<script setup>
import RoleGroup from "@/components/jobsMenu/RoleGroup.vue";
import { getAllMenuData } from "@/js/ffxivadvancedrotations";
import { FFXIVVERSION } from "@/js/ffxiv/ffxivconfigs";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { ref, watch } from "vue";
import _ from "lodash";

let menuData = ref(getAllMenuData());
const ffxivAdvancedRotationsStore = ref(useFFXIVAdvancedRotationsStore());
watch(
  () => _.cloneDeep(ffxivAdvancedRotationsStore.value),
  (newValue, oldValue) => {
    if (
      newValue.settings.characterLevel === oldValue.settings.characterLevel ||
      (oldValue.settings.characterLevel > 29 &&
        newValue.settings.characterLevel > 29) ||
      (oldValue.settings.characterLevel < 30 &&
        newValue.settings.characterLevel < 30)
    ) {
      return;
    }
    menuData.value = null;
    setTimeout(() => {
      menuData.value = getAllMenuData();
    }, 0);
  }
);
</script>

<template>
  <div class="jobMenu">
    <RoleGroup
      :key="roleGroup.id"
      :name="roleGroup.name"
      :icon="roleGroup.icon"
      :job-ids="roleGroup.jobIds"
      v-for="roleGroup in menuData"
    ></RoleGroup>
  </div>
  <!--suppress AllyHtmlVueInspection -->
  <div class="fixed-bottom dbVersion">
    {{ $t("dbVersion") }} {{ FFXIVVERSION }}
  </div>
</template>

<style scoped>
.jobMenu {
  width: var(--jobs-menu-width);
  height: calc(100% - var(--navBar-height));
  line-height: 1;
  margin-left: 5px;
}

.dbVersion {
  left: 4px;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .jobMenu {
    width: var(--jobs-menu-width-1080p);
  }
}
</style>
