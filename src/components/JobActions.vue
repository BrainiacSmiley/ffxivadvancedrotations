<template>
  <div class="loadingActionsIndicatorBackground" v-show="jobActionsNotLoaded">
    <div class="loadingIndicatorIcon"></div>
    <div class="loadingIndicatorText">{{ t('loadingActionData') }}</div>
  </div>
  <header class="jobActionsHeader">
    <div class="jobActionsIcon" :style="selectedJobIcon"></div>
    <div class="jobActionsName">{{ name }}</div>
  </header>
  <div class="jobRotation">
    <fieldset class="actionGroup">
      <legend>{{ t('rotation') }}</legend>
    </fieldset>
  </div>
  <footer class="jobActionsOverview">
    <div class="actionGroups">
      <action-group
          :category-name="group.categoryName"
          :actions="group.actions"
          v-for="group in actionGroups" :key="group.id"></action-group>
    </div>
    <div class="actionTooltip" :style="isJobActionSelected">
      <div>
        <div class="actionIcon" :style="selectedActionIcon"></div>
        <div class="actionName">{{ selectedActionName }}</div>
        <div class="actionCategory"><span style="color:#b6b09a;">{{ selectedActionCategory }}</span> {{ selectedActionId }}</div>
        <div class="actionRange"><span style="color:gray;">{{ $t('range') }}</span> <span>{{ selectedActionRange }}</span></div>
        <div class="actionRadius"><span style="color:gray;">{{ $t('radius') }}</span> <span>{{ selectedActionRadius }}</span></div>
        <div class="actionCast" :style="selectedActionCastVisible">
          <div style="color:#b6b09a;font-size:13px;text-align:right;">{{ $t('cast') }}</div>
          <div style="text-align:right;">{{ selectedActionCasttime }}</div>
          <div style="height: 5px;width:135px;background-color:gray;border-radius:2px;margin-top:-5px;"></div>
        </div>
        <div class="actionRecast" :style="selectedActionRecastVisible">
          <div style="color:#b6b09a;font-size:13px;text-align:right;">{{ $t("recast") }}</div>
          <div style="text-align:right;">{{ selectedActionRecasttime }}</div>
          <div style="height: 5px;width:135px;background-color:gray;border-radius:2px;margin-top:-5px;"></div>
        </div>
        <div class="actionCost" :style="selectedActionCostVisible">
          <div style="color:#b6b09a;font-size:13px;text-align:right;">{{ selectedActionCostsType }}</div>
          <div style="text-align:right;">{{ selectedActionCosts }}</div>
          <div style="height: 5px;width:135px;background-color:gray;border-radius:2px;margin-top:-5px;"></div>
        </div>
      </div>
      <div class="actionDescription" v-html="selectedActionDescription">
      </div>
      <div class="actionAcquired">
        <div style="display:inline-block;width:100px;color:#b6b09a;">{{ $t('acquired') }}</div>
        <span style="color:#5a7744">{{ selectedActionAcquiredLvl }}</span>
      </div>
      <!--<div class="actionAffinity">
        <span style="flex:1;width:100px;color:#b6b09a;">{{ $t('affinity') }}</span>
        <span style="flex:1;margin-left:-229px;}">{{ selectedActionAffinity }}</span>
      </div>-->
    </div>
  </footer>
</template>

<script>
import { getJobActions } from '@/js/ffxiv/ffxivjobactions'
import { useI18n } from 'vue-i18n'

