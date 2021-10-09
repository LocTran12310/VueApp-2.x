<template>
  <v-menu
    v-model="showDatePicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :rules="rules"
        v-model="date"
        :disabled="disabled"
        :outlined="outlined"
        :hide-details="hideDetails"
        :dense="dense"
        :label="label"
        :single-line="singleLine"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        :clearable="clearable"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      @input="showDatePicker = false"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import moment from "moment";

@Component
export default class InputDatePicker extends Vue {
  @PropSync("v-model", { type: String }) modelDateString!: string;
  @PropSync("datePicker", { type: Boolean }) showDatePicker!: boolean;
  @PropSync("dateString", { type: String }) syncDateString!: string;
  @PropSync("rulesSync", { type: Array }) rules!: any;
  @Prop(Boolean) readonly setDefault!: boolean;
  @Prop(String) readonly label!: string;
  @Prop(Boolean) readonly outlined!: boolean;
  @Prop(Boolean) readonly dense!: boolean;
  @Prop(Boolean) readonly clearable!: boolean;
  @Prop(Boolean) readonly singleLine!: boolean;
  @Prop(Boolean) readonly hideDetails!: boolean;

  @Prop(Boolean) readonly disabled!: boolean;

  get date() {
    // console.log("GET DATE", this.date);
    return this.setDefault &&
      (this.syncDateString == "" ||
        moment(this.syncDateString).format("DD/MM/YYYY") === "Invalid date")
      ? (this.syncDateString = new Date().toISOString().slice(0, 10))
      : this.syncDateString;
  }
  set date(val: string) {
    this.syncDateString = val === null ? "" : val;
  }
}
</script>
