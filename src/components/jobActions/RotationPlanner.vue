<script setup>
import RotationIcon from "@/components/jobActions/icons/RotationIcon.vue";
import SkeletonIcon from "@/components/jobActions/icons/SkeletonIcon.vue";
import { getCharacterLevel } from "@/composables/settings";
import { setTooltipId } from "@/composables/tooltipId";
import { getJobId } from "@/composables/jobId";
import { computedAsync, useEventBus } from "@vueuse/core";
import { getLocale } from "@/i18n";
import { computed, onMounted, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import { getItemData } from "@/js/ffxiv/ffxivdata/ffxivitemdata";
import { Tooltip } from "bootstrap";
import Data from "@/js/ffxiv/ffxivdata/Data";
import Sortable from "sortablejs";
import PredefinedRotationIcon from "@/components/jobActions/icons/PredefinedRotationIcon.vue";
import { getPredefinedRotations } from "@/js/ffxiv/predefinedRotations/ffxivpredefinedrotations";
import $ from "jquery";

const props = defineProps({
  savedRotation: {
    type: String,
    required: false,
    default: null,
  },
});

const eventBusRotationElementDropped = useEventBus("rotationElementDropped");
const eventBusJobIdChanged = useEventBus("jobIdChanged");
onMounted(() => {
  eventBusRotationElementDropped.on(deleteFromRotation);
  eventBusJobIdChanged.on(deleteActualRotation);
});

const draggedRotation = ref({});

const numberOfGCDS = ref(0);
const numberOfOGCDS = ref(0);
const numberOfUnusedOGCDS = ref(0);
const actualRotation = computedAsync(async () => {
  resetRotationValues();
  const rotationForPlanning = [];
  let newGroup = true;
  let groupHasGCD = false;
  let actualGroup = [];
  const actionsData = await Promise.all(
    draggedRotation.value.ids.map((element) =>
      getElementData(element.id, element.type).then((data) => new Data(data))
    )
  );
  draggedRotation.value.ids.forEach((element) => {
    const actualElement = actionsData.find(
      (data) => data.getId() === element.id
    );
    countRotationValues(actualElement);

    if (newGroup) {
      if (actualGroup.length > 0) {
        rotationForPlanning.push(actualGroup);
      }
      actualGroup = [];
      groupHasGCD = false;
    }
    if (
      (!groupHasGCD && actualElement.isGCDAction()) ||
      (!actualElement.isGCDAction() && actualGroup.length < 3)
    ) {
      if (!groupHasGCD && actualElement.isGCDAction()) {
        groupHasGCD = true;
      }
      actualGroup.push({
        id: element.id,
        type: element.type,
        position: element.position,
      });
      newGroup = false;
    } else if (groupHasGCD && actualElement.isGCDAction()) {
      rotationForPlanning.push(actualGroup);
      actualGroup = [];
      actualGroup.push({
        id: element.id,
        type: element.type,
        position: element.position,
      });
    }
    if (actualGroup.length === 3) {
      newGroup = true;
    }
  });
  if (actualGroup.length > 0) {
    rotationForPlanning.push(actualGroup);
  }
  return rotationForPlanning;
});

async function getElementData(id, type) {
  if (type === "action") {
    return await getActionData(id);
  } else if (type === "item") {
    return await getItemData(id);
  }
  return null;
}

function resetRotationValues() {
  numberOfGCDS.value = 0;
  numberOfOGCDS.value = 0;
  numberOfUnusedOGCDS.value = 0;
}

function countRotationValues(actualRotationElement) {
  if (actualRotationElement.isGCDAction()) {
    numberOfGCDS.value++;
  } else {
    numberOfOGCDS.value++;
  }
  numberOfUnusedOGCDS.value = numberOfGCDS.value * 2 - numberOfOGCDS.value;
}

const showInDevelopment = computed(() => {
  return import.meta.env.VITE_APP_DEBUG_VERBOSE === "true";
});

function dropToRotation(event) {
  event.preventDefault();
  event.stopPropagation();
  const from = event.dataTransfer.getData("source");
  if (from === "rotation") {
    return;
  }

  const newRotationItem = {
    type: event.dataTransfer.getData("type"),
    id: event.dataTransfer.getData("id") >> 0,
    position: draggedRotation.value.ids.length + 1,
  };
  draggedRotation.value.ids.push(newRotationItem);
  draggedRotation.value.jobId = getJobId();
  addSavedRotationToURoute();
}

function deleteFromRotation(event) {
  const position = event.dataTransfer.getData("position") >> 0;
  const id = event.dataTransfer.getData("id") >> 0;
  draggedRotation.value.ids.forEach((item, key) => {
    if (item.id === id && item.position === position) {
      draggedRotation.value.ids.splice(key, 1);
    }
  });
  restorePosition();
  setTooltipId(null);
  addSavedRotationToURoute();
}

function restorePosition() {
  let position = 1;
  draggedRotation.value.ids.forEach((item) => {
    item.position = position;
    position++;
  });
}

function deleteActualRotation(newJobId) {
  draggedRotation.value.ids = [];
  if (newJobId && newJobId !== draggedRotation.value.jobId) {
    draggedRotation.value.jobId = newJobId;
  }
  addSavedRotationToURoute();
}

const router = useRouter();

function addSavedRotationToURoute() {
  const locale = getLocale();
  const jobId = draggedRotation.value.jobId;
  let newURL = `/${locale}/jobActions/${jobId}`;
  if (draggedRotation.value.ids.length === 0) {
    router.push(newURL);
    return;
  }

  const rotationToSave = {
    lvl: getCharacterLevel(),
    jobId: jobId,
    ids: [],
  };
  for (const element of draggedRotation.value.ids) {
    rotationToSave.ids.push({ id: element.id, type: element.type });
  }
  const serializedSavedRotation = JSON.stringify(rotationToSave);
  const base64SavedRotations = btoa(serializedSavedRotation);
  newURL += `/${base64SavedRotations}`;
  router.push(newURL);
}

function initRotationSorting() {
  if (document.querySelectorAll(".skeletonIcon").length > 0) {
    return;
  }

  const gcdGroups = [].slice.call(document.querySelectorAll(".gcdGroup"));

  // Loop through each nested sortable element
  for (let i = 0; i < gcdGroups.length; i++) {
    new Sortable(gcdGroups[i], {
      group: "rotationElements",
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: convertSortedRotationBack,
    });
  }
}

function convertSortedRotationBack(evt) {
  Tooltip.getOrCreateInstance(evt.item).hide();
  const rotationElements = [].slice.call(
    document.querySelectorAll(".rotationIcon")
  );
  const newDraggedRotation = [];
  rotationElements.forEach((element) => {
    newDraggedRotation.push({
      id: element.id >> 0,
      type: element.dataset.rotationType,
      position: newDraggedRotation.length + 1,
    });
  });
  draggedRotation.value.ids = newDraggedRotation;
  addSavedRotationToURoute();
}

//rotation restore if provided
function restoreSavedRotation(newBase64SavedRotations) {
  const serializedSavedRotation = atob(newBase64SavedRotations);
  const rotationToRestore = JSON.parse(serializedSavedRotation);
  const restoredRotation = [];
  for (const action of rotationToRestore.ids) {
    restoredRotation.push({
      id: action.id,
      type: action.type,
      position: restoredRotation.length + 1,
    });
  }
  rotationToRestore.ids = restoredRotation;
  return rotationToRestore;
}

const { savedRotation } = toRefs(props);
if (savedRotation.value !== "") {
  draggedRotation.value = restoreSavedRotation(savedRotation.value);
}

function copyActualRotationPredefinedToClipboard() {
  const draggedRotationJSON = JSON.stringify(draggedRotation.value);
  navigator.clipboard.writeText(draggedRotationJSON);
  showAndAutoHideSuccessAlert();
}

function copyActualRotationToClipboard() {
  const actualRotation = window.location.href;
  navigator.clipboard.writeText(actualRotation);
  showAndAutoHideSuccessAlert();
}

const predefinedRotations = computed(() => {
  const jobId = getJobId();
  return getPredefinedRotations(jobId);
});

function loadPredefinedRotation(rotationId) {
  const jobId = getJobId();
  const predefinedRotations = getPredefinedRotations(jobId);
  draggedRotation.value = predefinedRotations
    .get(rotationId)
    .getDraggedRotation();
}

function showAndAutoHideSuccessAlert() {
  $("#copySuccessAlert").css({
    display: "flex",
    opacity: 100,
    top: 0,
  });
  setTimeout(() => {
    $("#copySuccessAlert").animate(
      {
        opacity: 0,
        top: "-=100",
      },
      2000
    );
  }, 2000);
}
</script>

<template>
  <fieldset class="actionGroup jobRotation">
    <legend>{{ $t("rotation") }}</legend>

    <!--suppress VueUnrecognizedDirective, AllyHtmlVueInspection -->
    <i
      id="deleteRotation"
      class="bi bi-trash-fill rotationUiActionIcon deleteRotationIcon"
      v-tooltip-popover
      data-bs-placement="top"
      :data-bs-title="$t('modal.deleteActualRotation')"
    />
    <div id="popoverHiddenElements" class="d-none">
      <div class="popover-header">
        {{ $t("modal.deleteActualRotation") }}
      </div>
      <div class="popover-body">
        <button class="btn btn-secondary mx-auto popover-cancel">
          {{ $t("modal.cancel") }}
        </button>
        <button
          id="deleteActualRotation"
          class="btn btn-primary mx-auto popover-ok"
          @click="deleteActualRotation(getJobId())"
        >
          {{ $t("modal.ok") }}
        </button>
      </div>
    </div>
    <div
      id="actualRotation"
      class="actions actualRotation"
      @drop="dropToRotation"
      @dragenter.prevent
      @dragover.prevent
    >
      <div class="gcdGroup" :key="group" v-for="group in actualRotation">
        <template :key="element.id" v-for="element in group">
          <Suspense @resolve="initRotationSorting">
            <template #default>
              <RotationIcon
                :id="element.id"
                :type="element.type"
                :position="element.position"
              />
            </template>
            <template #fallback>
              <SkeletonIcon :id="element.id" />
            </template>
          </Suspense>
        </template>
        <span class="gcdGroupMarker" />
      </div>
    </div>
  </fieldset>
  <fieldset class="actionGroup predefinedRotations">
    <legend>{{ $t("predefinedRotations") }}</legend>
    <div>
      <PredefinedRotationIcon
        :icon="rotation.getIcon()"
        :name="rotation.getName()"
        :rotation-id="key"
        :key="key"
        v-for="[key, rotation] in predefinedRotations"
        @click="loadPredefinedRotation(key)"
      />
    </div>
  </fieldset>
  <fieldset class="actionGroup rotationInfos">
    <legend>{{ $t("rotationInfos") }}</legend>
    <ul class="list-unstyled rotationValuesPosition">
      <li>
        <span class="rotationValues">{{ $t("#OfGcds") }}</span>
        {{ numberOfGCDS }}
      </li>
      <li>
        <span class="rotationValues">{{ $t("#OfOgcds") }}</span>
        {{ numberOfOGCDS }}
      </li>
      <li>
        <span class="rotationValues">{{ $t("#OfUnusedOgcds") }}</span>
        {{ numberOfUnusedOGCDS }}
      </li>
    </ul>
    <i
      id="copyRotation"
      class="bi bi-clipboard2 rotationUiActionIcon copyRotationIconPredefined"
      v-tooltip
      data-bs-placement="top"
      :data-bs-title="$t('modal.copyActualRotationPredefined')"
      @click="copyActualRotationPredefinedToClipboard"
      v-if="showInDevelopment"
    />
    <i
      id="copyRotation"
      class="bi bi-clipboard2 rotationUiActionIcon copyRotationIcon"
      v-tooltip
      data-bs-placement="top"
      :data-bs-title="$t('modal.copyActualRotation')"
      @click="copyActualRotationToClipboard"
    />
    <div
      id="copySuccessAlert"
      class="alert alert-light copy-success-alert"
      role="alert"
      style="display: none"
    >
      <i class="bi bi-check-circle-fill me-2" />
      <div>{{ $t("modal.copiedSuccessful") }}</div>
    </div>
  </fieldset>
</template>

<style scoped>
.jobRotation {
  width: 1468px;
  grid-column: 2 span;
  grid-row: 3 span;
  min-height: 100px;
  /*noinspection CssInvalidPropertyValue*/
  height: -webkit-fill-available;
}

legend {
  font-size: 32px;
  border-radius: 5px;
  width: auto;
  margin-left: 10px;
  margin-top: -32px;
  padding-left: 5px;
  padding-right: 6px;
  background-color: var(--bs-body-bg);
}

.actionGroup {
  border-radius: 5px;
  border: 2px solid var(--bs-gray);
  padding: revert;
  position: relative;
}

.actions {
  margin-top: 35px;
  height: inherit;
}

.actualRotation {
  padding: 0 10px;
}

.rotationUiActionIcon {
  position: absolute;
  font-size: 42px;
}

.rotationUiActionIcon:hover {
  color: lightgray;
}

.deleteRotationIcon {
  top: 5px;
  right: 5px;
}

.copyRotationIcon {
  bottom: 5px;
  right: 5px;
}

.copyRotationIconPredefined {
  bottom: 5px;
  right: 65px;
}

.gcdGroup {
  position: relative;
  display: inline-block;
  margin-right: 5px;
  min-width: 180px;
}

.gcdGroupMarker {
  position: absolute;
  left: 0;
  bottom: 5px;
  height: 10px;
  width: 100%;
  border: 2px solid var(--bs-gray);
  border-top: none;
}

.rotationInfos {
  position: relative;
  grid-column-start: 3;
  grid-row-start: 3;
  align-self: start;
  width: 470px;
  height: 150px;
  border: 2px solid var(--bs-gray);
}

.rotationValues {
  width: 140px;
  display: inline-block;
}

.rotationValuesPosition {
  position: absolute;
  left: 20px;
  bottom: 0;
}

.predefinedRotations {
  grid-column-start: 3;
  grid-row-start: 2;
  align-self: start;
  height: 130px;
}

.predefinedRotations > div {
  display: inline-block;
}

.copy-success-alert {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
</style>
