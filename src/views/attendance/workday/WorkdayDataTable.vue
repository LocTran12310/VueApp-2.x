<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-card-title>{{ $t("workday.titleDataTable") }}</v-card-title>
        <v-data-table
          :headers="headers"
          :items="daysArray"
          :loading="isLoading"
          :items-per-page="31"
          :item-class="rowClasses"
          fixed-header
          :height="620"
          hide-default-footer
          sort-by="date"
          class="elevation-0"
        >
          <template v-slot:[`item.leave_type_id`]="{ item }">
            <span>{{ getLeaveType(item.leave_type_id) }}</span>
          </template>
          <template v-slot:[`item.leave_reason_id`]="{ item }">
            <span>{{ getLeaveReason(item.leave_reason_id) }}</span>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">
              {{ $t("profileList.datatable.btnReset") }}
            </v-btn>
          </template>
        </v-data-table>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import store from "@/store";

@Component
export default class WorkdayDataTable extends Vue {
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @PropSync("daysArraySync", { type: Array }) daysArray!: any;

  rowClasses(item: any) {
    if (item.leave_type_id !== "" || item.leave_reason_id !== "") {
      return "red lighten-1";
    }
    if (item.weekday == "Sun" || item.weekday == "Sat") {
      return "amber accent-1";
    }
  }

  getLeaveType(id: any) {
    return store.state.leave.types && store.state.leave.types.length
      ? store.state.leave.types
          .filter((type: any) => type.id === id)
          .map((filtered: any) => filtered.name)
          .toString()
      : "";
  }

  getLeaveReason(id: any) {
    return store.state.leave.reasons && store.state.leave.reasons.length
      ? store.state.leave.reasons
          .filter((reason: any) => reason.id === id)
          .map((filtered: any) => filtered.name)
          .toString()
      : "";
  }

  headers = [
    {
      text: this.$t("workday.date"),
      value: "date",
      sortable: false,
      width: "120px",
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("workday.weekday"),
      value: "weekday",
      sortable: false,
      width: "50px",
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("workday.leaveType"),
      value: "leave_type_id",
      sortable: false,
      divider: true,
      align: "center",
      width: "220px",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("workday.leaveReason"),
      value: "leave_reason_id",
      sortable: false,
      divider: true,
      align: "center",
      width: "220px",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("workday.note"),
      value: "note",
      sortable: false,
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
  ];
}
</script>
