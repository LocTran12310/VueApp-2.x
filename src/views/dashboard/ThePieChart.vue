<script lang="ts">
import Vue from "vue";
import { Pie, mixins, Doughnut } from "vue-chartjs";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import store from "@/store";

const { reactiveData } = mixins;
@Component({
  extends: Doughnut,
})
export default class ThePieChart extends Mixins(reactiveData, Doughnut) {
  // @Prop() options!: ChartOptions;
  // @Prop() datacollection!: any;
  @Prop() year!: string;
  listLabels = [];
  listDatasets = [];
  datacollection = {};

  @Watch("year")
  onYearChange(year: string) {
    this.getData(year);
    this.options.title.text =
      "Biểu đồ thống kê số lượng nhân viên tham gia khóa học trong năm " + year;
    this.renderChart(this.datacollection, this.options);
  }
  getData(year: string) {
    this.listLabels = store.getters["courses/courseParticipantList"](
      year
    )?.sortedParticipantList.map((item: any) => {
      return item[0].course_name;
    });

    this.listDatasets =
      store.getters["courses/courseParticipantList"](
        year
      )?.sortedParticipantListCount;
    this.datacollection = {
      labels: this.listLabels,
      datasets: [
        {
          backgroundColor: this.poolColors(this.listLabels.length),
          pointBackgroundColor: "white",
          borderWidth: 3,
          pointBorderColor: "#249EBF",
          data: this.listDatasets,
        },
      ],
    };
  }
  options = {
    title: {
      display: true,
      text:
        "Biểu đồ thống kê số lượng nhân viên tham gia khóa học trong năm " +
        this.year,

      position: "bottom",
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        padding: 20,
        generateLabels: function (chart: any) {
          var labels = chart.data.labels;
          var dataset = chart.data.datasets[0];
          var legend = labels.map(function (label: any, index: number) {
            var total = dataset.data.reduce(function (
              previousValue: any,
              currentValue: any,
              currentIndex: any,
              array: any
            ) {
              return previousValue + currentValue;
            });
            //get the current items value
            var currentValue = dataset.data[index];
            //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
            var percentage = Math.floor((currentValue / total) * 100 + 0.5);

            var text = " (" + currentValue + ": " + percentage + "%) ";
            return {
              datasetIndex: 0,
              fillStyle:
                dataset.backgroundColor && dataset.backgroundColor[index],
              // strokeStyle: dataset.borderColor && dataset.borderColor[index],
              // lineWidth: dataset.borderWidth,
              text: label + text,
            };
          });
          return legend;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    height: 100,

    datalabels: {
      borderWidth: 5,
      borderColor: "white",
      borderRadius: 8,
      // color: 0,
      font: {
        weight: "bold",
      },
      backgroundColor: "lightgray",
    },

    tooltips: {
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          //get the concerned dataset
          var dataset = data.datasets[tooltipItem.datasetIndex];
          //calculate the total of this data set
          var total = dataset.data.reduce(function (
            previousValue: any,
            currentValue: any,
            currentIndex: any,
            array: any
          ) {
            return previousValue + currentValue;
          });
          //get the current items value
          var currentValue = dataset.data[tooltipItem.index];
          //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
          var percentage = Math.floor((currentValue / total) * 100 + 0.5);
          var text = data.labels[tooltipItem.index];

          return text + " (" + currentValue + ": " + percentage + "%)";
        },
      },
    },
  };
  mounted() {
    this.getData(this.year);
    this.renderChart(this.datacollection, this.options);
  }

  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
  }
  poolColors(length: number) {
    const pool = [];
    for (let i = 0; i < length; i++) {
      pool.push(this.dynamicColors());
    }
    return pool;
  }
}
</script>
