<template>
  <v-snackbar
    app
    top
    text
    v-model="snackBarAlert.isShow"
    :timeout="snackBarAlert.timeOut"
    :color="snackBarAlert.color"
  >
    <v-icon dense :color="snackBarAlert.color" v-if="snackBarAlert.icon" left>{{
      snackBarAlert.icon
    }}</v-icon>
    {{ snackBarAlert.message }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="close">
        {{ $t("snackbar.close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class SnackBarAlert extends Vue {
  get snackBarAlert() {
    return store.state.alert.snackBarAlert;
  }
  @Watch("snackBarAlert.isShow")
  onSnackBarClose(val: boolean) {
    val || this.close();
  }
  close() {
    const alert = {
      isShow: false,
      message: "",
      icon: "",
      color: "",
      timeOut: 5000,
    };
    store.dispatch("alert/showAlert", alert);
  }
}
</script>
