<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { APP_VERSION, DATA_PATCH_VERSION } from '@/config/patch'
import { MAX_LEVEL, SUPPORTED_LANGUAGES, useSettingsStore } from '@/stores/settings'
import { gameNumber } from '@/utils/gameGlyphs'
import { useGameDataStore } from '@/stores/gameData'
import { useRotationStore } from '@/stores/rotation'
import { encodeRotation, readSharedRotationFromHash } from '@/utils/rotationShare'
import type { Rotation, SupportedLanguage } from '@/domain/types'
import JobSidebar from '@/components/JobSidebar.vue'
import FieldsetPanel from '@/components/FieldsetPanel.vue'
import PredefinedRotations from '@/components/PredefinedRotations.vue'

const settings = useSettingsStore()
const gameData = useGameDataStore()
const rotation = useRotationStore()
const theme = useTheme()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const drawer = ref(true)
const rightDrawer = ref(true)
const settingsOpen = ref(false)
const aboutOpen = ref(false)
// Which sidebar role group is expanded (open-strategy="single" allows one).
const openedGroups = ref<string[]>([])
// Rotation shared via the URL hash, applied once its job is selected on load.
const pendingShared = ref<Rotation | null>(readSharedRotationFromHash())
const languages = SUPPORTED_LANGUAGES
const patchVersion = DATA_PATCH_VERSION
const appVersion = APP_VERSION
const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
}
// flag-icons ISO 3166-1 alpha-2 code per UI language (en → gb flag).
const languageFlags: Record<SupportedLanguage, string> = {
  en: 'gb',
  de: 'de',
  fr: 'fr',
  ja: 'jp',
}
function applyTheme() {
  theme.change(settings.theme)
}

function isSupportedLang(value: unknown): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

function currentLang(): SupportedLanguage {
  return isSupportedLang(route.params.lang) ? route.params.lang : settings.language
}

/** Select the job named by the `:job` abbreviation in the URL (or clear it). */
async function applyJobFromRoute(jobParam: string | undefined) {
  if (!jobParam) {
    openedGroups.value = []
    if (gameData.selectedJobId !== null) {
      gameData.selectedJobId = null
      rotation.resetFor(null)
    }
    return
  }
  const abbreviation = jobParam.toUpperCase()
  const job = gameData.jobs.find((entry) => entry.abbreviation.toUpperCase() === abbreviation)
  if (!job) {
    return
  }
  // Expand the selected job's role group so it is visible on deep-link/reload.
  openedGroups.value = [job.role]
  if (job.id === gameData.selectedJobId) {
    // Same job still selected (e.g. after a language switch cleared the cache):
    // reload its actions but keep the current rotation intact.
    await gameData.ensureActions(job.id, settings.language)
    return
  }
  await gameData.selectJob(job.id, settings.language)
  if (pendingShared.value && pendingShared.value.jobId === job.id) {
    // A rotation was shared via the URL: load it instead of starting empty.
    rotation.loadRotation(pendingShared.value)
    // Consumed once; the hash stays in the URL so it remains the shareable link.
    pendingShared.value = null
  } else {
    rotation.resetFor(job.id)
  }
}

// The URL is the single source of truth. React to the language/job params here
// instead of mutating selection from click handlers, so there are no divergent
// side effects between the URL and the app state.
watch(
  () => [route.params.lang, route.params.job] as [string | undefined, string | undefined],
  async ([langParam, jobParam]) => {
    if (isSupportedLang(langParam)) {
      const languageChanged = langParam !== settings.language
      if (languageChanged) {
        settings.setLanguage(langParam)
        gameData.resetForLanguageChange()
      }
      locale.value = langParam
      if (languageChanged || gameData.jobs.length === 0) {
        await gameData.loadJobs(langParam)
      }
    }
    // Job selection belongs to the main view; other routes (e.g. the changelog)
    // leave the current job and its rotation untouched.
    if (route.name === 'main') {
      await applyJobFromRoute(jobParam)
    }
  },
  { immediate: true },
)

watch(() => settings.theme, applyTheme)

// Keep the URL hash in sync with the current rotation so the address bar is
// always a shareable link (updated live on every edit, not on a button click).
watch(
  () => (rotation.isEmpty ? '' : encodeRotation(rotation.toRotation())),
  (encoded) => {
    const base = `${location.pathname}${location.search}`
    history.replaceState(history.state, '', encoded ? `${base}#r=${encoded}` : base)
  },
)

onMounted(applyTheme)

function onSelectJob(jobId: number) {
  const job = gameData.jobs.find((entry) => entry.id === jobId)
  const abbreviation = job?.abbreviation.toLowerCase()
  if (!abbreviation || abbreviation === route.params.job) {
    return
  }
  router.push({ name: 'main', params: { lang: currentLang(), job: abbreviation } })
}

function changeLanguage(language: SupportedLanguage) {
  if (language === route.params.lang) {
    return
  }
  router.push({ name: 'main', params: { lang: language, job: route.params.job } })
}

