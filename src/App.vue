<template>
  <div class="jobMenu">
    <jobs-menu
        :id="jobCategory.id"
        :name="jobCategory.name"
        :icon="jobCategory.icon"
        :jobList="jobCategory.jobList"
        v-for="jobCategory in jobsMenu" :key="jobCategory.id"></jobs-menu>
  </div>
  <div class="jobActions">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  props: {
    jobsMenu: Object,
    jobsData: Object
  },
  methods: {}
}
</script>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c2f34;
}

.jobMenu {
  width: 300px;
  float: left
}

.jobActions {
  display: flex;
  justify-content: center;
  width: calc(100% - 300px);
  align-content: center;
  flex-direction: column;
}

</style>
