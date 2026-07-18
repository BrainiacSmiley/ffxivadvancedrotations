import { defineStore } from 'pinia'
import { getActions, getJobs } from '@/data/gameDataRepository'
import { ROLE_ORDER } from '@/domain/roster'
import type { GameAction, Job, JobRole, SupportedLanguage } from '@/domain/types'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export interface JobRoleGroup {
  role: JobRole
  jobs: Job[]
}

interface GameDataState {
  jobs: Job[]
  actionsByJob: Record<number, GameAction[]>
  selectedJobId: number | null
  loadingJobs: boolean
  loadingActions: boolean
  error: string | null
}

export const useGameDataStore = defineStore('gameData', {
  state: (): GameDataState => ({
    jobs: [],
    actionsByJob: {},
    selectedJobId: null,
    loadingJobs: false,
    loadingActions: false,
    error: null,
  }),
  getters: {
    selectedJob(state): Job | null {
      return state.jobs.find((job) => job.id === state.selectedJobId) ?? null
    },
    jobsByRole(state): JobRoleGroup[] {
      const groups = new Map<JobRole, Job[]>(ROLE_ORDER.map((role) => [role, []]))
      for (const job of state.jobs) {
        groups.get(job.role)?.push(job)
      }
      return ROLE_ORDER.map((role) => ({ role, jobs: groups.get(role) ?? [] })).filter(
        (group) => group.jobs.length > 0,
      )
    },
    selectedActions(state): GameAction[] {
      return state.selectedJobId != null ? (state.actionsByJob[state.selectedJobId] ?? []) : []
    },
    actionMap(state): Map<number, GameAction> {
      const map = new Map<number, GameAction>()
      for (const list of Object.values(state.actionsByJob)) {
        for (const action of list) {
          map.set(action.id, action)
        }
      }
      return map
    },
  },
  actions: {
    async loadJobs(language: SupportedLanguage) {
      this.loadingJobs = true
      this.error = null
      try {
        this.jobs = await getJobs(language)
      } catch (error) {
        this.error = errorMessage(error)
      } finally {
        this.loadingJobs = false
      }
    },
    async ensureActions(jobId: number, language: SupportedLanguage) {
      const job = this.jobs.find((entry) => entry.id === jobId)
      if (!job || this.actionsByJob[jobId]) {
        return
      }
      this.loadingActions = true
      this.error = null
      try {
        this.actionsByJob[jobId] = await getActions(jobId, job.abbreviation, language)
      } catch (error) {
        this.error = errorMessage(error)
      } finally {
        this.loadingActions = false
      }
    },
    async selectJob(jobId: number, language: SupportedLanguage) {
      this.selectedJobId = jobId
      await this.ensureActions(jobId, language)
    },
    /** Drop cached actions/jobs in memory (e.g. after a language switch). */
    resetForLanguageChange() {
      this.jobs = []
      this.actionsByJob = {}
    },
  },
})