export default {
  name: 'job-actions',
  setup () {
    const { t } = useI18n()

    return { t }
  },
  props: {
    jobId: String
  },
  data () {
    return {
      id: '',
      icon: '',
      name: '',
      actionGroups: [],
      actualSelectedActionId: null,
      allJobActions: {},
      jobActionsNotLoaded: true
    }
  },
  computed: {
    selectedJobIcon () {
      return { backgroundImage: `url(${this.icon})` }
    },
    isJobActionSelected () {
      if (this.actualSelectedActionId && typeof this.actualSelectedActionId !== 'undefined') {
        return { visibility: 'visible' }
      } else {
        return { visibility: 'hidden' }
      }
    },
    selectedActionIcon () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return { backgroundImage: `url(${data.icon})` }
    },
    selectedActionName () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return data.name
    },
    selectedActionId () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return ` [${data.id}]`
    },
    selectedActionCategory () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      if (data.action_category === 2) {
        return this.$t('categorySpell')
      } else if (data.action_category === 3) {
        return this.$t('categoryWeaponSkill')
      } else if (data.action_category === 4) {
        return this.$t('categoryAbility')
      } else {
        return new Error('undefined action_category')
      }
    },
    selectedActionRange () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      let range = data.range
      if (range === '-1') {
        range = '3'
      }
      return `${range}y`
    },
    selectedActionRadius () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return `${data.radius}y`
    },
    selectedActionCastVisible () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      if (data.cast100ms > 0 && this.actualSelectedActionId && typeof this.actualSelectedActionId !== 'undefined') {
        return 'visibility:visible'
      } else {
        return 'visibility:hidden'
      }
    },
    selectedActionCasttime () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      let castTime = data.cast100ms
      if (castTime === 0) {
        return this.$t('castTimeInstant')
      } else {
        castTime = this.roundNumberToTwoDigits(castTime)
      }
      return `${castTime}s`
    },
    selectedActionRecastVisible () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      if (data.recast100ms > 0 && this.actualSelectedActionId && typeof this.actualSelectedActionId !== 'undefined') {
        return { visibility: 'visible' }
      } else {
        return { visibility: 'hidden' }
      }
    },
    selectedActionRecasttime () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      const recastTime = this.roundNumberToTwoDigits(data.recast100ms / 10)
      return `${recastTime}s`
    },
    selectedActionCostVisible () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      if (data.cost > 0 && this.actualSelectedActionId && typeof this.actualSelectedActionId !== 'undefined') {
        return { visibility: 'visible' }
      } else {
        return { visibility: 'hidden' }
      }
    },
    selectedActionCostsType () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }

      if (data.costType) {
        return this.$t('costTypeMP')
      } else {
        return new Error('Undefined costType')
      }
    },
    selectedActionCosts () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return data.cost
    },
    selectedActionDescription () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return data.description
    },
    selectedActionAcquiredLvl () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return `Lv. ${data.class_job_level}`
    },
    selectedActionAffinity () {
      const data = this.getActionData(this.actualSelectedActionId)
      if (typeof data === 'undefined') {
        return ''
      }
      return data.affinity
    }
  },
  created () {
    this.loadJobActions(this.jobId)
  },
  methods: {
    getActionData (actionId) {
      if (typeof this.allJobActions[actionId] !== 'undefined') {
        return this.allJobActions[actionId]
      }
    },
    roundNumberToTwoDigits (value) {
      const decimalPlaces = 2
      return Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces).toFixed(decimalPlaces)
    },
    loadJobActions (jobId) {
      this.jobActionsNotLoaded = true
      if (typeof jobId === 'undefined') {
        return
      }

      if (typeof this.$parent.$parent.jobsData[jobId] === 'undefined') {
        this.$router.push('/')
        return
      }
      const actualJobData = this.$parent.$parent.jobsData[jobId]
      this.id = jobId
      this.icon = actualJobData.icon
      this.name = actualJobData.name

      const jobActions = getJobActions(jobId)
      jobActions.then((jobActionsResult) => {
        this.actionGroups = jobActionsResult
        for (const group of jobActionsResult) {
          for (const [id, action] of Object.entries(group.actions)) {
            this.allJobActions[id] = action
          }
        }
        this.jobActionsNotLoaded = false
      })
    }
  },
  watch: {
    jobId (newId) {
      this.loadJobActions(newId)
    }
  }
}
</script>

<style scoped>
.jobActionsHeader {
  margin: auto;
  width: 200px;
  display: block;
}

.jobActionsIcon {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
}

.jobActionsName {
  color: #c2c2c2;
  display: inline-block;
  font-size: 24px;
  vertical-align: top;
  margin-top: 18px;
}

.jobActionsOverview {
  margin: auto;
}

.actionTooltip {
  width: 440px;
  border: 2px solid gray;
  margin: auto;
  position: relative;
  color: white;
  display: inline-block;
  bottom: -5px;
  left: 10px;
}

.actionIcon {
  width: 80px;
  height: 80px;
  position: absolute;
  top: -5px;
  left: -5px;
  transform: scale(0.6);
}

.actionName {
  position: absolute;
  top: 10px;
  left: 65px;
  font-size: 20px;
  color: #e2e2e2;
}

.actionCategory {
  position: absolute;
  top: 40px;
  left: 65px;
}

.actionRange {
  position: absolute;
  top: 40px;
  left: 200px;
}

.actionRadius {
  position: absolute;
  top: 40px;
  left: 320px;
}

.actionCast {
  position: absolute;
  top: 70px;
  left: 10px;
}

.actionRecast {
  position: absolute;
  top: 70px;
  left: 152px;
}

.actionCost {
  position: absolute;
  top: 70px;
  left: 295px;
}

.actionDescription {
  margin-top: 110px;
  margin-left: 10px;
}

.actionAcquired {
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
}

.actionAffinity {
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
}

.actionGroups {
  width: 1500px;
  display: inline-block;
}

.jobRotation {
  width: 1944px;
  height: 750px;
  margin: auto;
}

.loadingActionsIndicatorBackground {
  background-color: black;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100000;
}

legend {
  color: lightgray;
  font-size: 32px;
}

.actionGroup {
  border-radius: 5px;
}
</style>
