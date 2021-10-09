<template>
  <v-expansion-panels v-model="panel" multiple class="mb-8">
    <v-expansion-panel>
      <v-expansion-panel-header
        class="
          deep-purple
          lighten-4
          title
          font-weight-normal
          py-0
          text--secondary
        "
        >{{ $t("courseList.searchPanel.title") }}</v-expansion-panel-header
      >
      <v-expansion-panel-content class="px-0">
        <v-row dense>
          <v-col cols="12" sm="6" md="4" class="mt-4">
            <v-select
              v-model="employeeId"
              :items="employeeID"
              label="Employee"
              :menu-props="{ bottom: true, offsetY: true }"
              :hide-details="true"
              outlined
              dense
            >
            </v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mt-4">
            <v-text-field
              :value="year"
              :hide-details="true"
              label="Year"
              type="number"
              @change="(value) => (year = parseInt(value))"
              outlined
              dense
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mt-4">
            <v-text-field
              :value="month"
              :hide-details="true"
              label="Month"
              @change="(value) => (month = parseInt(value))"
              type="number"
              outlined
              dense
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="12" class="mt-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="searchWorkday">SEARCH</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class WorkdaySearchPanel extends Vue {
  @PropSync("panelSync", { type: Array }) panel!: any;
  @PropSync("employeeIdSearchSync", { type: String }) employeeId!: string;
  @PropSync("yearSync", { type: Number }) year!: number;
  @PropSync("monthSync", { type: Number }) month!: number;
  @Prop(Function) searchWorkday!: any;

  get employeeID() {
    return store.state.profiles?.items?.result?.map(
      (item: any) => item.employee_id + "  " + item.name
    );
  }
}
</script>
