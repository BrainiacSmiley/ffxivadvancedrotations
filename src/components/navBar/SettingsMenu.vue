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
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          v-model="ffxivAdvancedRotationsStore.settings.replaceLeveledUpActions"
        />
        <label
          class="form-check-label"
          for="flexSwitchCheckDefault"
          style="
            background-color: #565e64;
            color: white;
            margin-top: -17px;
            margin-left: 10px;
          "
          id="flexSwitchCheckDefaultLabel"
        >
          {{ $t("settings.removeUpleveledActions") }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { useFFXIVAdvancedRotationsStore } from "@/stores/ffxivadvancedrotations";

export default {
  name: "SettingsMenu",
  data: function () {
    return {
      ffxivAdvancedRotationsStore: useFFXIVAdvancedRotationsStore(),
    };
  },
};
</script>

<style scoped></style>
