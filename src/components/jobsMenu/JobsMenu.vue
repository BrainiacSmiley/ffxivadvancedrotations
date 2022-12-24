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
  <div class="dbVersion">{{ $t("dbVersion") }} {{ FFXIVVERSION() }}</div>
</template>

<script>
import RoleGroup from "@/components/jobsMenu/RoleGroup.vue";
import { getAllMenuData } from "@/js/ffxivadvancedrotations";
import { FFXIVVERSION } from "@/js/ffxiv/ffxivconfigs";

export default {
  methods: {
    FFXIVVERSION() {
      return FFXIVVERSION;
    },
  },
  setup() {
    const menuData = getAllMenuData();

    return {
      menuData,
    };
  },
  name: "jobs-menu",
  components: {
    RoleGroup,
  },
};
</script>

<style scoped>
.jobMenu {
  width: 270px;
  height: 100%;
  line-height: 1;
  margin-left: 5px;
}

.dbVersion {
  position: absolute;
  bottom: 60px;
  left: 10px;
  color: gray;
}
</style>
