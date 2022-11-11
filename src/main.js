import 'floating-vue/dist/style.css'
import '@/css/v-popper.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from '@/App.vue'
import JobsMenu from '@/components/nav/JobsMenu.vue'
import JobEntry from '@/components/nav/JobEntry.vue'
import JobActions from '@/components/JobActions.vue'
import Action from '@/components/action/Action'
import ActionGroup from '@/components/action/ActionGroup'
import { createRouter, createWebHistory } from 'vue-router'
import FloatingVue from 'floating-vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  localeDir: 'locales',
  messages: {
    en: {
      categorySpell: 'Spell',
      categoryWeaponSkill: 'Weaponskill',
      categoryAbility: 'Ability',
      castTimeInstant: 'Instant',
      acquired: 'Acquired',
      affinity: 'Affinity',
      costType: {
        MP: 'MP Cost',
        OathGauge: 'Oath Gauge'
      },
      recast: 'Recast',
      cast: 'Cast',
      radius: 'Radius',
      range: 'Range',
      job: 'Job',
      role: 'Role',
      loadingJobsData: 'loading jobs data',
      loadingActionData: 'loading job actions',
      rotation: 'Rotation',
      siteName: 'FFXIVAdvancedRotations',
      settings: {
        buttonLabel: 'Settings',
        removeUpleveledActions: 'Remove upleveled replaced actions'
      }
    }
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/jobActions/:jobId', component: JobActions, props: true
  }],
  linkActiveClass: 'active'
})

const pinia = createPinia()
const app = createApp(App)

app.component('jobs-menu', JobsMenu)
app.component('job-entry', JobEntry)
app.component('job-actions', JobActions)
app.component('action-group', ActionGroup)
app.component('action', Action)

app.use(router)
app.use(FloatingVue)
app.use(i18n)
app.use(pinia)

app.mount('#app')
