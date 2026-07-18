import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { i18n } from './i18n'
import { router } from './router'
import 'flag-icons/css/flag-icons.min.css'
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/global.css'

const app = createApp(App).use(createPinia()).use(vuetify).use(i18n).use(router)

// Wait for the initial route (and any `/` redirect) to resolve so the app
// mounts with the correct language/job already in place.
router.isReady().then(() => app.mount('#app'))
