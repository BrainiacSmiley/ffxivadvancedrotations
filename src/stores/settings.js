import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    replaceLeveledUpActions: true
  })
})
