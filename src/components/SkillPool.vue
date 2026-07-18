<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import { useSettingsStore } from '@/stores/settings'
import GameActionTooltip from '@/components/GameActionTooltip.vue'
import type { GameAction } from '@/domain/types'

const gameData = useGameDataStore()
const settings = useSettingsStore()
const { t } = useI18n()
const filtered = computed<GameAction[]>(() =>
  gameData.selectedActions.filter(
    (action) => !settings.removeNotLearnedActions || action.level <= settings.levelFilter,
  ),
)

// The tooltip is hover-driven, but during an HTML5 drag `mouseleave` never
// fires, so it would stay open and cover the drop zones. Take control of the
// open state and force it closed when a drag begins.
const activeTip = ref<number | null>(null)

function setTip(id: number, open: boolean) {
  if (open) {
    activeTip.value = id
  } else if (activeTip.value === id) {
    activeTip.value = null
  }
}

function onDragStart(event: DragEvent, action: GameAction) {
  activeTip.value = null
  event.dataTransfer?.setData('text/plain', String(action.id))
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}

function icon(action: GameAction): string {
  return action.iconPath ? assetUrl(action.iconPath) : ''
}
</script>

<template>
  <div>
    <v-progress-linear v-if="gameData.loadingActions" indeterminate class="mb-2" />

    <div v-if="gameData.selectedJobId == null" class="text-medium-emphasis">
      {{ t('skills.selectJob') }}
    </div>
    <div v-else-if="!gameData.loadingActions && filtered.length === 0" class="text-medium-emphasis">
      {{ t('skills.empty') }}
    </div>
    <div v-else class="skill-grid">
      <v-tooltip
        v-for="action in filtered"
        :key="action.id"
        location="top"
        open-delay="80"
        content-class="skill-tooltip skill-tooltip-game"
        :model-value="activeTip === action.id"
        @update:model-value="(open) => setTip(action.id, open)"
      >
        <template #activator="{ props }">
          <div
            v-bind="props"
            class="skill-icon"
            :class="action.type"
            draggable="true"
            @dragstart="onDragStart($event, action)"
          >
            <v-img v-if="icon(action)" :src="icon(action)" :alt="action.name" cover />
            <span class="skill-icon-fallback" v-else>{{ action.name.charAt(0) }}</span>
            <v-icon v-if="action.type === 'gcd'" class="skill-gcd-marker" size="15">
              mdi-clock-outline
            </v-icon>
          </div>
        </template>

        <GameActionTooltip :action="action" />
      </v-tooltip>
    </div>
  </div>
</template>

<style scoped>
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 56px);
  gap: 10px;
}
.skill-icon {
  position: relative;
  width: 56px;
  height: 56px;
  border: 2px solid #000;
  border-radius: 6px;
  overflow: hidden;
  cursor: grab;
  background: #000;
  transition:
    transform var(--fx-duration-fast) var(--fx-ease),
    border-color var(--fx-duration-fast) var(--fx-ease),
    box-shadow var(--fx-duration-fast) var(--fx-ease);
}
.skill-icon:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
  z-index: 1;
}
.skill-icon:active {
  cursor: grabbing;
}
/* Type accent strip along the bottom edge (GCD vs oGCD at a glance). */
.skill-icon::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
}
.skill-icon.gcd::after {
  background: rgb(var(--v-theme-primary));
}
.skill-icon.ogcd::after {
  background: rgb(var(--v-theme-info));
}
.skill-icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #8a8a8a;
  font-size: 20px;
}
.skill-gcd-marker {
  position: absolute;
  bottom: 3px;
  left: 2px;
  color: #fff;
  filter: drop-shadow(0 0 2px #000);
}
</style>
