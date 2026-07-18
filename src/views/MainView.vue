<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import { MAX_LEVEL, useSettingsStore } from '@/stores/settings'
import { gameLevel } from '@/utils/gameGlyphs'
import SkillPool from '@/components/SkillPool.vue'
import RotationCanvas from '@/components/RotationCanvas.vue'
import FieldsetPanel from '@/components/FieldsetPanel.vue'

const gameData = useGameDataStore()
const settings = useSettingsStore()
const { t } = useI18n()

const jobIcon = computed(() =>
  gameData.selectedJob?.iconPath ? assetUrl(gameData.selectedJob.iconPath) : '',
)
const isMaxLevel = computed(() => settings.levelFilter >= MAX_LEVEL)
</script>

<template>
  <v-container fluid class="fx-stack">
    <header v-if="gameData.selectedJob" class="job-header">
      <v-avatar v-if="jobIcon" size="40" rounded="0" color="transparent">
        <v-img :src="jobIcon" :alt="gameData.selectedJob.name" />
      </v-avatar>
      <h1 class="job-header-name">{{ gameData.selectedJob.name }}</h1>
      <span class="job-header-level">
        <template v-if="isMaxLevel">{{ t('common.maxLevel') }}</template>
        <span v-else class="fx-glyph">{{ gameLevel(settings.levelFilter) }}</span>
      </span>
    </header>

    <FieldsetPanel :title="t('skills.title')">
      <SkillPool />
    </FieldsetPanel>
    <FieldsetPanel :title="t('rotation.title')">
      <RotationCanvas />
    </FieldsetPanel>
  </v-container>
</template>

<style scoped>
.fx-stack {
  display: flex;
  flex-direction: column;
  gap: var(--fx-gap-lg);
  max-width: 1600px;
}
.job-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: calc(var(--fx-gap-md) * -1 + 4px);
}
.job-header-name {
  font-size: 1.9rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.01em;
}
.job-header-level {
  font-size: 1.5rem;
  color: rgb(var(--v-theme-primary));
}
.job-header-level::before {
  content: '(';
}
.job-header-level::after {
  content: ')';
}
/* Cancel the FFXIV glyph's trailing letter-spacing so ")" sits flush. */
.job-header-level .fx-glyph {
  margin-inline-end: -0.06em;
}
</style>
