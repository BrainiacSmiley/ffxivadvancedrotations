<!--suppress CssUnusedSymbol -->
<script setup>
import NavBar from "@/components/navBar/NavBar.vue";
import JobsMenu from "@/components/jobsMenu/JobsMenu.vue";
import { useEventBus } from "@vueuse/core";

const eventBusRotationElementDropped = useEventBus("rotationElementDropped");
function deleteFromRotation(event) {
  const from = event.dataTransfer.getData("source");
  if (from === "job") {
    return;
  }

  eventBusRotationElementDropped.emit(event);
}
</script>

<template>
  <NavBar />
  <div class="jobsMenu p-3">
    <JobsMenu />
  </div>
  <div class="routerPanel"  @drop="deleteFromRotation($event)"  @dragenter.prevent @dragover.prevent>
    <router-view />
  </div>
</template>

<style>
* {
  --jobs-menu-width: 320px;
  --navBar-height: 56px;
  --tooltip-width: 470px;
}

.ffxivadvancedrotation-black-tooltip {
  --bs-tooltip-bg: rgb(52, 58, 64);
  --bs-tooltip-color: rgb(173, 181, 189);
  --mdb-tooltip-font-size: 20px;
  --bs-tooltip-padding-x: 1rem;
  font-weight: 500;
}
.ffxivadvancedrotation-black-tooltip > .tooltip-inner {
  max-width: none;
}

.ffxivadvancedrotation-black-popover {
  --bs-popover-header-font-size: 20px;
}

.ffxivadvancedrotation-black-popover > .popover-body {
  display: flex;
  flex-wrap: inherit;
  align-items: center;
  justify-content: space-between;
}
</style>
<style scoped>
* {
  font-family: FFXIV, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  overflow: hidden;
}

.jobsMenu {
  position: absolute;
  top: var(--navBar-height);
  left: 0;
  width: var(--jobs-menu-width);
  height: calc(100% - var(--navBar-height));
  overflow: hidden auto;
}

.routerPanel {
  position: absolute;
  top: var(--navBar-height);
  left: var(--jobs-menu-width);
  width: calc(100% - var(--jobs-menu-width));
  height: calc(100% - var(--navBar-height));
}
</style>
