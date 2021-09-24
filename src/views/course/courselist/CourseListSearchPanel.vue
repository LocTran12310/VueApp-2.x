<template>
  <v-expansion-panels v-model="panel" multiple class="mb-8">
    <v-expansion-panel>
      <v-expansion-panel-header
        class="
          deep-purple
          lighten-4
          title
          font-weight-normal
          py-0
          text--secondary
        "
        >{{ $t("courseList.searchPanel.title") }}</v-expansion-panel-header
      >
      <v-expansion-panel-content class="px-0">
        <v-row dense class="mb-0 mt-6">
          <v-col cols="12" sm="6" md="4" class="px-4 py-0">
            <v-combobox
              v-model.trim="select.name"
              :items="coursesName"
              clearable
              dense
              outlined
              @keydown.enter.prevent="searchAction"
              :label="$t('courseList.searchPanel.name')"
            ></v-combobox>
            <v-select
              v-model="select.courseType"
              :menu-props="{ bottom: true, offsetY: true }"
              :items="searchPanel.courseType"
              item-text="name"
              item-value="id"
              return-object
              outlined
              dense
              :label="$t('courseList.searchPanel.courseType')"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="px-4 py-0">
            <InputDatePicker
              :datePicker.sync="searchPanel.datePicker.startFrom"
              :dateString.sync="select.startFrom"
              :setDefault="false"
              :clearable="true"
              :dense="true"
              :outlined="true"
              :label="$t('courseList.searchPanel.startFrom')"
            />
            <InputDatePicker
              :datePicker.sync="searchPanel.datePicker.startTo"
              :dateString.sync="select.startTo"
              :setDefault="false"
              :clearable="true"
              :dense="true"
              :outlined="true"
              :label="$t('courseList.searchPanel.startTo')"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="px-4 py-md-0">
            <InputDatePicker
              :datePicker.sync="searchPanel.datePicker.endFrom"
              :dateString.sync="select.endFrom"
              :setDefault="false"
              :clearable="true"
              :dense="true"
              :outlined="true"
              :label="$t('courseList.searchPanel.endFrom')"
            />
            <InputDatePicker
              :datePicker.sync="searchPanel.datePicker.endTo"
              :dateString.sync="select.endTo"
              :setDefault="false"
              :clearable="true"
              :dense="true"
              :outlined="true"
              :label="$t('courseList.searchPanel.endTo')"
            />
          </v-col>
        </v-row>
        <v-row dense class="my-0">
          <v-col cols="12" sm="6" md="4" class="px-4 py-md-0">
            <v-select
              v-model="select.weekdays"
              :items="searchPanel.weekdays"
              :menu-props="{ bottom: true, offsetY: true }"
              multiple
              chips
              outlined
              dense
              :label="$t('courseList.searchPanel.weekdays')"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="px-4 py-md-0">
            <v-text-field
              v-model="select.time"
              clearable
              outlined
              dense
              type="time"
              :label="$t('courseList.searchPanel.time')"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
            class="px-4 pb-6 py-md-0 d-flex justify-end"
          >
            <v-btn color="primary" dark @click="searchAction">{{
              $t("courseList.searchPanel.btnSearch")
            }}</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import InputDatePicker from "@/components/InputDatePicker.vue";

@Component({
  components: {
    InputDatePicker,
  },
})
export default class CourseListSearchPanel extends Vue {
  @PropSync("panelSync", { type: Array }) panel!: any;
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

  select = {
    name: "",
    courseType: { id: "-1", name: "All" },
    weekdays: [],
    startFrom: "",
    startTo: "",
    endFrom: "",
    endTo: "",
    time: "",
  };
  searchPanel = {
    courseType: [
      { id: "-1", name: this.$t("courseList.courseType.all").toString() },
      { id: "1", name: this.$t("courseList.courseType.course").toString() },
      { id: "2", name: this.$t("courseList.courseType.event").toString() },
    ],
    weekdays: [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ Nhật",
    ],
    datePicker: {
      startFrom: false,
      startTo: false,
      endFrom: false,
      endTo: false,
    },
  };
  searchAction() {
    this.searchByName =
      this.select.name != undefined || this.select.name != null
        ? this.select.name
        : "";
    this.searchByCourseType =
      this.select.courseType.id != "-1" ? this.select.courseType.id : "";
    this.searchByWeekdays =
      this.select.weekdays.length > 0 ? this.select.weekdays.toString() : "";
    this.searchByStartFrom =
      this.select.startFrom !== "" ? this.select.startFrom : "";
    this.searchByStartTo =
      this.select.startTo !== "" ? this.select.startTo : "";
    this.searchByEndFrom =
      this.select.endFrom !== "" ? this.select.endFrom : "";
    this.searchByEndTo = this.select.endTo !== "" ? this.select.endTo : "";

    this.searchByTime =
      this.select.time !== "" || this.select.time != null
        ? this.select.time
        : "";
  }

  get coursesName() {
    return this.courses.map((item: any) => item.name);
  }
}
</script>
