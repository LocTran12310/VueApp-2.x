<template>
  <div>
    <LeaveRegister
      :isLoadingSync.sync="isLoading"
      :types="types"
      :reasons="reasons"
    />
    <LeaveDataTable
      :isLoadingSync.sync="isLoading"
      :leaveDetailsSync.sync="leaveDetails"
      :types="types"
      :reasons="reasons"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LeaveDataTable from "./LeaveDataTable.vue";
import LeaveRegister from "./LeaveRegister.vue";
import store from "@/store/index";

@Component({
  components: {
    LeaveDataTable,
    LeaveRegister,
  },
})
export default class Leave extends Vue {
  isLoading = true;
  types = [];
  reasons = [];
  leaveDetails: any[] = [];
  async mounted() {
    await this.getLeave();
  }
  async getLeave() {
    this.isLoading = true;
    try {
      const employeeID = store.state.user.user.user.login_id;
      this.leaveDetails = await store.dispatch(
        "leaveDetails/getLeaveDetails",
        employeeID
      );
      this.types = await store.dispatch("leaveTypes/getLeaveTypes");
      this.reasons = await store.dispatch("leaveReasons/getLeaveReasons");
    } catch (error) {
      console.log(error);
    }
    this.isLoading = false;
  }
}
</script>
