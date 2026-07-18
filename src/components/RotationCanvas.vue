<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl } from '@/api/xivapi'
import { useGameDataStore } from '@/stores/gameData'
import { useRotationStore } from '@/stores/rotation'
import { useRotationLibraryStore } from '@/stores/rotationLibrary'
import GameActionTooltip from '@/components/GameActionTooltip.vue'
import type { GameAction, PlacedAction } from '@/domain/types'

const gameData = useGameDataStore()
const rotation = useRotationStore()
const library = useRotationLibraryStore()
const { t } = useI18n()

const snackbar = ref(false)
const snackbarText = ref('')
const confirmClear = ref(false)

function notify(message: string) {
  snackbarText.value = message
  snackbar.value = true
}

function requestClear() {
  if (rotation.isEmpty) {
    return
  }
  confirmClear.value = true
}

function confirmClearRotation() {
  rotation.clear()
  confirmClear.value = false
}

function save() {
  if (rotation.jobId == null) {
    notify(t('library.noJob'))
    return
  }
  library.save(rotation.toRotation())
  notify(t('library.saved'))
}

function iconUrl(actionId: number): string {
  const action = gameData.actionMap.get(actionId)
  return action?.iconPath ? assetUrl(action.iconPath) : ''
}

function actionOf(actionId: number): GameAction | undefined {
  return gameData.actionMap.get(actionId)
}

// Tooltip open-state is controlled so it can be forced shut on drag start
// (during an HTML5 drag `mouseleave` never fires, so it would linger).
const activeTip = ref<string | null>(null)

function setTip(instanceId: string, open: boolean) {
  if (open) {
    activeTip.value = instanceId
  } else if (activeTip.value === instanceId) {
    activeTip.value = null
  }
}

// --- Drag & drop --------------------------------------------------------------
// GCDs form columns left to right; each column has two fixed weave slots for
// oGCDs. Deleting an oGCD leaves its slot empty (a gap) and a newly dropped oGCD
// fills the first gap, so the others stay put and can be swapped or replaced.

const RESERVED_SOURCE = 'rotation'

type DragSource =
  | { kind: 'gcd'; stepId: string; placed: PlacedAction }
  | { kind: 'weave'; stepId: string; slot: number; placed: PlacedAction }
  | { kind: 'prepull'; placed: PlacedAction }

const dragSource = ref<DragSource | null>(null)
const droppedInside = ref(false)

function isReorder(event: DragEvent): boolean {
  return event.dataTransfer?.getData('source') === RESERVED_SOURCE
}

function pooledAction(event: DragEvent): GameAction | undefined {
  const actionId = Number(event.dataTransfer?.getData('text/plain'))
  return Number.isFinite(actionId) ? gameData.actionMap.get(actionId) : undefined
}

/** First empty weave slot across all columns (front to back), or null. */
function firstEmptySlot(): { stepId: string; slot: number } | null {
  for (const step of rotation.steps) {
    const slot = step.weaves.findIndex((weave) => weave === null)
    if (slot >= 0) {
      return { stepId: step.id, slot }
    }
  }
  return null
}

/** Remove the dragged oGCD from its origin, leaving `replacement` (may be null) behind. */
function clearSource(source: DragSource, replacement: PlacedAction | null) {
  if (source.kind === 'weave') {
    rotation.setWeave(source.stepId, source.slot, replacement)
  } else if (source.kind === 'prepull') {
    rotation.removePrePull(source.placed.instanceId)
    if (replacement) {
      rotation.addPrePullPlaced(replacement)
    }
  }
}

/** Move a dragged oGCD into a weave slot, swapping with whatever sits there. */
function moveOgcdToSlot(source: DragSource, stepId: string, slot: number) {
  if (source.kind === 'gcd') {
    return
  }
  if (source.kind === 'weave' && source.stepId === stepId && source.slot === slot) {
    return
  }
  const occupant = rotation.weaveAt(stepId, slot)
  rotation.setWeave(stepId, slot, source.placed)
  clearSource(source, occupant)
}

/** Move a dragged oGCD into the first free slot anywhere (used for loose drops). */
function moveOgcdToFirstGap(source: DragSource) {
  const target = firstEmptySlot()
  if (!target) {
    return
  }
  rotation.setWeave(target.stepId, target.slot, source.placed)
  clearSource(source, null)
}

function onDragStart(source: DragSource, event: DragEvent) {
  dragSource.value = source
  droppedInside.value = false
  activeTip.value = null
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('source', RESERVED_SOURCE)
    event.dataTransfer.setData('text/plain', String(source.placed.actionId))
  }
  // Accept drops anywhere so the browser skips its "snap back" animation; a
  // release outside the box then deletes immediately (see onWindowDrop).
  window.addEventListener('dragover', allowWindowDrop)
  window.addEventListener('drop', onWindowDrop)
}

function allowWindowDrop(event: DragEvent) {
  event.preventDefault()
}

