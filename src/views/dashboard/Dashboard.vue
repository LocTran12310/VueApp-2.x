<template>
  <v-row align="stretch">
    <v-col cols="6" class="d-flex flex-column">
      <v-card class="flex d-flex flex-column">
        <v-card-text class="flex">
          <v-row dense>
            <v-col cols="12" class="text-end mb-4">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="printChart"
                    v-bind="attrs"
                    v-on="on"
                    class="primary"
                    >PRINT</v-btn
                  >
                </template>
                <span>Print PDF</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <TheBarChart :chart-id="'the_bar_chart'" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6" class="d-flex flex-column">
      <v-card class="flex d-flex flex-column">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-col cols="3" sm="4" md="3" class="pa-0">
            <v-text-field
              label="Năm"
              :height="20"
              dense
              :value="year"
              hide-details
              type="number"
              outlined
              @change="(value) => (year = value)"
              class="shrink mr-4"
            ></v-text-field>
          </v-col>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="exportToImage(`the_pie_chart`)"
                v-bind="attrs"
                v-on="on"
                class="primary"
                >EXPORT</v-btn
              >
            </template>
            <span>Export to PNG</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text class="flex">
          <ThePieChart :year="year" :chart-id="`the_pie_chart`" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6" class="d-flex flex-column">
      <v-card class="flex d-flex flex-column">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="10" md="5" class="pa-0 pr-4">
            <input-date-picker
              :datePicker.sync="isDatePickerShow"
              :dateString.sync="date"
              :outlined="true"
              :hideDetails="true"
              :dense="true"
              :label="`Ngày`"
              :singleLine="true"
            />
          </v-col>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="exportToImage('the_bar_chart_leave')"
                v-bind="attrs"
                v-on="on"
                class="primary"
                >EXPORT</v-btn
              >
            </template>
            <span>Export to PNG</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text class="flex">
          <TheBarChartLeave
            :date="date"
            :dateFormatted="dateFormatted"
            :chart-id="`the_bar_chart_leave`"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import TheBarChart from "./TheBarChart.vue";
import ThePieChart from "./ThePieChart.vue";
import TheBarChartLeave from "./TheBarChartLeave.vue";
import InputDatePicker from "@/components/InputDatePicker.vue";

@Component({
  components: {
    TheBarChart,
    ThePieChart,
    TheBarChartLeave,
    InputDatePicker,
  },
})
export default class Dashboard extends Vue {
  isDatePickerShow = false;

  year = new Date().getFullYear().toString();
  date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10);

  get dateFormatted() {
    return this.formatDate(this.date);
  }
  formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }
  parseDate(date) {
    if (!date) return null;

    const [day, month, year] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  printChart() {
    const canvasEle = document.getElementById("the_bar_chart");
    const win = window.open("", "Print", "height=600,width=800");
    win.document.write("<br><img src='" + canvasEle.toDataURL() + "' />");
    setTimeout(function () {
      //giving it 200 milliseconds time to load
      win.document.close();
      win.focus();
      win.print();
      win.location.reload();
    }, 200);
  }
  exportToImage(elementId) {
    let canvas = document.getElementById(elementId).toDataURL("image/png");
    let link = document.createElement("a");
    link.download = "bieu_do_thong_ke";
    link.href = canvas;
    link.click();
  }
}
</script>
