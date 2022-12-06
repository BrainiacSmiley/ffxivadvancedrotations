<template>
  <div class="actionTooltip" :style="isJobActionSelected">
    <div>
      <div class="actionIconTooltip" :style="selectedActionIcon"></div>
      <div class="actionName">{{ selectedActionName }}</div>
      <div class="actionCategory">
        <span style="color: #b6b09a">{{ selectedActionCategory }}</span>
        {{ selectedActionId }}
      </div>
      <div class="actionRange">
        <span style="color: gray; margin-right: 5px">{{ $t("range") }}</span>
        <span>{{ selectedActionRange }}</span>
      </div>
      <div class="actionRadius">
        <span style="color: gray; margin-right: 5px">{{ $t("radius") }}</span>
        <span>{{ selectedActionRadius }}</span>
      </div>
      <div class="actionCast" :style="selectedActionCastVisible">
        <div style="color: #b6b09a; font-size: 13px; text-align: right">
          {{ $t("cast") }}
        </div>
        <div style="text-align: right">{{ selectedActionCasttime }}</div>
        <div
          style="
            height: 5px;
            width: 135px;
            background-color: gray;
            border-radius: 2px;
            margin-top: -5px;
          "
        ></div>
      </div>
      <div class="actionRecast" :style="selectedActionRecastVisible">
        <div style="color: #b6b09a; font-size: 13px; text-align: right">
          {{ $t("recast") }}
        </div>
        <div style="text-align: right">{{ selectedActionRecasttime }}</div>
        <div
          style="
            height: 5px;
            width: 135px;
            background-color: gray;
            border-radius: 2px;
            margin-top: -5px;
          "
        ></div>
      </div>
      <div class="actionCost" :style="selectedActionCostVisible">
        <div style="color: #b6b09a; font-size: 13px; text-align: right">
          {{ selectedActionCostsType }}
        </div>
        <div style="text-align: right">{{ selectedActionCosts }}</div>
        <div
          style="
            height: 5px;
            width: 135px;
            background-color: gray;
            border-radius: 2px;
            margin-top: -5px;
          "
        ></div>
      </div>
    </div>
    <div class="actionDescription" v-html="selectedActionDescription"></div>
    <div class="actionAcquired">
      <div style="display: inline-block; width: 100px; color: #b6b09a">
        {{ $t("acquired") }}
      </div>
      <span style="color: #5a7744">{{ selectedActionAcquiredLvl }}</span>
    </div>
    <!--<div class="actionAffinity">
      <span style="flex:1;width:100px;color:#b6b09a;">{{ $t('affinity') }}</span>
      <span style="flex:1;margin-left:-229px;}">{{ selectedActionAffinity }}</span>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "JobActionTooltip",
};
</script>

<style scoped></style>
