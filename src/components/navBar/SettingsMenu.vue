<template>
  <div class="dropdown me-2">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="settings"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ $t("settings.buttonLabel") }}
    </button>
    <div
      class="dropdown-menu dropdown-menu-end p-2"
      aria-labelledby="settings"
      style="background-color: #565e64"
    >
      <div class="form-check form-switch" style="background-color: #565e64">
        <input
          class="form-check-input checkBoxSettings"
          type="checkbox"
          id="replaceLeveledUpActions"
          v-model="ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions"
        />
        <label
          class="form-check-label checkSettingsDescription"
          for="replaceLeveledUpActions"
          id="replaceLeveledUpActionsLabel"
        >
          {{ $t("settings.removeUpleveledActions") }}
        </label>
      </div>
      <div class="form-check form-switch" style="background-color: #565e64">
        <input
          class="form-check-input checkBoxSettings"
          type="checkbox"
          id="sortActionsByAcquiredLevel"
          v-model="
            ffxivAdvancedRotationsStore.settings.sortActionsByAcquiredLevel
          "
        />
        <label
          class="form-check-label checkSettingsDescription"
          for="sortActionsByAcquiredLevel"
          id="sortActionsByAcquiredLevelLabel"
        >
          {{ $t("settings.sortActionsByAcquiredLevel") }}
        </label>
      </div>
      <div class="form-check form-switch" style="background-color: #565e64">
        <input
          class="form-check-input checkBoxSettings"
          type="checkbox"
          id="removeNotLearnedActions"
          v-model="ffxivAdvancedRotationsStore.settings.removeNotLearnedActions"
        />
        <label
          class="form-check-label checkSettingsDescription"
          for="removeNotLearnedActions"
          id="removeNotLearnedActionsLabel"
        >
          {{ $t("settings.removeNotLearnedActions") }}
        </label>
      </div>
      <div style="background-color: #565e64">
        <label for="levelChanger" class="checkSettingsSliderDescription">
          {{ $t("settings.characterLevel") }}
        </label>
        <input
          type="range"
          class="checkSettingsSlider"
          :min="1"
          :max="FFXIVMAXLVL()"
          step="1"
          id="levelChanger"
          v-model="actualLevel"
          @change="handleChange($event)"
        />
        <span class="checkSettingsSliderValue">{{ actualLevel }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";
import { getCharacterLevel, setCharacterLevel } from "@/composables/settings";

export default {
  name: "SettingsMenu",
  methods: {
    FFXIVMAXLVL() {
      return FFXIVMAXLVL;
    },
    handleChange(event) {
      setCharacterLevel(event.target.value);
    },
  },
  data: function () {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
      actualLevel: getCharacterLevel(),
    };
  },
};
</script>

<style scoped>
.checkBoxSettings {
  margin-bottom: -17px;
}

.checkSettingsDescription {
  background-color: #565e64;
  color: white;
  margin-left: 10px;
  width: 250px;
}

.checkSettingsSliderDescription {
  background-color: #565e64;
  color: white;
  width: 100%;
  text-align: center;
}

.checkSettingsSlider {
  background-color: #565e64;
  color: white;
  width: 89%;
}

.checkSettingsSliderValue {
  background-color: #565e64;
  color: white;
  width: 10%;
  font-size: 20px;
  margin-left: 10px;
}
</style>
