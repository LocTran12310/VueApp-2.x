<script lang="ts">
import Vue from "vue";
import { Bar, mixins } from "vue-chartjs";
import { ChartOptions } from "chart.js";
import store from "@/store";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
const { reactiveData } = mixins;

@Component({
  extends: Bar,
})
export default class Th extends Mixins(reactiveData, Bar) {
  // @Prop() options!: ChartOptions;
  // @Prop() datacollection!: any;
  @Prop() date!: string;
  @Prop() dateFormatted!: string;

  allLeaveDetails = [];
  datacollection = {};
  employeesLeave: any[] = [];
  employeesAttendant: any[] = [];
  leaveDetailsByDate: any[] = [];

  @Watch("date")
  onYearChange(date: string) {
    this.getData(date);
    this.options.title.text =
      "Biểu đồ thống kê số lượng nhân viên nghỉ ngày " + this.dateFormatted;
    this.renderChart(this.datacollection, this.options);
  }

  getData(date: string) {
    this.leaveDetailsByDate.length = 0;
    this.allLeaveDetails.map((item: any) => {
      let startDate = item.start_date.split(" ")[0];
      let endDate = item.end_date.split(" ")[0];

      if (startDate <= date && date <= endDate) {
        this.leaveDetailsByDate.push(item);
      }
    });
    //
    this.employeesLeave[0] = this.leaveDetailsByDate.length;
    this.employeesAttendant[0] =
      store.state.profiles?.items?.result?.length -
      this.leaveDetailsByDate.length;

    this.datacollection = {
      labels: ["Ngày " + this.dateFormatted],
      datasets: [
        {
          label: "Nhân viên nghỉ",
          backgroundColor: "pink",
          pointBackgroundColor: "white",
          borderWidth: 1,
          pointBorderColor: "#249EBF",
          // data: this.yearDatasets,
          data: this.employeesLeave,
        },
        {
          label: "Nhân viên có mặt",
          backgroundColor: "#249EBF",
          pointBackgroundColor: "white",
          borderWidth: 1,
          pointBorderColor: "#249EBF",
          // data: this.yearDatasets,
          data: this.employeesAttendant,
        },
      ],
    };
  }

  options = {
    title: {
      display: true,
      text: "Biểu đồ thống kê số lượng nhân viên nghỉ trong ngày ",
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

  async mounted() {
    // this.chartData is created in the mixin
    this.allLeaveDetails = await store.dispatch(
      "leaveDetails/getAllLeaveDetails"
    );
    await this.getData(this.date);
    this.chartData;
    this.renderChart(this.datacollection, this.options);
  }
}
</script>
