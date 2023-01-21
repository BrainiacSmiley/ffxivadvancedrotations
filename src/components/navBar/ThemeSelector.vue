<script setup>
import { computed, onMounted, ref } from "vue";

const themes = [
  { name: "light",  icon: "sun-fill" },
  { name: "dark",  icon: "moon-stars-fill" },
  { name: "auto",  icon: "circle-half" },
];

let actualTheme = ref(localStorage.getItem("theme") || "dark");
const actualThemeIcon = computed(() => {
  const iconName = themes.find((theme) => theme.name === actualTheme.value).icon;
  return `bi-${iconName}`;
});

function getPreferredTheme() {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "auto") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  }
  return storedTheme;
}

function isActiveTheme(themeToCheck) {
  return themeToCheck === actualTheme.value;
}

function selected(themeToCheck) {
  return isActiveTheme(themeToCheck) ? "active" : "";
}

function notSelected(themeToCheck) {
  return !isActiveTheme(themeToCheck) ? "d-none" : "";
}

function changeTheme(newTheme) {
  if (isActiveTheme(newTheme)) {
    return;
  }

  localStorage.setItem("theme", newTheme);
  actualTheme.value = newTheme;
  setThemeInDom();
}

function setThemeInDom() {
  const theme = getPreferredTheme();
  document.documentElement.setAttribute("data-bs-theme", theme);
}

onMounted(() => {
  setThemeInDom();
});
</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle navbar-button-with-icon" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi theme-icon-active" :class="actualThemeIcon" />
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme" style="--bs-dropdown-min-width: 8rem;">
      <template v-for="theme in themes" :key="theme.name">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" :class="selected(theme.name)" @click="changeTheme(theme.name)">
            <i class="bi me-2" :class="`bi-${theme.icon}`"/>
            {{ /* eslint-disable @intlify/vue-i18n/no-dynamic-keys */ $t(`theme.${theme.name}`) }}
            <i class="bi bi-check2 ms-2" :class="notSelected(theme.name) "/>
          </button>
        </li>
      </template>
    </ul>
  </li>
</template>

<style scoped></style>
