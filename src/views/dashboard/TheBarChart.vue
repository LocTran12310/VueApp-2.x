<script lang="ts">
import Vue from "vue";
import { Bar, mixins } from "vue-chartjs";
import { ChartOptions } from "chart.js";
import store from "@/store";
import { Component, Mixins, Prop } from "vue-property-decorator";
const { reactiveData } = mixins;

@Component({
  extends: Bar,
})
export default class TheBarChart extends Mixins(reactiveData, Bar) {
  // @Prop() options!: ChartOptions;
  // @Prop() datacollection!: any;

  getData() {
    const allProfiles = store.state.profiles?.items?.result?.map(
      (item: any) => {
        return { year: item.official_date.split("-")[0], gender: item.gender };
      }
    );
    //get amount by year-gender
    var helper: any = {};
    var result = allProfiles.reduce((r: any, o: any) => {
      var key = o.year + "-" + o.gender;
      o.amount = 1;
      if (!helper[key]) {
        helper[key] = Object.assign({}, o); //Clone a copy of o
        r.push(helper[key]);
      } else {
        helper[key].amount += 1;
      }
      return r;
    }, []);

    //sort ==> get last YEAR_NEEDED
    const YEAR_NEEDED = 10 * 2; // 2 is gender
    const sortedItems = result.sort((a: any, b: any) => {
      if (a.year < b.year) return -1;
      if (a.year > b.year) return 1;
      return 0;
    });
    const yearNeededItems = sortedItems.slice(
      sortedItems.length - YEAR_NEEDED,
      sortedItems.length
    );
    const getAmount = (arr: any, gender: number) => {
      return arr
        .filter((item: any) => {
          return item.gender === gender;
        })
        .map((item: any) => {
          return item.amount;
        });
    };
    const filteredItemsAmountMale = getAmount(yearNeededItems, 1);
    const filteredItemsAmountFemale = getAmount(yearNeededItems, 2);

    return {
      allProfiles,
      result,
      sortedItems,
      yearNeededItems,
      filteredItemsAmountMale,
      filteredItemsAmountFemale,
    };
  }
  yearLabels = store.getters["profiles/officialYear"]?.yearGroup;

  yearDatasets = store.getters["profiles/officialYear"]?.yearGroupCount?.map(
    (yearGroup: any) => {
      // Convert to number
      return yearGroup.length;
    }
  );
  datacollection = {
    labels: this.yearLabels,
    datasets: [
      {
        label: "Female",
        backgroundColor: "pink",
        pointBackgroundColor: "white",
        borderWidth: 1,
        pointBorderColor: "#249EBF",
        // data: this.yearDatasets,
        data: this.getData().filteredItemsAmountFemale,
      },
      {
        label: "Male",
        backgroundColor: "#249EBF",
        pointBackgroundColor: "white",
        borderWidth: 1,
        pointBorderColor: "#249EBF",
        // data: this.yearDatasets,
        data: this.getData().filteredItemsAmountMale,
      },
    ],
  };

  options = {
    title: {
      display: true,
      text: "Biểu đồ thống kê số lượng nhân viên theo năm",
      position: "bottom",
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: true,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: true,
    },
    responsive: true,
    maintainAspectRatio: false,
    height: 100,
  };

  mounted() {
    // this.chartData is created in the mixin
    this.chartData;
    this.renderChart(this.datacollection, this.options);
  }
}
</script>
