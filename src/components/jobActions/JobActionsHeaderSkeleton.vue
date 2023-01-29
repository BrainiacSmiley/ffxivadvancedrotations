<script setup></script>

<template>
  <header class="jobActionsHeaderSkeleton">
    <div class="jobActionsIconSkeleton"></div>
    <div class="jobActionsNameSkeleton"></div>
  </header>
</template>

<style scoped>
.jobActionsHeaderSkeleton {
  grid-column: 3 span;
  justify-self: center;
  align-self: start;
  margin-top: 15px;
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

/* (1920x1080) Full HD Display */
@media screen and (max-width: 1920px) {
  .jobActionsHeaderSkeleton {
    margin-top: 0;
    height: 51px;
  }
}
</style>
