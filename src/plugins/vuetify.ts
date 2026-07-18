import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      // Palette mirrors the reference UI's Bootstrap dark theme:
      // body-bg #212529, surface #343a40, muted text #adb5bd, accent blue.
      dark: {
        dark: true,
        colors: {
          primary: '#3b71ca',
          secondary: '#6c757d',
          background: '#212529',
          surface: '#2b3035',
          'surface-bright': '#343a40',
          error: '#dc4c64',
          info: '#54b4d3',
          success: '#14a44d',
          warning: '#e4a11b',
          'on-background': '#dee2e6',
          'on-surface': '#dee2e6',
        },
        variables: {
          'border-color': '#6c757d',
          'medium-emphasis-opacity': 0.72,
        },
      },
      // Light counterpart kept coherent with the same accent and neutral grays.
      light: {
        dark: false,
        colors: {
          primary: '#3b71ca',
          secondary: '#6c757d',
          background: '#f4f5f7',
          surface: '#ffffff',
          'surface-bright': '#ffffff',
          error: '#dc4c64',
          info: '#54b4d3',
          success: '#14a44d',
          warning: '#e4a11b',
        },
        variables: {
          'border-color': '#adb5bd',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})
