<script setup>
const props = defineProps({
  id: { type: Number, required: true }
});
</script>

<template>
  <div :id="id" class="skeletonIcon" />
</template>

<style scoped>
.skeletonIcon {
  width: 80px;
  height: 80px;
  transform: scale(0.8);
  border: solid black 3px;
  display: inline-block;
  background-color: lightgray;
  background-size: contain;
}

.skeletonIcon:hover {
  border: solid white 3px;
}
</style>
