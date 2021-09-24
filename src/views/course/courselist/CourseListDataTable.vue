<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="courses"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          :loading="isLoading"
          :search="search"
          fixed-header
          :height="570"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat class="px-2">
              <v-toolbar-title>
                {{ $t("courseList.datatable.title") }}
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                :value="itemsPerPage"
                label="Items"
                type="number"
                min="5"
                max="30"
                dense
                outlined
                hide-details="true"
                class="shrink mr-4"
                @input="
                  itemsPerPage =
                    parseInt($event, 10) < 50 ? parseInt($event, 10) : 50 || 5
                "
              ></v-text-field>
              <v-btn
                color="primary"
                dark
                :to="`/${$i18n.locale}/course/register`"
              >
                {{ $t("courseList.datatable.btnAdd") }}
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:[`item.id`]="{ index }">
            <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
          </template>
          <template v-slot:[`item.name`]="{ item }">
            <v-btn
              class="justify-start"
              width="100%"
              height="100%"
              text
              :to="{
                name: 'courseDetail',
                params: { id: item.id },
              }"
              >{{ item.name }}</v-btn
            >
          </template>
          <template v-slot:[`item.course_type`]="{ item }">
            <v-chip
              v-if="item.course_type === '1'"
              class="ma-2 black--text"
              color="green lighten-3"
              label
              >{{ $t("courseList.courseType.course") }}</v-chip
            >
            <v-chip
              v-else
              class="ma-2 black--text"
              color="light-blue lighten-3"
              label
              >{{ $t("courseList.courseType.event") }}</v-chip
            >
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              :to="{
                name: 'courseEdit',
                params: { id: item.id },
              }"
              min-width="25"
              text
            >
              <v-icon small class="primary--text"> mdi-pencil </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

@Component
export default class CourseListDataTable extends Vue {
  @PropSync("coursesSync", { type: Array }) courses!: any;
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @PropSync("searchByNameSync", { type: String }) searchByName!: string;
  @PropSync("searchByCourseTypeSync", { type: String })
  searchByCourseType!: string;
  @PropSync("searchByWeekdaysSync", { type: String }) searchByWeekdays!: string;
  @PropSync("searchByStartFromSync", { type: String })
  searchByStartFrom!: string;
  @PropSync("searchByStartToSync", { type: String }) searchByStartTo!: string;
  @PropSync("searchByEndFromSync", { type: String }) searchByEndFrom!: string;
  @PropSync("searchByEndToSync", { type: String }) searchByEndTo!: string;
  @PropSync("searchByTimeSync", { type: String }) searchByTime!: string;
  itemsPerPage = 25;
  page = 1;
  pageCount = 0;
  search = "";

  editItem(item: any) {
    const path = `/courses/detail/${item.id}`;
    this.$router.push(path);
  }

  get headers() {
    return [
      {
        text: this.$t("courseList.datatable.header.id"),
        align: "center",
        sortable: false,
        value: "id",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.name"),
        align: "start",
        value: "name",
        filter: (f: any) => {
          return (f + "")
            .toLowerCase()
            .includes(this["searchByName"].toLowerCase());
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.courseType"),
        align: "center",
        value: "course_type",
        filter: (value: any) => {
          if (!this.searchByCourseType) return true;
          return value === this.searchByCourseType;
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.startDate"),
        align: "start",
        value: "start_date",
        filter: (value: any) => {
          if (!this.searchByStartFrom && !this.searchByStartTo) {
            return true;
          }
          return value > this.searchByStartFrom && value < this.searchByStartTo;
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.endDate"),
        align: "start",
        value: "end_date",
        filter: (value: any) => {
          if (!this.searchByEndFrom && !this.searchByEndTo) {
            return true;
          }
          return value > this.searchByEndFrom && value < this.searchByEndTo;
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.weekdays"),
        align: "start",
        value: "weekdays",
        filter: (f: any) => {
          return (f + "")
            .toLowerCase()
            .includes(this["searchByWeekdays"].toLowerCase());
        },
        sortable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.time"),
        align: "center",
        value: "time",
        filter: (value: any) => {
          if (!this.searchByTime) return true;
          return value > this.searchByTime;
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.note"),
        align: "center",
        value: "note",
        sortable: false,
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseList.datatable.header.actions"),
        align: "center",
        value: "actions",
        filterable: false,
        sortable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
    ];
  }
}
</script>
