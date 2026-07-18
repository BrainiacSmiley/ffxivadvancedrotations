<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CHANGELOG } from '@/config/changelog'

const { t, locale } = useI18n()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value)
}
</script>

<template>
  <div class="changelog fx-scroll">
    <h1 class="text-h4 mb-6">{{ t('changelog.title') }}</h1>

    <section v-for="entry in CHANGELOG" :key="entry.version" class="changelog-entry">
      <div class="changelog-head">
        <span class="text-h5 font-weight-medium">{{ entry.version }}</span>
        <span class="text-body-2 text-medium-emphasis">{{ formatDate(entry.date) }}</span>
      </div>
      <div v-for="section in entry.sections" :key="section.title" class="changelog-section">
        <h2 class="text-subtitle-1 font-weight-bold mb-1">{{ section.title }}</h2>
        <ul class="changelog-list">
          <li v-for="(item, index) in section.items" :key="index">{{ item }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.changelog {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--fx-gap-lg);
  height: 100%;
  overflow-y: auto;
}
.changelog-entry {
  margin-bottom: var(--fx-gap-lg);
}
.changelog-head {
  display: flex;
  align-items: baseline;
  gap: var(--fx-gap-md);
  padding-bottom: var(--fx-gap-sm);
  border-bottom: 1px solid var(--fx-panel-border);
}
.changelog-section {
  margin-top: var(--fx-gap-md);
}
.changelog-list {
  padding-left: 1.4rem;
  line-height: 1.75;
}
</style>