function onWindowDrop(event: DragEvent) {
  event.preventDefault()
  if (!droppedInside.value) {
    deleteDragged()
  }
}

function onDragEnd() {
  window.removeEventListener('dragover', allowWindowDrop)
  window.removeEventListener('drop', onWindowDrop)
  dragSource.value = null
  droppedInside.value = false
}

/** Released outside the rotation box → remove the dragged action, keeping gaps. */
function deleteDragged() {
  const source = dragSource.value
  if (!source) {
    return
  }
  if (source.kind === 'gcd') {
    rotation.removeStep(source.stepId)
  } else if (source.kind === 'weave') {
    rotation.setWeave(source.stepId, source.slot, null)
  } else {
    rotation.removePrePull(source.placed.instanceId)
  }
}

function addPooled(action: GameAction) {
  if (action.type === 'gcd') {
    rotation.addGcd(action)
  } else {
    rotation.fillWeave(action)
  }
}

function onDropArea(event: DragEvent) {
  event.preventDefault()
  droppedInside.value = true
  if (isReorder(event)) {
    const source = dragSource.value
    if (source?.kind === 'gcd') {
      rotation.moveStepTo(source.stepId, '')
    } else if (source) {
      moveOgcdToFirstGap(source)
    }
    return
  }
  const action = pooledAction(event)
  if (action) {
    addPooled(action)
  }
}

function onDropGcd(stepId: string, event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  droppedInside.value = true
  const step = rotation.steps.find((entry) => entry.id === stepId)
  if (isReorder(event)) {
    const source = dragSource.value
    if (source?.kind === 'gcd') {
      rotation.moveStepTo(source.stepId, stepId)
    } else if (source) {
      const slot = step?.weaves.indexOf(null) ?? -1
      if (slot >= 0) {
        moveOgcdToSlot(source, stepId, slot)
      }
    }
    return
  }
  const action = pooledAction(event)
  if (!action) {
    return
  }
  // Dropping a GCD onto an empty overflow column fills its GCD (adopts the oGCDs).
  if (action.type === 'gcd' && step?.gcd === null) {
    rotation.setStepGcd(stepId, action)
  } else {
    addPooled(action)
  }
}

