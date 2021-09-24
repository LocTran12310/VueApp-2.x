<template>
  <div>
    <ProfileListSearchPanel
      :panelSync.sync="panel"
      :profiles.sync="profiles"
      :searchByIdSync.sync="searchById"
      :searchByNameSync.sync="searchByName"
      :searchByDepartmentSync.sync="searchByDepartment"
      :searchByPositionSync.sync="searchByPosition"
    />
    <ProfileListDataTable
      :profilesSync.sync="profiles"
      :isLoadingSync.sync="isLoading"
      :searchByIdSync.sync="searchById"
      :searchByNameSync.sync="searchByName"
      :searchByDepartmentSync.sync="searchByDepartment"
      :searchByPositionSync.sync="searchByPosition"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ProfileListSearchPanel from "@/views/profile/ProfileListSearchPanel.vue";
import ProfileListDataTable from "@/views/profile/ProfileListDataTable.vue";
import store from "@/store/index";

@Component({
  components: {
    ProfileListSearchPanel,
    ProfileListDataTable,
  },
})
export default class ProfileList extends Vue {
  panel = [0];
  // maxPage = 0;
  isLoading = true;
  searchById = "";
  searchByName = "";
  searchByDepartment = "";
  searchByPosition = "";

  profiles: any[] = [];
  mounted() {
    //this.getProfiles(this.page); //if Pagination By Server
    this.getProfiles();
  }
  //async getProfiles(): Promise<void> {  //if Pagination By Server
  async getProfiles(): Promise<void> {
    this.isLoading = true;
    //IF queryParams empty ==> return ALL PROFILES
    const queryParams = {
      // numPage: value,
      // numRow: this.itemsPerPage,
    };
    await store.dispatch("profiles/getProfiles", queryParams).then((res) => {
      //this.maxPage = res.maxPage;
      this.profiles = res.result;
      this.isLoading = false;
    });
  }
}
</script>
