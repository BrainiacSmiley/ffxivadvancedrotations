<template>
  <div class="groupOfActions">
    <fieldset class="actionGroup">
      <legend>{{ categoryName }}</legend>
      <div class="actions">
        <action
            :id="action.id"
            :icon="action.icon"
            :name="action.name"
            :category="action.action_category"
            v-for="action in actions" :key="action.id"
        ></action>
      </div>
    </fieldset>
  </div>
</template>
<script>
export default {
  name: 'ActionGroup',
  props: {
    categoryName: String,
    actions: Object
  }
}
</script>

<style scoped>
.groupOfActions {
  margin: 5px;
}

legend {
  color: lightgray;
  font-size: 32px;
  border-radius: 5px;
}

.actionGroup {
  border-radius: 5px;
}
</style>