function onDropSlot(stepId: string, slot: number, event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  droppedInside.value = true
  if (isReorder(event)) {
    const source = dragSource.value
    if (source?.kind === 'gcd') {
      // A GCD dropped anywhere in a column reorders that whole column.
      rotation.moveStepTo(source.stepId, stepId)
    } else if (source) {
      moveOgcdToSlot(source, stepId, slot)
    }
    return
  }
  const action = pooledAction(event)
  if (!action) {
    return
  }
  // Dropped onto a specific empty slot → place it there; onto a taken slot →
  // fall back to the next fitting spot.
  if (action.type === 'ogcd' && rotation.weaveAt(stepId, slot) === null) {
    rotation.placeInSlot(stepId, slot, action)
  } else {
    addPooled(action)
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-end ga-2 mb-2">
      <v-text-field
        :model-value="rotation.name"
        :placeholder="t('library.namePlaceholder')"
        density="compact"
        variant="outlined"
        hide-details
        class="rotation-name"
        @update:model-value="rotation.setName"
      />
      <v-btn
        variant="tonal"
        color="primary"
        size="small"
        prepend-icon="mdi-content-save"
        :disabled="!rotation.name.trim()"
        @click="save"
      >
        {{ t('library.save') }}
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        size="small"
        prepend-icon="mdi-broom"
        :disabled="rotation.isEmpty"
        @click="requestClear"
      >
        {{ t('rotation.clear') }}
      </v-btn>
    </div>

    <div class="drop-area" @dragover.prevent @dragenter.prevent @drop="onDropArea">
      <div class="rotation-flow">
        <div v-if="rotation.prePull.length" class="gcd-group">
          <v-tooltip
            v-for="placed in rotation.prePull"
            :key="placed.instanceId"
            location="top"
            open-delay="80"
            content-class="skill-tooltip skill-tooltip-game"
            :model-value="activeTip === placed.instanceId"
            @update:model-value="(open) => setTip(placed.instanceId, open)"
          >
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="rota-icon ogcd"
                draggable="true"
                :aria-label="actionOf(placed.actionId)?.name"
                :style="{ backgroundImage: `url(${iconUrl(placed.actionId)})` }"
                @dragstart="onDragStart({ kind: 'prepull', placed }, $event)"
                @dragend="onDragEnd"
              />
            </template>
            <GameActionTooltip v-if="actionOf(placed.actionId)" :action="actionOf(placed.actionId)!" />
          </v-tooltip>
          <span class="gcd-group-marker" />
        </div>

        <div v-for="step in rotation.steps" :key="step.id" class="gcd-group">
          <v-tooltip
            v-if="step.gcd"
            location="top"
            open-delay="80"
            content-class="skill-tooltip skill-tooltip-game"
            :model-value="activeTip === step.gcd.instanceId"
            @update:model-value="(open) => setTip(step.gcd!.instanceId, open)"
          >
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="rota-icon gcd"
                draggable="true"
                :aria-label="actionOf(step.gcd!.actionId)?.name"
                :style="{ backgroundImage: `url(${iconUrl(step.gcd!.actionId)})` }"
                @dragstart="onDragStart({ kind: 'gcd', stepId: step.id, placed: step.gcd! }, $event)"
                @dragend="onDragEnd"
                @dragover.prevent
                @drop.stop="onDropGcd(step.id, $event)"
              />
            </template>
            <GameActionTooltip v-if="actionOf(step.gcd!.actionId)" :action="actionOf(step.gcd!.actionId)!" />
          </v-tooltip>
          <div
            v-else
            class="rota-gcd-slot"
            :aria-label="t('rotation.emptySlot')"
            @dragover.prevent
            @drop.stop="onDropGcd(step.id, $event)"
          />

          <template v-for="(weave, slot) in step.weaves" :key="slot">
            <v-tooltip
              v-if="weave"
              location="top"
              open-delay="80"
              content-class="skill-tooltip skill-tooltip-game"
              :model-value="activeTip === weave.instanceId"
              @update:model-value="(open) => setTip(weave!.instanceId, open)"
            >
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="rota-icon ogcd"
                  draggable="true"
                  :aria-label="actionOf(weave.actionId)?.name"
                  :style="{ backgroundImage: `url(${iconUrl(weave.actionId)})` }"
                  @dragstart="onDragStart({ kind: 'weave', stepId: step.id, slot, placed: weave }, $event)"
                  @dragend="onDragEnd"
                  @dragover.prevent
                  @drop.stop="onDropSlot(step.id, slot, $event)"
                />
              </template>
              <GameActionTooltip v-if="actionOf(weave.actionId)" :action="actionOf(weave.actionId)!" />
            </v-tooltip>
            <div
              v-else
              class="rota-slot"
              :aria-label="t('rotation.emptySlot')"
              @dragover.prevent
              @drop.stop="onDropSlot(step.id, slot, $event)"
            />
          </template>
          <span class="gcd-group-marker" />
        </div>
      </div>

      <div v-if="rotation.isEmpty" class="drop-hint text-medium-emphasis">
        {{ t('rotation.empty') }}
      </div>
    </div>

    <v-dialog v-model="confirmClear" max-width="420">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon icon="mdi-broom" color="error" />
          {{ t('rotation.clearConfirmTitle') }}
        </v-card-title>
        <v-card-text>{{ t('rotation.clearConfirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="confirmClear = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="tonal" @click="confirmClearRotation">
            {{ t('rotation.clear') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" timeout="2500">{{ snackbarText }}</v-snackbar>
  </div>
</template>

<style scoped>
.rotation-name {
  max-width: 220px;
}
.drop-area {
  border: 1px dashed var(--fx-panel-border);
  border-radius: var(--fx-panel-radius);
  padding: var(--fx-gap-md);
  min-height: 160px;
  transition: border-color var(--fx-duration-fast) var(--fx-ease);
}
.drop-area:hover {
  border-color: var(--fx-accent);
}
.rotation-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 14px 12px;
}
/* One GCD plus its two weave slots, bracketed together underneath. */
.gcd-group {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 3px;
  padding-bottom: 10px;
}
.gcd-group-marker {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  border: 2px solid var(--fx-panel-border);
  border-top: none;
  border-radius: 0 0 4px 4px;
}
.rota-icon {
  border: 3px solid #000;
  border-radius: 6px;
  background-color: #000;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: grab;
  transition:
    border-color var(--fx-duration-fast) var(--fx-ease),
    transform var(--fx-duration-fast) var(--fx-ease);
}
.rota-icon:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.06);
}
.rota-icon:active {
  cursor: grabbing;
}
/* GCDs are the large, baseline icons. */
.rota-icon.gcd {
  width: 64px;
  height: 64px;
}
/* oGCDs are smaller and sit raised above the GCD row. */
.rota-icon.ogcd {
  width: 40px;
  height: 40px;
  margin-top: -6px;
}
/* An empty weave slot: the gap a removed oGCD leaves behind. */
.rota-slot {
  width: 40px;
  height: 40px;
  margin-top: -6px;
  border: 2px dashed var(--fx-panel-border);
  border-radius: 6px;
  transition: border-color var(--fx-duration-fast) var(--fx-ease);
}
.rota-slot:hover {
  border-color: var(--fx-accent);
}
/* An empty GCD slot: an oGCD-overflow column with no GCD (weaving clips here). */
.rota-gcd-slot {
  width: 64px;
  height: 64px;
  border: 3px dashed var(--fx-panel-border);
  border-radius: 6px;
  transition: border-color var(--fx-duration-fast) var(--fx-ease);
}
.rota-gcd-slot:hover {
  border-color: var(--fx-accent);
}
.drop-hint {
  text-align: center;
  padding: var(--fx-gap-md);
}
</style>
