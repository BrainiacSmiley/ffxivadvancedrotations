import { createI18n } from "vue-i18n";
import en from "@/i18n/translations/en.json";
// import de from "@/i18n/translations/de.json";
// import fr from "@/i18n/translations/fr.json";
// import ja from "@/i18n/translations/ja.json";

const SUPPORTED_LOCALES = {
  ja: { name: "日本語", flag: "japan" },
  en: { name: "English", flag: "united-kingdom" },
  fr: { name: "Français", flag: "france" },
  de: { name: "Deutsch", flag: "germany" },
};
const DEFAULT_LOCALE = "en";

const messages = {};
messages[DEFAULT_LOCALE] = en;
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  availableLocales: [DEFAULT_LOCALE],
  messages: messages,
});

async function setLocale(locale) {
  // Load locale if not available yet.
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await loadLocale(locale);

    // fetch() error occurred.
    if (messages === undefined) {
      return;
    }

    // Add locale.
    i18n.global.setLocaleMessage(locale, messages);
  }

  // Set locale.
  i18n.global.locale.value = locale;
}

function getLocale() {
  return i18n.global.locale.value;
}

function loadLocale(locale) {
  return import(`@/i18n/translations/${locale}.json`).then((importedData) => {
    return importedData.default;
  });
}

export { i18n, DEFAULT_LOCALE, SUPPORTED_LOCALES, setLocale, getLocale };
