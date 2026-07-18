<script setup lang="ts">
/**
 * FFXIV in-game style tooltip for a single action, shared by the skill pool and
 * the rotation icons. Renders only the tooltip body; the caller supplies the
 * `v-tooltip` wrapper. Styles live globally in `src/styles/global.css`.
 */
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import { gameLevel } from '@/utils/gameGlyphs'
import type { GameAction } from '@/domain/types'

const props = defineProps<{ action: GameAction }>()

const gameData = useGameDataStore()
const { t } = useI18n()

const MP_COST_TYPE = 3

const iconSrc = () => (props.action.iconPath ? assetUrl(props.action.iconPath) : '')

/** Format a 100ms-unit duration as seconds, e.g. 25 -> "2.5s". */
function seconds(value100ms: number): string {
  return `${(value100ms / 10).toLocaleString(undefined, { maximumFractionDigits: 2 })}s`
}

function castText(action: GameAction): string {
  return action.cast100ms > 0 ? seconds(action.cast100ms) : t('skills.instant')
}

function recastText(action: GameAction): string {
  return action.recast100ms > 0 ? seconds(action.recast100ms) : '—'
}

/**
 * Actual MP cost. XIVAPI stores a scaled raw value; the multiplier is job-role
 * specific (PLD ×50, healers/casters ×100), matching the reference project.
 */
function mpCost(action: GameAction): number {
  if (action.costType !== MP_COST_TYPE || action.costValue <= 0) {
    return 0
  }
  const job = gameData.selectedJob
  let multiplier = 1
  if (job?.abbreviation === 'PLD') {
    multiplier = 50
  } else if (job?.role === 'healer' || job?.role === 'caster') {
    multiplier = 100
  }
  return action.costValue * multiplier
}

function costText(action: GameAction): string {
  const mp = mpCost(action)
  return mp > 0 ? `${mp.toLocaleString()} MP` : ''
}
</script>

<template>
  <!-- FFXIV game tooltip styling (ported 1:1 from the reference project). -->
  <div class="game-tip">
    <div class="game-tip-icon">
      <v-img v-if="iconSrc()" :src="iconSrc()" :alt="action.name" />
    </div>
    <div class="game-tip-name">{{ action.name }}</div>
    <div class="game-tip-category">{{ action.category }}</div>
    <div v-if="action.range > 0 || action.radius > 0" class="game-tip-rangeradius">
      <div>
        <span class="game-tip-muted">{{ t('skills.range') }}</span><span>{{ action.range }}y</span>
      </div>
      <div>
        <span class="game-tip-muted">{{ t('skills.radius') }}</span><span>{{ action.radius }}y</span>
      </div>
    </div>
    <div class="game-tip-crc">
      <div class="game-tip-crc-item">
        <div class="game-tip-crc-name">{{ t('skills.cast') }}</div>
        <div class="game-tip-crc-value">{{ castText(action) }}</div>
        <div class="game-tip-crc-bar" />
      </div>
      <div class="game-tip-crc-item">
        <div class="game-tip-crc-name">{{ t('skills.recast') }}</div>
        <div class="game-tip-crc-value">{{ recastText(action) }}</div>
        <div class="game-tip-crc-bar" />
      </div>
      <div v-if="costText(action)" class="game-tip-crc-item">
        <div class="game-tip-crc-name">{{ t('skills.cost') }}</div>
        <div class="game-tip-crc-value">{{ costText(action) }}</div>
        <div class="game-tip-crc-bar" />
      </div>
    </div>
    <div v-if="action.description" class="game-tip-desc">{{ action.description }}</div>
    <div class="game-tip-acquired">
      <span class="game-tip-label">{{ t('skills.acquired') }}</span>
      <span class="fx-glyph">{{ gameLevel(action.level) }}</span>
    </div>
    <div v-if="action.affinity" class="game-tip-affinity">
      <span class="game-tip-label">{{ t('skills.affinity') }}</span>
      <span>{{ action.affinity }}</span>
    </div>
  </div>
</template>
