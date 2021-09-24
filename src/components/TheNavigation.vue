<template>
  <nav id="nav">
    <v-app-bar color="deep-purple accent-4" dense app dark clipped-left>
      <v-app-bar-nav-icon @click="setDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>The Vue App</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu bottom :offset-y="true" left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark text v-bind="attrs" v-on="on" class="mr-4">
            <v-img
              :src="`/flag_${$i18n.locale}.svg`"
              alt="flag_en_us"
              max-height="24"
              max-width="24"
              class="mr-2"
            ></v-img>
            <span>{{ $i18n.locale.toUpperCase() }}</span>
            <v-icon right>mdi-arrow-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click.prevent="setLocale('en')">
            <v-img
              src="/flag_en.svg"
              alt="flag_en_us"
              max-height="24"
              max-width="24"
              class="mr-2"
            ></v-img>
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item @click.prevent="setLocale('vi')">
            <v-img
              src="/flag_vi.svg"
              alt="flag_vi"
              max-height="24"
              max-width="24"
              class="mr-2"
            ></v-img>
            <v-list-item-title>Tiếng Việt</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu bottom :offset-y="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark text v-bind="attrs" v-on="on" fab small>
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in navMenuItems"
            :key="item.linkTo"
            router
            :to="`/${$i18n.locale}/${item.linkTo}`"
          >
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="isDrawer" stateless app fixed clipped>
      <template v-slot:prepend>
        <v-layout column align-center>
          <v-card flat class="text-center">
            <v-card-title> The Vue App </v-card-title>
            <v-card-subtitle>INTERNSHIP</v-card-subtitle>
          </v-card>
          <!-- <v-flex class="mt-5">
            <v-avatar size="100">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
            <p class="subheading mt-1 text-center">
              {{ user.user.login_id }}
            </p>
          </v-flex> -->
        </v-layout>
      </template>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group
          v-for="(item, i) in navDrawerItems"
          :key="i"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-if="!item.subItems"
            :key="item.title"
            router
            :to="`/${$i18n.locale}/${item.linkTo}`"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>

          <v-list-group v-else :key="item.title" no-action>
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="subItem in item.subItems"
              :key="subItem.title"
              router
              :to="`/${$i18n.locale}/${subItem.linkTo}`"
            >
              <v-list-item-title>{{ $t(subItem.title) }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ $t("navDrawer.logout") }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            @click="logout"
            :loading="isLoading"
            class="deep-purple accent-4 white--text"
          >
            Logout
          </v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class TheNavigation extends Vue {
  isDrawer = true;
  isLoading = false;
  user = store.state.user.user;
  navMenuItems = [
    { title: "nav.menu.profile", linkTo: "user" },
    { title: "nav.menu.changePassword", linkTo: "changepassword" },
  ];
  navDrawerItems = [
    {
      title: "navDrawer.home",
      icon: "mdi-view-dashboard",
      linkTo: "dashboard",
    },
    {
      title: "navDrawer.profiles",
      icon: "mdi-account-box-multiple",
      linkTo: "profile",
    },
    {
      title: "navDrawer.courses",
      icon: "mdi-bookshelf",
      linkTo: "course",
    },
    {
      title: "navDrawer.master",
      icon: "mdi-hexagon-multiple",
      subItems: [
        {
          title: "navDrawer.masterPositions",
          linkTo: "positions",
        },
        {
          title: "navDrawer.masterDepartments",
          linkTo: "departments",
        },
      ],
    },
  ];
  setDrawer() {
    this.isDrawer = !this.isDrawer;
  }

  setLocale(locale: any) {
    this.$i18n.locale = locale;
    this.$router.push({
      params: { lang: locale },
    });
  }

  async logout(): Promise<void> {
    try {
      this.isLoading = true;
      await store.dispatch("user/logoutAsync");

      this.isLoading = false;

      const alert = {
        isShow: true,
        message: this.$t("snackbar.logoutSuccess"),
        color: "success",
        icon: "mdi-check-circle",
      };
      store.dispatch("alert/showAlert", alert);

      this.$router.push("/");
    } catch (err) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.logoutFail"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("showSnackBarAlert", alert);
    }
  }
}
</script>
