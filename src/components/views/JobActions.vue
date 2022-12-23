<template>
  <div class="jobActions">
    <div class="jobActionsHeader">
      <Suspense>
        <template #default>
          <JobActionsHeader :job-id="jobId" />
        </template>
        <template #fallback>
          <JobActionsHeaderSkeleton />
        </template>
      </Suspense>
    </div>
    <div style="width: 100%; height: 100%"></div>
    <div class="jobActionsOverview">
      <Suspense>
        <template #default>
          <JobActionsGroups :job-id="jobId" />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
      <JobActionsTooltip />
    </div>
  </div>
  <!--  <div class="jobRotation">-->
  <!--    <fieldset class="actionGroup" style="min-height: 100px">-->
  <!--      <legend>{{ $t("rotation") }}</legend>-->
  <!--      <draggable-->
  <!--        v-model="jobActionsToDelete"-->
  <!--        :item-key="id"-->
  <!--        :group="{ name: 'actualRotation' }"-->
  <!--        @onStart="onDelete"-->
  <!--        @onAdd="onDelete"-->
  <!--        @onRemove="onDelete"-->
  <!--        @onUpdate="onDelete"-->
  <!--        @onEnd="onDelete"-->
  <!--        @onChoose="onDelete"-->
  <!--        @onUnchoose="onDelete"-->
  <!--        @onSort="onDelete"-->
  <!--        @onFilter="onDelete"-->
  <!--        @onClone="onDelete"-->
  <!--      >-->
  <!--        <template #header>-->
  <!--          <span-->
  <!--            class="material-symbols-outlined deleteRotationIcon"-->
  <!--            v-tooltip="$t('deleteActualRotation')"-->
  <!--            @click="deleteActualRotation"-->
  <!--          >-->
  <!--            delete-->
  <!--          </span>-->
  <!--        </template>-->
  <!--        <template #item="{ element }">-->
  <!--          <RotationActionIcon-->
  <!--            :id="element.id"-->
  <!--            :icon="element.icon"-->
  <!--            :name="element.name"-->
  <!--            :category="element.category"-->
  <!--            :position="element.position"-->
  <!--          ></RotationActionIcon>-->
  <!--        </template>-->
  <!--      </draggable>-->
  <!--      <div class="rotationActions">-->
  <!--        <draggable-->
  <!--          v-model="actualRotation"-->
  <!--          item-key="id"-->
  <!--          :sort="true"-->
  <!--          :group="{ name: 'actualRotation', put: true }"-->
  <!--        >-->
  <!--          <template #item="{ element }">-->
  <!--            <RotationActionIcon-->
  <!--              :id="element.id"-->
  <!--              :icon="element.icon"-->
  <!--              :name="element.name"-->
  <!--              :category="element.category"-->
  <!--            ></RotationActionIcon>-->
  <!--          </template>-->
  <!--        </draggable>-->
  <!--      </div>-->
  <!--    </fieldset>-->
  <!--  </div>-->
</template>

<script>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { getActionData } from "@/js/ffxiv/ffxivdata/ffxivactiondata";
import JobActionsHeader from "@/components/jobActions/JobActionsHeader.vue";
import JobActionsHeaderSkeleton from "@/components/jobActions/JobActionsHeaderSkeleton.vue";
import JobActionsGroups from "@/components/jobActions/JobActionsGroups.vue";
import JobActionsTooltip from "@/components/jobActions/JobActionsTooltip.vue";
import { setJobId } from "@/composables/jobId";
// import draggable from "vuedraggable";

export default {
  name: "job-actions",
  components: {
    JobActionsTooltip,
    JobActionsGroups,
    JobActionsHeader,
    JobActionsHeaderSkeleton,
    // draggable,
  },
  props: {
    locale: String,
    jobId: Number,
    rotation: String,
  },
  data() {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
      actualRotation: [],
      jobActionsToDelete: [],
    };
  },
  created() {
    this.storeJobId(this.jobId);
    //this.restoreSavedRotation(this.rotation);
  },
  methods: {
    storeJobId(jobId) {
      setJobId(jobId);
    },
    onDelete(evt) {
      console.log(evt);
      console.log(evt.from);
      // if (event.dataTransfer.getData("source") === "job") {
      //   return;
      // }
      // const actionId = Number.parseInt(
      //   event.dataTransfer.getData("actionId"),
      //   10
      // );
      // const position = Number.parseInt(
      //   event.dataTransfer.getData("position"),
      //   10
      // );
      // this.savedRotation = this.savedRotation.filter((action) => {
      //   return action.id !== actionId && action.position !== position;
      // });
      // this.reorganizeRotationPositions();
    },
    reorganizeRotationPositions() {
      if (this.savedRotation.length === 0) {
        return;
      }

      for (const [index, action] of Object.entries(this.savedRotation)) {
        action.position = Number.parseInt(index, 10) + 1;
      }
    },
    addSavedRotationToURoute() {
      const rotationToSave = [];
      for (const action of this.savedRotation) {
        rotationToSave.push(action.id);
      }
      const serializedSavedRotation = JSON.stringify(rotationToSave);
      const base64SavedRotations = btoa(serializedSavedRotation);
      const currentLocale = this.locale;
      const newURL = `/${currentLocale}/jobActions/${this.jobId}/${base64SavedRotations}`;
      this.$router["push"](newURL);
    },
    restoreSavedRotation(newBase64SavedRotations) {
      if (newBase64SavedRotations === "") {
        return;
      }

      const serializedSavedRotation = atob(newBase64SavedRotations);
      const rotationToRestore = JSON.parse(serializedSavedRotation);
      const restoredRotation = [];
      for (const actionId of rotationToRestore) {
        restoredRotation.push({
          id: actionId,
          position: restoredRotation.length + 1,
        });
      }
      this.savedRotation = restoredRotation;
    },
    deleteActualRotation() {
      this.actualRotation = [];
    },
  },
  watch: {
    jobId(newId) {
      this.storeJobId(newId);
    },
    savedRotation: {
      deep: true,
      handler(newRotation) {
        if (newRotation.length === 0) {
          this.actualRotation = [];
        }

        const actualRotation = [];
        for (const action of newRotation) {
          // eslint-disable-next-line vue/no-async-in-computed-properties
          getActionData(action.id).then((actionData) => {
            debugger;
            actualRotation.push({
              id: actionData.id,
              name: actionData[`name_${this.locale}`],
              icon: actionData.icon,
              gcd: actionData.cooldown_group === 58,
              position: actualRotation.length + 1,
            });
            this.actualRotation = actualRotation;
            this.addSavedRotationToURoute();
          });
        }
      },
    },
  },
};
</script>

<style scoped>
.jobActions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.jobActionsOverview {
  position: relative;
  bottom: 0;
  left: 50%;
  margin-left: -980px;
  width: 1960px;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr 440px;
  grid-template-rows: 1fr 135px;
  align-items: end;
  justify-self: flex-end;
  margin-bottom: 15px;
}

.jobRotation {
  width: 1944px;
  height: 100%;
  margin: auto;
}

.loadingActionsIndicatorBackground {
  background-color: black;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100000;
}

.rotationActions {
  width: calc(100% - 70px);
  min-height: 50px;
}

.rotationActions > div {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
}

.deleteRotationIcon {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 42px;
}

.deleteRotationIcon:hover {
  color: lightgray;
}
.deleteDropZone {
  height: 100%;
}

div:has(.deleteRotationIcon):not(.jobRotation) {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60px;
}
</style>
