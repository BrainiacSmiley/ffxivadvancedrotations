<!--suppress CssUnusedSymbol -->
<script setup>
import LanguageSelector from "./LanguageSelector.vue";
import SettingsMenu from "@/components/navBar/SettingsMenu.vue";
import ThemeSelector from "@/components/navBar/ThemeSelector.vue";

const title = import.meta.env.VITE_APP_TITLE;
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ title }}</a>
      <form class="d-flex" role="search">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <LanguageSelector />
          <SettingsMenu />
          <ThemeSelector />
        </ul>
      </form>
    </div>
  </nav>
</template>

<style>
.navbar-button-with-icon {
  margin-right: 15px;
}

.navbar-button-with-icon > i.bi {
  font-size: 24px;
}

.navbar-button-with-icon > i.flag {
  transform: scale(2);
  margin-top: 12px;
}

.navbar-button-with-icon.dropdown-toggle::after {
  position: absolute;
  top: 18px;
  right: 5px;
}

.navbar-button-with-icon:has(> i) {
  padding: 0;
}
</style>
