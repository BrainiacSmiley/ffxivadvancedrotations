<script setup></script>

<template>
  <div class="jobSkeleton">
    <div class="jobIconSkeleton"></div>
    <div class="jobNameSkeleton"></div>
    <div class="jobLineSkeleton"></div>
  </div>
</template>

<style scoped>
.jobSkeleton {
  width: 265px;
  cursor: pointer;
  height: 46px;
  position: relative;
  margin-left: 15px;
  margin-top: 3px;
}

.jobCategoryHeadline + .jobSkeleton {
  margin-top: 16px;
}

.jobIconSkeleton {
  width: 64px;
  height: 64px;
  display: inline-block;
  transform: scale(0.6);
  background-color: lightgray;
  margin-top: -20px;
  margin-left: -15px;
  position: relative;
}

.jobNameSkeleton {
  position: absolute;
  top: -7px;
  left: 48px;
  height: 15px;
  width: 100px;
  background-color: #c2c2c2;
}

.jobLineSkeleton {
  position: absolute;
  top: 15px;
  left: 48px;
  background-color: #595b5f;
  height: 10px;
  width: 200px;
}
</style>
