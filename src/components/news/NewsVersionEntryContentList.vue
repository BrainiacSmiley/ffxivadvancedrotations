<script setup>
const props = defineProps({
  contentName: { type: String, required: true },
  contentList: { type: Array, required: true },
});
</script>

<template>
  <div class="newsEntryList mt-4">
    <h3 class="contentName">{{ contentName }}</h3>
    <ul>
      <li :key="content.id" v-for="content in contentList">
        {{ content }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.newsEntryList {
  margin-left: var(--news-margin-left);
}

.contentName {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}
</style>
