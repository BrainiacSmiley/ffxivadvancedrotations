<script setup>
const props = defineProps({
  rotationId: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: Object, required: true },
});
</script>

<template>
  <div
    :id="rotationId"
    :style="icon"
    :data-bs-title="name"
    v-tooltip
    class="predefinedRotationIcon"
  />
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.predefinedRotationIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: black;
  background-size: contain;
}

.predefinedRotationIcon:hover {
  border: solid var(--bs-primary) 3px;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .predefinedRotationIcon {
    transform: scale(0.6);
    margin-right: -18px;
    margin-top: -18px;
  }
}
</style>
