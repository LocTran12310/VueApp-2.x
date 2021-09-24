<template>
  <v-card width="400">
    <v-card-text>
      <TheBarChart :datacollection="datacollection" />
      <div class="text-center">
        Biểu đồ thống kê số lượng nhân viên theo năm
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import TheBarChart from "./TheBarChart.vue";

@Component({
  components: {
    TheBarChart,
  },
})
export default class Dashboard extends Vue {
  filterByYearLabels = store.getters["profiles/officialYear"].sortedYearGroup;
  filterByYearDatasets = store.getters[
    "profiles/officialYear"
  ].sortedYearGroupCount.map((yearGroup) => {
    // Convert to number
    return yearGroup.length;
  });

  datacollection = {
    labels: this.filterByYearLabels,
    datasets: [
      {
        label: "Nhân viên",
        backgroundColor: "#f87979",
        pointBackgroundColor: "white",
        borderWidth: 1,
        pointBorderColor: "#249EBF",
        data: this.filterByYearDatasets,
      },
    ],
  };
}
</script>
