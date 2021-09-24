<template>
  <v-layout column>
    <v-card>
      <v-card-title class="font-weight-bold px-8 headline pb-md-8">{{
        $t("userDetail.title")
      }}</v-card-title>
      <v-card-text class="px-8 pb-8">
        <v-row>
          <v-col cols="12" sm="5" md="3">
            <v-card elevation="0" max-width="220" tile>
              <v-img
                height="100%"
                :src="baseURL + profile.image"
                class="lighten-4"
              ></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" sm="7" md="9" class="py-0">
            <v-card elevation="0">
              <v-card-title class="pt-0 font-weight-bold">{{
                profile.name
              }}</v-card-title>
              <v-card-subtitle>{{
                getPosition(profile.position_id)
              }}</v-card-subtitle>
              <v-card-text class="py-0">
                <v-list>
                  <v-list-item
                    v-for="info in listInfos"
                    :key="info.icon"
                    class="px-0"
                  >
                    <v-icon left>{{ info.icon }}</v-icon>
                    <v-list-item-title>{{ info.content }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-for="detail in listInfosDetail" :key="detail.title">
          <v-col cols="12" sm="5" md="3">
            <v-list-item-title
              class="black--text font-weight-bold text-sm-right px-4"
              >{{ detail.title }}</v-list-item-title
            >
          </v-col>
          <v-col cols="12" sm="7" md="9">
            <v-list-item-title class="black--text px-4">{{
              detail.content
            }}</v-list-item-title>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { BASE_URL } from "@/constants/constants";
import moment from "moment";
import store from "@/store/index";

@Component
export default class User extends Vue {
  baseURL = BASE_URL + "/auth/user/";
  user = store.state.user.user.user;
  profile = store.state.user.user.profile;

  loading = false;

  listInfos = [
    { icon: "mdi-map-marker-outline", content: this.profile.address },
    { icon: "mdi-cellphone", content: this.profile.mobile },
    { icon: "mdi-email-outline", content: this.profile.email },
  ];
  listInfosDetail = [
    {
      title: this.$t("userDetail.employeeID"),
      content: this.profile.employee_id,
    },
    {
      title: this.$t("userDetail.department"),
      content: this.getDepartment(this.profile.department_id),
    },
    {
      title: this.$t("userDetail.position"),
      content: this.getPosition(this.profile.position_id),
    },

    {
      title: this.$t("userDetail.gender"),
      content: this.getGender(this.profile.gender),
    },
    {
      title: this.$t("userDetail.birthday"),
      content: moment(this.profile.birthday).format("YYYY-MM-DD"),
    },
    {
      title: this.$t("userDetail.officalDate"),
      content: this.profile.official_date,
    },
    {
      title: this.$t("userDetail.probationDate"),
      content: this.profile.probation_date,
    },
  ];
  getDepartment(item: any) {
    switch (item) {
      case 1:
        return "Bộ phận 1";
      case 2:
        return "Bộ phận 2";
      case 3:
        return "Bộ phận 3";
      case 4:
        return "Bộ phận 4";
      default:
        break;
    }
  }
  getPosition(item: any) {
    switch (item) {
      case 1:
        return "Vị trí 1";
      case 2:
        return "Vị trí 2";
      case 3:
        return "Vị trí 3";
      case 4:
        return "Vị trí 4";
      default:
        break;
    }
  }
  getGender(item: any) {
    return item === 1 ? "Male" : "Female";
  }
}
</script>
