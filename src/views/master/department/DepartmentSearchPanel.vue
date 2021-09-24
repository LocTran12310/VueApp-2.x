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
        >{{ $t("positionList.titleSearchPanel") }}</v-expansion-panel-header
      >
      <v-expansion-panel-content>
        <v-row class="mt-4 mb-1">
          <v-col cols="12" sm="12" md="4">
            <v-combobox
              v-model="name"
              :items="departmentsName"
              clearable
              dense
              outlined
              hide-details
              @keydown.enter.prevent="searchAction"
              :label="$t('positionList.name')"
            ></v-combobox>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-combobox
              v-model="shortName"
              :items="departmentsShortName"
              clearable
              dense
              outlined
              hide-details
              @keydown.enter.prevent="searchAction"
              :label="$t('positionList.shortName')"
            ></v-combobox>
          </v-col>
          <v-col cols="12" sm="12" md="4" class="text-end">
            <v-btn color="primary" @click="searchAction">{{
              $t("positionList.btnSearch")
            }}</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class DepartmentSearchPanel extends Vue {
  @PropSync("panelSync", { type: Array }) panel!: any;
  @PropSync("departmentSync", { type: Array }) departments!: any;
  @PropSync("searchByNameSync", { type: String }) searchByName!: any;
  @PropSync("searchByShortNameSync", { type: String }) searchByShortName!: any;

  name = "";
  shortName = "";
  departmentsName = store.getters["departments/departmentsName"];
  departmentsShortName = store.getters["departments/departmentsShortName"];

  searchAction() {
    this.searchByName = this.name !== null ? this.name : "";
    this.searchByShortName = this.shortName !== null ? this.shortName : "";
  }
}
</script>
