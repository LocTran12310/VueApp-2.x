<template>
  <span>
    <v-btn @click="goBack" color="deep-purple lighten-3">{{
      $t("goBack")
    }}</v-btn>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class GoBack extends Vue {
  goBack() {
    return this.$router.go(-1);
  }
}
</script>
