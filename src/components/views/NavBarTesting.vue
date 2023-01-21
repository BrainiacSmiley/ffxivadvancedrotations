<!--suppress AllyHtmlVueInspection -->
<template>
  <div>Locale: {{ actualLocale }}</div>
  <div>remove upleveled replaced actions: {{ actualReplaceLeveledUpActions }}</div>
  <div>sort actions by acquired level ascending: {{ actualSortByAcquiredLevel }}</div>
  <div>remove not learned actions: {{ actualRemoveNotLearned }}</div>
  <div>actual char level: {{ actualCharacterLevel }}</div>
</template>

<script setup>
import { getLocale } from "@/i18n";
import { computed } from "vue";
import {
  getReplaceLeveledUpActions,
  getCharacterLevel,
  getRemoveNotLearnedActions,
  getSortActionsByAcquiredLevel
} from "@/composables/settings";

// const store = useFFXIVAdvancedRotationsStore();
const actualLocale = computed(() => getLocale());
const actualReplaceLeveledUpActions = computed(() => getReplaceLeveledUpActions());
const actualSortByAcquiredLevel = computed(() => getSortActionsByAcquiredLevel());
const actualRemoveNotLearned = computed(() => getRemoveNotLearnedActions());
const actualCharacterLevel = computed(() => getCharacterLevel());
</script>

<style scoped></style>
