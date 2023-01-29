<script setup>
import SkeletonIcon from "@/components/jobActions/icons/SkeletonIcon.vue";
</script>

<template>
  <fieldset class="skeletonActionGroup fullGroupWidth">
    <legend class="skeletonLegend">&nbsp;</legend>
    <div class="skeletonActions">
      <SkeletonIcon :id="9" />
      <SkeletonIcon :id="15" />
    </div>
  </fieldset>
  <fieldset class="skeletonActionGroup halfGroupWidth">
    <legend class="skeletonLegend">&nbsp;</legend>
    <div class="skeletonActions">
      <SkeletonIcon :id="9" />
      <SkeletonIcon :id="15" />
    </div>
  </fieldset>
  <fieldset class="skeletonActionGroup halfGroupWidth">
    <legend class="skeletonLegend">&nbsp;</legend>
    <div class="skeletonActions">
      <SkeletonIcon :id="9" />
      <SkeletonIcon :id="15" />
    </div>
  </fieldset>
</template>

<style scoped>
.fullGroupWidth {
  width: 1468px;
  grid-column: 2 span;
}

.halfGroupWidth {
  width: 719px;
}

.skeletonLegend {
  font-size: 32px;
  border-radius: 5px;
  margin-left: 10px;
  margin-top: -32px;
  width: 100px;
  padding-left: 5px;
  padding-right: 6px;
  background-color: var(--bs-gray);
}

.skeletonActionGroup {
  border-radius: 5px;
  border: 2px solid var(--bs-gray);
  padding: revert;
}

.skeletonActions > div {
  display: inline-block;
}

.skeletonActions {
  min-height: 88px;
}

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .fullGroupWidth {
    width: calc(1600px - var(--tooltip-width) - 2rem);
  }

  .halfGroupWidth {
    width: calc((1600px - var(--tooltip-width) - 4rem) / 2);
  }

  legend {
    font-size: 24px;
    margin-top: -26px;
  }
}
</style>
