<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ $t("siteName") }}</a>
    </div>
    <LocaleSwitcher></LocaleSwitcher>
    <SettingsMenu></SettingsMenu>
  </nav>
</template>

<script>
import LocaleSwitcher from "@/components/navBar/LocaleSwitcher.vue";
import SettingsMenu from "@/components/navBar/SettingsMenu.vue";

export default {
  name: "NavBar",
  components: { LocaleSwitcher, SettingsMenu },
};
</script>

<style scoped></style>
