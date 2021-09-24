<template>
  <div>
    <CourseListSearchPanel
      :panelSync.sync="panel"
      :coursesSync.sync="courses"
      :isLoadingSync.sync="isLoading"
      :searchByNameSync.sync="searchByName"
      :searchByCourseTypeSync.sync="searchByCourseType"
      :searchByWeekdaysSync.sync="searchByWeekdays"
      :searchByStartFromSync.sync="searchByStartFrom"
      :searchByStartToSync.sync="searchByStartTo"
      :searchByEndFromSync.sync="searchByEndFrom"
      :searchByEndToSync.sync="searchByEndTo"
      :searchByTimeSync.sync="searchByTime"
    />
    <CourseListDataTable
      :coursesSync.sync="courses"
      :isLoadingSync.sync="isLoading"
      :searchByNameSync.sync="searchByName"
      :searchByCourseTypeSync.sync="searchByCourseType"
      :searchByWeekdaysSync.sync="searchByWeekdays"
      :searchByStartFromSync.sync="searchByStartFrom"
      :searchByStartToSync.sync="searchByStartTo"
      :searchByEndFromSync.sync="searchByEndFrom"
      :searchByEndToSync.sync="searchByEndTo"
      :searchByTimeSync.sync="searchByTime"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import CourseListDataTable from "./CourseListDataTable.vue";
import CourseListSearchPanel from "./CourseListSearchPanel.vue";

@Component({
  components: {
    CourseListDataTable,
    CourseListSearchPanel,
  },
})
export default class CourseList extends Vue {
  isLoading = true;
  panel = [0];
  courses = [];
  searchByName = "";
  searchByCourseType = "";
  searchByWeekdays = "";
  searchByStartFrom = "";
  searchByStartTo = "";
  searchByEndFrom = "";
  searchByEndTo = "";
  searchByTime = "";

  mounted() {
    this.getCourses();
  }

  async getCourses(): Promise<void> {
    this.isLoading = true;

    await store.dispatch("courses/getCourses").then((res: any) => {
      this.courses = store.state.courses.items;
      this.isLoading = false;
    });
  }
}
</script>
