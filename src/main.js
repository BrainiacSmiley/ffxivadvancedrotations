import { createApp } from 'vue'
import App from './App.vue'
import JobsMenu from './components/nav/JobsMenu.vue'
import JobEntry from './components/nav/JobEntry.vue'
import { getAllJobsData, getAllMenuData, stripJobData } from '@/js/ffxivadvancedrotations'
import { createRouter, createWebHistory } from 'vue-router'
import JobActions from './components/JobActions'

// const XIVAPI = require('@xivapi/js')
// const xiv = new XIVAPI({
//   // private_key: '',
//   language: 'en',
//   snake_case: true
// })

const language = 'en'
const allMenuData = getAllMenuData(language)
const allJobDataRequests = getAllJobsData(language)
const allJobsData = {}

allJobDataRequests.then((allJobDataResult) => {
  console.log(allJobDataRequests)

  for (const jobDataResult of allJobDataResult) {
    const stripedJobData = stripJobData(jobDataResult, language)
    allJobsData[stripedJobData.id] = stripedJobData
  }

  for (const jobCategory of allMenuData) {
    const jobsData = []
    for (const jobId of jobCategory.jobIds) {
      jobsData.push(
        {
          id: allJobsData[jobId].id,
          icon: allJobsData[jobId].icon,
          name: allJobsData[jobId].name
        }
      )
    }
    jobCategory.jobList = jobsData
    delete jobCategory.jobIds
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [{
      path: '/jobActions/:jobId', component: JobActions, props: true
    }],
    linkActiveClass: 'active'
  })

  const app = createApp(App, { jobsMenu: allMenuData, jobsData: allJobsData })

  app.component('jobs-menu', JobsMenu)
  app.component('job-entry', JobEntry)

  app.use(router)

  app.mount('#app')
})
