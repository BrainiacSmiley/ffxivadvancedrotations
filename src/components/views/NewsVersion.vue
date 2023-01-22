<script setup>
import allNews from "@/news";
import NewsVersionEntry from "@/components/news/NewsVersionEntry.vue";
</script>

<template>
  <div class="p-5">
    <h1>{{ $t("versionHistory") }}</h1>
    <div class="container-xxl justify-content-center align-content-center">
      <NewsVersionEntry :key="id" :entry="news" v-for="(news, id) in allNews" />
    </div>
  </div>
</template>

<style>
* {
  --news-margin-left: 10rem;
}
</style>
