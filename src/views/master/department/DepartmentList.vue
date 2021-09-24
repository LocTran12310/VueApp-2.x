<template>
  <div>
    <DepartmentSearchPanel
      :panelSync.sync="panel"
      :departmentsSync.sync="departments"
      :searchByNameSync.sync="searchByName"
      :searchByShortNameSync.sync="searchByShortName"
    />
    <DepartmentDataTable
      :isLoadingSync.sync="isLoading"
      :departmentsSync.sync="departments"
      :searchByNameSync.sync="searchByName"
      :searchByShortNameSync.sync="searchByShortName"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import DepartmentDataTable from "./DepartmentDataTable.vue";
import DepartmentSearchPanel from "./DepartmentSearchPanel.vue";

@Component({
  components: {
    DepartmentDataTable,
    DepartmentSearchPanel,
  },
})
export default class DepartmentList extends Vue {
  isLoading = true;
  panel = [0];
  searchByName = "";
  searchByShortName = "";
  departments = [];

  async mounted() {
    await this.getDepartments();
  }

  async getDepartments(): Promise<void> {
    this.isLoading = true;

    await store.dispatch("departments/getDepartments").then((res: any) => {
      this.departments = res.result;
      this.isLoading = false;
    });
  }
}
</script>
