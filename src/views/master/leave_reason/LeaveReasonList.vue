<template>
  <div>
    <LeaveReasonDataTable
      :isLoadingSync.sync="isLoading"
      :leaveReasonsSync.sync="leaveReasons"
      :searchByNameSync.sync="searchByName"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import LeaveReasonDataTable from "./LeaveReasonDataTable.vue";

@Component({
  components: {
    LeaveReasonDataTable,
  },
})
export default class LeaveReasonList extends Vue {
  isLoading = true;
  panel = [0];
  searchByName = "";
  leaveReasons = [];

  async mounted() {
    await this.getLeaveReasons();
  }

  async getLeaveReasons(): Promise<void> {
    this.isLoading = true;

    await store.dispatch("leaveReasons/getLeaveReasons").then((res: any) => {
      this.leaveReasons = res;
      this.isLoading = false;
    });
  }
}
</script>
