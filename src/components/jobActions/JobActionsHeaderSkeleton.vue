<template>
  <header class="jobActionsHeaderSkeleton">
    <div class="jobActionsIconSkeleton"></div>
    <div class="jobActionsNameSkeleton"></div>
  </header>
</template>

<script>
export default {
  name: "JobActionsHeaderSkeleton",
};
</script>

<style scoped>
.jobActionsHeaderSkeleton {
  margin: auto;
  width: 340px;
}

.jobActionsIconSkeleton {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-size: cover;
  background-color: lightgray;
}

.jobActionsNameSkeleton {
  color: #c2c2c2;
  display: inline-block;
  font-size: 36px;
  vertical-align: top;
  margin-top: 16px;
  background-color: #c2c2c2;
  width: 150px;
  height: 32px;
}
</style>
