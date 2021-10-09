<template>
  <div>
    <WorkdaySearchPanel
      :panelSync.sync="panel"
      :employeeIdSearchSync.sync="employeeIdSearch"
      :yearSync.sync="year"
      :monthSync.sync="month"
      :searchWorkday="searchWorkday"
    />
    <WorkdayDataTable
      :isLoadingSync.sync="isLoading"
      :daysArraySync.sync="daysArray"
      :leaveTypes="leaveTypes"
      :leaveReasons="leaveReasons"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import WorkdaySearchPanel from "./WorkdaySearchPanel.vue";
import WorkdayDataTable from "./WorkdayDataTable.vue";

@Component({
  components: {
    WorkdaySearchPanel,
    WorkdayDataTable,
  },
})
export default class Workday extends Vue {
  isLoading = false;
  employeeIdSearch = "";
  employeeId = store.state.user.user.profile.employee_id;
  panel = [0];
  dateNow = new Date();
  month = this.dateNow.getMonth() + 1; //realMonth
  year = this.dateNow.getFullYear();

  daysArray: any[] = [];
  leaveDetails: any[] = [];
  leaveTypes: any[] = [];
  leaveReasons: any[] = [];

  async searchWorkday() {
    this.isLoading = true;
    try {
      this.employeeId = this.employeeIdSearch.split(" ")[0];
      this.leaveDetails = await store.dispatch(
        "leaveDetails/getLeaveDetails",
        this.employeeId
      );
      this.daysArray = await this.getDaysArray(this.year, this.month);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.searchSuccess"),
        color: "success",
        icon: "mdi-check-circle",
      };
      store.dispatch("alert/showAlert", alert);
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.searchFail"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("alert/showAlert", alert);
    }
    this.isLoading = false;
  }

  async mounted() {
    try {
      this.leaveDetails = await store.dispatch(
        "leaveDetails/getLeaveDetails",
        this.employeeId
      );
      this.leaveTypes = await store.dispatch("leaveTypes/getLeaveTypes");
      this.leaveReasons = await store.dispatch("leaveReasons/getLeaveReasons");
      this.daysArray = await this.getDaysArray(this.year, this.month);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserIdByEmployeeId() {
    this.employeeId;
  }

  getDaysArray(year: number, month: number) {
    var daysInWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var realMonth = month - 1;
    var l = numDaysInMonth[realMonth] + 1;
    var daysArray = [];

    for (var i = 1; i < l; i++) {
      let d = new Date(year, realMonth, i);
      let date = getDate(i, year, month);
      const leaveDetails = this.leaveDetails.map((item: any) => {
        return getLeaveDetails(item, date);
      });
      var leaveDetail = {
        leaveType: "",
        leaveReason: "",
        note: "",
      };
      for (let i = 0; i < leaveDetails.length; i++) {
        if (leaveDetails[i].leaveType !== "") {
          leaveDetail = leaveDetails[i];
          break;
        }
      }
      let obj = {
        date: date,
        weekday: daysInWeek[d.getDay()].slice(0, 3),
        leave_type_id: leaveDetail.leaveType,
        leave_reason_id: leaveDetail.leaveReason,
        note: leaveDetail.note,
      };
      daysArray.push(obj);
    }

    return daysArray;

    function getDate(index: number, year: number, month: number) {
      let date = index.toString(),
        monthString = month.toString();
      if (index < 10) {
        date = "0" + index;
      }
      if (month < 10) {
        monthString = "0" + month;
      }

      let dateString = year + "-" + monthString + "-" + date;
      return dateString;
    }
    function getLeaveDetails(item: any, date: string) {
      let leaveType = "";
      let leaveReason = "";
      let note = "";
      let startDate = item.start_date.split(" ")[0];
      let endDate = item.end_date.split(" ")[0];

      if (date >= startDate && date <= endDate) {
        leaveType = item.leave_type_id;
        leaveReason = item.leave_reason_id;
        note = item.note;
      }

      return { leaveType, leaveReason, note };
    }
  }
}
</script>
