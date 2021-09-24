<template>
  <v-app>
    <!-- -->
    <TheNavigation v-if="!$route.meta.hideNavigation" />

    <!-- Sizes your content based upon application components -->
    <v-main
      :class="
        !$route.meta.hideNavigation
          ? 'grey lighten-4'
          : 'deep-purple accent-4 align-center'
      "
    >
      <!-- Provides the application the proper gutter -->
      <v-container
        :class="$route.meta.hideNavigation ? 'd-flex justify-center' : 'pa-8'"
      >
        <!-- If using vue-router -->
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-main>

    <v-footer app v-if="!$route.meta.hideNavigation">
      <!-- -->
    </v-footer>

    <SnackBarAlert />
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import TheNavigation from "@/components/TheNavigation.vue";
import SnackBarAlert from "@/components/SnackBarAlert.vue";

@Component({
  components: {
    TheNavigation,
    SnackBarAlert,
  },
})
export default class App extends Vue {}
</script>