// Toggle the changelog: open it, or (when already open) return to the main view
// keeping the currently selected job so the rotation stays in place.
function toggleChangelog() {
  if (route.name === 'changelog') {
    router.push({
      name: 'main',
      params: { lang: currentLang(), job: gameData.selectedJob?.abbreviation.toLowerCase() },
    })
  } else {
    router.push({ name: 'changelog', params: { lang: currentLang() } })
  }
}

function clearError() {
  gameData.error = null
}
</script>

<template>
  <v-app>
    <v-app-bar color="surface-bright" flat border="b" :height="56">
      <v-app-bar-nav-icon :icon="drawer ? 'mdi-menu-open' : 'mdi-menu'" @click="drawer = !drawer" />
      <v-app-bar-title>{{ t('app.title') }}</v-app-bar-title>
      <v-spacer />
      <v-btn
        :icon="rightDrawer ? 'mdi-bookmark-multiple' : 'mdi-bookmark-multiple-outline'"
        :title="t('appbar.rotations')"
        @click="rightDrawer = !rightDrawer"
      />
      <v-btn
        :icon="settings.theme === 'dark' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        :title="t('appbar.toggleTheme')"
        @click="settings.toggleTheme"
      />
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" :title="t('appbar.language')">
            <v-icon icon="mdi-translate" />
            <span class="fi lang-flag mx-2" :class="`fi-${languageFlags[settings.language]}`" />
            <v-icon icon="mdi-menu-down" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="lang in languages"
            :key="lang"
            :active="lang === settings.language"
            @click="changeLanguage(lang)"
          >
            <template #prepend>
              <span class="fi lang-flag mr-3" :class="`fi-${languageFlags[lang]}`" />
            </template>
            <v-list-item-title>{{ languageNames[lang] }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        icon="mdi-history"
        :active="route.name === 'changelog'"
        :title="t('appbar.changelog')"
        @click="toggleChangelog"
      />
      <v-btn icon="mdi-cog" :title="t('appbar.settings')" @click="settingsOpen = true" />
      <v-btn icon="mdi-information-outline" :title="t('appbar.about')" @click="aboutOpen = true" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="320" color="background">
      <v-list
        v-model:opened="openedGroups"
        density="compact"
        nav
        open-strategy="single"
        class="fx-scroll"
      >
        <JobSidebar @select="onSelectJob" />
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="rightDrawer" location="right" :width="360" color="background">
      <div class="right-stack fx-scroll">
        <FieldsetPanel :title="t('library.rotations')">
          <PredefinedRotations />
        </FieldsetPanel>
      </div>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-dialog v-model="settingsOpen" max-width="420">
      <v-card>
        <v-card-title>{{ t('settings.title') }}</v-card-title>
        <v-card-text>
          <v-switch
            :model-value="settings.replaceLeveledUpActions"
            :label="t('settings.replaceLeveledUpActions')"
            color="primary"
            density="compact"
            hide-details
            @update:model-value="(value) => settings.setReplaceLeveledUpActions(!!value)"
          />
          <v-switch
            :model-value="settings.removeNotLearnedActions"
            :label="t('settings.removeNotLearnedActions')"
            color="primary"
            density="compact"
            hide-details
            @update:model-value="(value) => settings.setRemoveNotLearnedActions(!!value)"
          />

          <v-divider class="my-2" />

          <div
            class="text-caption mb-1"
            :class="{ 'text-disabled': !settings.removeNotLearnedActions }"
          >
            {{ t('skills.levelFilter') }}:
            <span class="fx-glyph">{{ gameNumber(settings.levelFilter) }}</span>
          </div>
          <v-slider
            :model-value="settings.levelFilter"
            :min="1"
            :max="MAX_LEVEL"
            :step="1"
            density="compact"
            hide-details
            :disabled="!settings.removeNotLearnedActions"
            @update:model-value="settings.setLevelFilter"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="settingsOpen = false">{{ t('settings.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="aboutOpen" max-width="420">
      <v-card>
        <v-card-title>{{ t('appbar.about') }}</v-card-title>
        <v-card-text>
          <div class="text-h6 mb-1">{{ t('app.title') }}</div>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('about.version') }} {{ appVersion }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('about.dataPatch') }}: {{ patchVersion }}
          </div>

          <v-divider class="my-3" />

          <div class="text-caption text-medium-emphasis about-legal">
            FINAL FANTASY XIV © SQUARE ENIX CO., LTD. All Rights Reserved.<br />
            FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.<br />
            Game data, icons and imagery are trademarks and copyrights of Square Enix.<br />
            Unofficial fan-made tool — not affiliated with or endorsed by Square Enix.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="aboutOpen = false">{{ t('settings.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :model-value="!!gameData.error"
      color="error"
      timeout="5000"
      @update:model-value="clearError"
    >
      {{ gameData.error }}
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.lang-flag {
  font-size: 1.2rem;
  border-radius: 2px;
  line-height: 1;
}
.about-legal {
  line-height: 1.5;
}
.right-stack {
  display: flex;
  flex-direction: column;
  gap: var(--fx-gap-lg);
  padding: var(--fx-gap-md);
}
</style>
