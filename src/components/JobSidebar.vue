<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import type { Job, JobRole } from '@/domain/types'
import tankIcon from '@/assets/roles/tank.png'
import healerIcon from '@/assets/roles/healer.png'
import meleeIcon from '@/assets/roles/melee.png'
import rangedIcon from '@/assets/roles/ranged.png'
import casterIcon from '@/assets/roles/caster.png'

const emit = defineEmits<{ select: [jobId: number] }>()
const gameData = useGameDataStore()
const { t } = useI18n()

// Borderless ("clear") FFXIV role icons, bundled locally. These are curated
// images with no in-game texture equivalent, so they ship as project assets.
const ROLE_ICON: Partial<Record<JobRole, string>> = {
  tank: tankIcon,
  healer: healerIcon,
  melee: meleeIcon,
  ranged: rangedIcon,
  caster: casterIcon,
}

function jobIcon(job: Job): string {
  return job.iconPath ? assetUrl(job.iconPath) : ''
}

function roleIcon(role: JobRole): string {
  return ROLE_ICON[role] ?? ''
}
</script>

<template>
  <div>
    <v-progress-linear v-if="gameData.loadingJobs" indeterminate />
    <v-list-group v-for="group in gameData.jobsByRole" :key="group.role" :value="group.role">
      <template #activator="{ props }">
        <v-list-item v-bind="props" class="role-header">
          <template #prepend>
            <v-avatar v-if="roleIcon(group.role)" size="24" rounded="0" color="transparent">
              <v-img :src="roleIcon(group.role)" :alt="t(`roles.${group.role}`)" />
            </v-avatar>
          </template>
          <span class="job-role">{{ t(`roles.${group.role}`) }}</span>
        </v-list-item>
      </template>
      <v-list-item
        v-for="job in group.jobs"
        :key="job.id"
        :active="job.id === gameData.selectedJobId"
        class="fx-job-entry job-entry"
        :class="{ 'is-active': job.id === gameData.selectedJobId }"
        @click="emit('select', job.id)"
      >
        <div class="job-row">
          <v-avatar v-if="jobIcon(job)" size="32" rounded="0" color="transparent" class="job-icon">
            <v-img :src="jobIcon(job)" :alt="job.name" />
          </v-avatar>
          <div class="job-text">
            <div class="job-name">{{ job.name }}</div>
            <div class="job-abbr text-medium-emphasis">{{ job.abbreviation }}</div>
          </div>
        </div>
        <div class="fx-job-line" />
      </v-list-item>
    </v-list-group>
    <v-alert
      v-if="!gameData.loadingJobs && gameData.jobs.length === 0"
      type="info"
      variant="tonal"
      class="ma-2"
    >
      {{ t('sidebar.empty') }}
    </v-alert>
  </div>
</template>

<style scoped>
.role-header {
  border-radius: 6px;
}
.job-role {
  font-size: 1.05rem;
  font-weight: 600;
  text-transform: none;
  opacity: 0.9;
}
.job-entry {
  padding-block: 6px;
  /* Align the job icon with the role name text (one indent step less than the
     default nested-group inset), so icons sit under the role label. */
  padding-inline-start: 48px !important;
}
.job-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.job-icon {
  flex: 0 0 auto;
}
.job-text {
  min-width: 0;
}
.job-name {
  font-size: 1.15rem;
  line-height: 1.15;
}
.job-abbr {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}
.fx-job-line {
  margin-top: 6px;
  margin-left: 42px;
  width: calc(60% - 42px);
}
</style>
