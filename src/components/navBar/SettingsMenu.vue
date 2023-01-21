<script setup>
import { computed, ref } from "vue";
import { FFXIVMAXLVL } from "@/js/ffxiv/ffxivconfigs";
import { getCharacterLevel, setCharacterLevel } from "@/composables/settings";
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

const ffxivAdvancedRotationsStore = computed(() =>
  useFFXIVAdvancedRotationsStore()
);
const actualLevel = ref(getCharacterLevel());

function handleChange(event) {
  setCharacterLevel(event.target.value);
}
</script>

<template>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle navbar-button-with-icon"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="bi bi-gear" />
    </a>
    <ul class="dropdown-menu p-2 dropdown-menu-end">
      <li>
        <div class="form-check form-switch checkBoxInMenu">
          <input
            class="form-check-input checkBoxSettings"
            type="checkbox"
            id="replaceLeveledUpActions"
            v-model="
              ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions
            "
          />
          <label
            class="form-check-label checkSettingsDescription"
            for="replaceLeveledUpActions"
            id="replaceLeveledUpActionsLabel"
            >{{ $t("settings.removeUpleveledActions") }}</label
          >
        </div>
      </li>
      <li>
        <div class="form-check form-switch checkBoxInMenu">
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
            >{{ $t("settings.sortActionsByAcquiredLevel") }}</label
          >
        </div>
      </li>
      <li>
        <div class="form-check form-switch checkBoxInMenu">
          <input
            class="form-check-input checkBoxSettings"
            type="checkbox"
            id="removeNotLearnedActions"
            v-model="
              ffxivAdvancedRotationsStore.settings.removeNotLearnedActions
            "
          />
          <label
            class="form-check-label checkSettingsDescription"
            for="removeNotLearnedActions"
            id="removeNotLearnedActionsLabel"
            >{{ $t("settings.removeNotLearnedActions") }}</label
          >
        </div>
      </li>
      <li>
        <hr class="dropdown-divider" style="margin: 0.5rem -0.5rem" />
      </li>
      <li>
        <div>
          <label for="levelChanger" class="checkSettingsSliderDescription">{{
            $t("settings.characterLevel")
          }}</label>
          <input
            type="range"
            class="checkSettingsSlider"
            min="1"
            :max="FFXIVMAXLVL"
            step="1"
            id="levelChanger"
            v-model="actualLevel"
            @change="handleChange($event)"
          />
          <span class="checkSettingsSliderValue">{{ actualLevel }}</span>
        </div>
      </li>
    </ul>
  </li>
</template>

<style scoped>
.checkSettingsDescription {
  margin-left: 10px;
  width: 300px;
}

.checkSettingsSliderDescription {
  width: 100%;
  text-align: center;
}

.checkSettingsSlider {
  width: 89%;
}

.checkSettingsSliderValue {
  width: 10%;
  font-size: 20px;
  margin-left: 10px;
}
</style>
