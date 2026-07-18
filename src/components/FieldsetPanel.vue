<script setup lang="ts">
/**
 * Bordered content panel using a real <fieldset>/<legend>: the browser natively
 * interrupts the border around the legend (a true gap), no background masking.
 * Structural styling lives in global.css (.fx-panel / .fx-legend).
 */
defineProps<{ title: string }>()
</script>

<template>
  <fieldset class="fx-panel">
    <legend class="fx-legend text-primary">{{ title }}</legend>
    <slot />
  </fieldset>
</template>
