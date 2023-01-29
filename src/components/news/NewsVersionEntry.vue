<script setup>
import NewsVersionEntryContentList from "@/components/news/NewsVersionEntryContentList.vue";
import { toRefs } from "vue";

const props = defineProps({
  entry: { type: Map, required: true },
});

const { entry } = toRefs(props);
</script>

<template>
  <h2 class="header">
    <span class="newsHeader">{{
      $t("newsHeader", [
        entry.get("version"),
        entry.get("date").toLocaleDateString(),
      ])
    }}</span>
  </h2>
  <NewsVersionEntryContentList
    :content-list="entries"
    :content-name="name"
    :key="name"
    v-for="[name, entries] in entry.get('content')"
  />
</template>

<style scoped>
.header {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid var(--bs-gray);
}

.newsHeader {
  margin-left: var(--news-margin-left);
}

.header ~ .header {
  margin-top: 3rem;
}
</style>
