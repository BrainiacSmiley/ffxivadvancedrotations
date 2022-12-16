<template>
  <NavBar></NavBar>
  <div class="jobsMenu">
    <JobsMenu></JobsMenu>
  </div>
  <div class="routerPanel">
    <router-view></router-view>
  </div>
</template>

<script>
import JobsMenu from "@/components/jobsMenu/JobsMenu.vue";
import NavBar from "@/components/navBar/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
    JobsMenu,
  },
};
</script>

<style>
* {
  font-family: FFXIV, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c2f34;
}

body {
  overflow: hidden;
}

.jobsMenu {
  position: absolute;
  top: 60px;
  left: 0;
  width: 270px;
  height: 100%;
  padding-top: 15px;
}

.routerPanel {
  position: absolute;
  top: 60px;
  left: 270px;
  width: calc(100% - 270px);
  height: calc(100% - 60px);
}
</style>
