/**
 * Release history shown on the changelog page (newest first — prepend a new
 * entry when you cut a release). Content is kept in English on purpose
 * (developer-facing); only the page chrome and the date format are localized.
 */
export interface ChangelogSection {
  title: string
  items: string[]
}

export interface ChangelogEntry {
  version: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  sections: ChangelogSection[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2026-07-18',
    sections: [
      {
        title: 'Features',
        items: [
          'Rebuilt on Vue 3 + Vuetify with the FFXIV look and the in-game fonts',
          'Job browser grouped by role, deep-linkable per job (e.g. /en/pld)',
          'Skill pool with the original in-game action tooltip',
          'Drag-and-drop rotation planner: GCDs form columns, oGCDs fill two weave slots',
          'Empty weave slots stay as gaps; overflow oGCDs open GCD-less columns to show clipping',
          'Self-contained sharing — the whole rotation lives in the URL, no backend',
          'Save rotations locally per job, plus predefined rotations from config',
          'English, German, French and Japanese, with the language in the URL',
        ],
      },
    ],
  },
]
