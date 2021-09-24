<template>
  <v-dialog v-model="isShow" max-width="500px">
    <v-card class="pa-5">
      <v-card-title class="text-h5 text-center d-block">{{
        $t("modalDelete.message")
      }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="amber darken-2" class="pr-3" dark @click="cancel">
          <v-icon dense left> mdi-close </v-icon>
          {{ $t("modalDelete.btnCancel") }}</v-btn
        >
        <v-btn
          color="red darken-2"
          dark
          @click="deleteConfirm"
          :loading="isLoading"
          class="pr-3"
        >
          <v-icon dense left> mdi-delete </v-icon>
          {{ $t("modalDelete.btnDelete") }}</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Prop } from "vue-property-decorator";

@Component
export default class ModalDelete extends Vue {
  @PropSync("isModalDeleteShow", { type: Boolean }) isShow!: boolean;
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @Prop(Function) cancel!: any;
  @Prop(Function) deleteConfirm!: any;
}
</script>
