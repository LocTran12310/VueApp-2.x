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
        >{{ $t("profileList.searchPanel.title") }}</v-expansion-panel-header
      >
      <v-expansion-panel-content>
        <v-row class="mt-4">
          <v-col cols="12" sm="12" md="4">
            <v-combobox
              v-model="select.name"
              :items="employeeName"
              clearable
              dense
              outlined
              @keydown.enter.prevent="searchAction"
              :label="$t('profileList.searchPanel.employee')"
            ></v-combobox>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-select
              v-model="select.department"
              :items="departments"
              :menu-props="{ bottom: true, offsetY: true }"
              item-text="name"
              item-value="id"
              return-object
              dense
              outlined
              :label="$t('profileList.searchPanel.department')"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-select
              v-model="select.position"
              :items="positions"
              :menu-props="{ bottom: true, offsetY: true }"
              item-text="name"
              item-value="id"
              return-object
              dense
              outlined
              :label="$t('profileList.searchPanel.position')"
            ></v-select>
          </v-col>
        </v-row>
        <v-card-actions class="px-0">
          <v-spacer></v-spacer>
          <!-- <v-btn text color="secondary"> Cancel </v-btn> -->
          <v-btn color="primary" @click="searchAction">{{
            $t("profileList.searchPanel.btnSearch")
          }}</v-btn>
        </v-card-actions>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

@Component
export default class ProfileListSearchPanel extends Vue {
  @PropSync("panelSync", { type: Array }) panel!: any;
  @PropSync("profiles", { type: Array }) profilesSearch!: any;
  @PropSync("searchByIdSync", { type: String }) searchById!: any;
  @PropSync("searchByNameSync", { type: String }) searchByName!: any;
  @PropSync("searchByDepartmentSync", { type: String })
  searchByDepartment!: any;
  @PropSync("searchByPositionSync", { type: String }) searchByPosition!: any;

  select = {
    name: "",
    position: { id: 0, name: "ALL" },
    department: { id: 0, name: "ALL" },
  };
  positions = [...store.state.positions?.items];
  departments = [...store.state.departments?.items];
  name = [];

  mounted() {
    this.positions.unshift({ id: 0, name: "ALL" });
    this.departments.unshift({ id: 0, name: "ALL" });
  }

  get employeeName() {
    return this.profilesSearch.map(
      (item: any) => item.employee_id + "  " + item.name
    );
  }
  searchAction() {
    this.searchById = this.getName()[0]
      ? this.getName()[0].replace(/[^a-zA-Z0-9]/g, "")
      : "";
    // this.searchByName = this.getName()[2].replace(/[^a-zA-Z0-9]/g, "");
    this.searchByDepartment =
      this.select.department.id > 0 ? this.select.department.id.toString() : "";
    this.searchByPosition =
      this.select.position.id > 0 ? this.select.position.id.toString() : "";
  }
  getName() {
    return this.select.name != undefined || this.select.name != null
      ? this.select.name.split(" ")
      : "";
  }
  removeAccents(string: string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
</script>
