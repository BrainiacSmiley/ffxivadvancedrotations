<template>
  <div class="dropdown me-2">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="locales"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ $t("language.buttonLabel") }}
    </button>
    <div
      class="dropdown-menu dropdown-menu-end"
      aria-labelledby="locales"
      style="background-color: #565e64"
    >
      <template v-for="locale in locales" :key="locale.code">
        <div class="localeEntry" @click="onLocaleChange(locale.code)">
          <div class="dropdown-item localeEntry">
            <i class="flag" :class="`flag-${locale.flag}`"></i>{{ locale.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { SUPPORTED_LOCALES } from "@/i18n";

export default {
  name: "LocaleSwitcher",
  methods: {
    onLocaleChange(newLocale) {
      if (newLocale === this.$i18n.locale) {
        return;
      }

      const currentPath = this.$route.path;
      const allLocalePattern = Object.keys(SUPPORTED_LOCALES).join("|");
      const localeRegex = new RegExp(`\\/([${allLocalePattern}]{2})`, "g");
      const newRoute = currentPath.replace(localeRegex, `/${newLocale}`);
      this.$router.push(newRoute);
    },
  },
  computed: {
    locales() {
      return Object.keys(SUPPORTED_LOCALES).map((code) => ({
        code,
        name: SUPPORTED_LOCALES[code].name,
        flag: SUPPORTED_LOCALES[code].flag,
      }));
    },
  },
};
</script>

<style scoped>
.localeEntry {
  background-color: #565e64;
  color: #ccd4de;
}
.localeEntry:hover {
  background-color: #ccd4de;
  color: #565e64;
}
</style>
