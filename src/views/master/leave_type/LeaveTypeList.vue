<template>
  <div>
    <LeaveTypeDataTable
      :isLoadingSync.sync="isLoading"
      :leaveTypesSync.sync="leaveTypes"
      :searchByNameSync.sync="searchByName"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import LeaveTypeDataTable from "./LeaveTypeDataTable.vue";

@Component({
  components: {
    LeaveTypeDataTable,
  },
})
export default class LeaveTypeList extends Vue {
  isLoading = true;
  panel = [0];
  searchByName = "";
  leaveTypes = [];

  async mounted() {
    await this.getLeaveTypes();
  }

  async getLeaveTypes(): Promise<void> {
    this.isLoading = true;

    await store.dispatch("leaveTypes/getLeaveTypes").then((res: any) => {
      this.leaveTypes = res;
      this.isLoading = false;
    });
  }
}
</script>
