<template>
  <div>
    <PositionSearchPanel
      :panelSync.sync="panel"
      :positionsSync.sync="positions"
      :searchByNameSync.sync="searchByName"
      :searchByShortNameSync.sync="searchByShortName"
    />
    <PositionDataTable
      :isLoadingSync.sync="isLoading"
      :positionsSync.sync="positions"
      :searchByNameSync.sync="searchByName"
      :searchByShortNameSync.sync="searchByShortName"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import PositionDataTable from "./PositionDataTable.vue";
import PositionSearchPanel from "./PositionSearchPanel.vue";

@Component({
  components: {
    PositionDataTable,
    PositionSearchPanel,
  },
})
export default class PositionList extends Vue {
  isLoading = true;
  panel = [0];
  searchByName = "";
  searchByShortName = "";
  positions = [];

  async mounted() {
    await this.getPositions();
  }

  async getPositions(): Promise<void> {
    this.isLoading = true;

    await store.dispatch("positions/getPositions").then((res: any) => {
      this.positions = res.result;
      this.isLoading = false;
    });
  }
}
</script>
