<script setup>
import { computed } from "vue";
import { getLocale, SUPPORTED_LOCALES } from "@/i18n";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const actualPath = computed(() => route.path);

const locales = computed(() => {
  return Object.keys(SUPPORTED_LOCALES).map((code) => ({
    code,
    name: SUPPORTED_LOCALES[code].name,
    flag: SUPPORTED_LOCALES[code].flag,
  }));
});

const actualFlag = computed(() => {
  const actualLocale = getLocale();
  const flagName = SUPPORTED_LOCALES[actualLocale].flag;
  return `flag-${flagName}`;
});

function isActiveLocale(localeToCheck) {
  return getLocale() === localeToCheck;
}

function selected(localeToCheck) {
    return isActiveLocale(localeToCheck) ? "active" : "";
}

function notSelected(localeToCheck) {
  return !isActiveLocale(localeToCheck) ? "d-none" : "";
}

function changeLocale(newLocale) {
  if (isActiveLocale(newLocale)) {
    return;
  }

  const currentPath = actualPath.value;
  const allLocalePattern = Object.keys(SUPPORTED_LOCALES).join("|");
  const localeRegex = new RegExp(`\\/([${allLocalePattern}]{2})`, "g");
  const newRoute = currentPath.replace(localeRegex, `/${newLocale}`);
  router.push(newRoute);
}
</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle navbar-button-with-icon" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="flag ms-2" :class="actualFlag" />
    </a>
    <ul class="dropdown-menu dropdown-menu-end">
      <template v-for="locale in locales" :key="locale.code">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" :class="selected(locale.code)" @click="changeLocale(locale.code)">
            <i class="flag me-3" :class="`flag-${locale.flag}`" />
            {{ locale.name }}
            <i class="bi bi-check2 ms-3" :class="notSelected(locale.code)" />
          </button>
        </li>
      </template>
    </ul>
  </li>
</template>


<style scoped></style>
