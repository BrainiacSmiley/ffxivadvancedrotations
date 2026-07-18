<script setup lang="ts">
/**
 * "Rotations" box: lists the rotations saved for the currently selected job as
 * icon-only buttons with the name in a tooltip. Clicking one loads it; user
 * rotations show a delete badge on hover, predefined (config) ones do not. The
 * icon is the first step's GCD action (falls back to the rotation's initial).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import { useRotationStore } from '@/stores/rotation'
import { useRotationLibraryStore, type SavedRotation } from '@/stores/rotationLibrary'
import { useSettingsStore } from '@/stores/settings'

const gameData = useGameDataStore()
const rotation = useRotationStore()
const library = useRotationLibraryStore()
const settings = useSettingsStore()
const { t } = useI18n()

const savedRotations = computed(() =>
  rotation.jobId != null ? library.forJob(rotation.jobId) : [],
)

function iconOf(saved: SavedRotation): string {
  const firstStep = saved.rotation.steps[0]
  const firstActionId =
    firstStep?.gcd?.actionId ??
    firstStep?.weaves.find((weave) => weave)?.actionId ??
    saved.rotation.prePull[0]?.actionId
  const iconPath = firstActionId != null ? gameData.actionMap.get(firstActionId)?.iconPath : undefined
  return iconPath ? assetUrl(iconPath) : ''
}

async function load(saved: SavedRotation) {
  if (saved.rotation.jobId !== gameData.selectedJobId) {
    await gameData.selectJob(saved.rotation.jobId, settings.language)
  }
  rotation.loadRotation(saved.rotation)
}
</script>

<template>
  <div class="d-flex flex-wrap ga-2">
    <v-tooltip
      v-for="saved in savedRotations"
      :key="saved.encoded"
      location="top"
      :text="saved.name"
    >
      <template #activator="{ props }">
        <div v-bind="props" class="saved-rotation" @click="load(saved)">
          <div class="saved-rotation-icon">
            <v-img v-if="iconOf(saved)" :src="iconOf(saved)" :alt="saved.name" cover />
            <span v-else class="saved-rotation-fallback">{{ saved.name.charAt(0) }}</span>
          </div>
          <v-btn
            v-if="!saved.predefined"
            class="saved-rotation-remove"
            icon="mdi-close"
            size="x-small"
            variant="flat"
            color="error"
            :aria-label="t('library.delete')"
            @click.stop="library.remove(saved.rotation.jobId, saved.encoded)"
          />
        </div>
      </template>
    </v-tooltip>
    <span v-if="savedRotations.length === 0" class="text-body-2 text-medium-emphasis">
      {{ t('library.empty') }}
    </span>
  </div>
</template>

<style scoped>
.saved-rotation {
  position: relative;
  width: 48px;
  height: 48px;
  cursor: pointer;
}
.saved-rotation-icon {
  width: 100%;
  height: 100%;
  border: 2px solid #000;
  border-radius: 6px;
  overflow: hidden;
  background: #000;
  transition:
    transform var(--fx-duration-fast) var(--fx-ease),
    border-color var(--fx-duration-fast) var(--fx-ease),
    box-shadow var(--fx-duration-fast) var(--fx-ease);
}
.saved-rotation:hover .saved-rotation-icon {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
}
.saved-rotation-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #8a8a8a;
  font-size: 18px;
}
.saved-rotation-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity var(--fx-duration-fast) var(--fx-ease);
}
.saved-rotation:hover .saved-rotation-remove,
.saved-rotation-remove:focus-visible {
  opacity: 1;
}
</style>
