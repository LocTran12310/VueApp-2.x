<template>
  <v-card elevation="-1">
    <v-card-title>{{ $t("changePassword.title") }}</v-card-title>
    <v-divider></v-divider>
    <v-form ref="form" class="white pa-5">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="1" md="2"></v-col>
          <v-col cols="12" sm="3" md="3" class="text-right pt-3">
            <div>
              {{ $t("changePassword.password") }}
              <span class="red--text">*</span>
            </div>
          </v-col>
          <v-col cols="12" sm="7" md="3">
            <v-text-field
              v-model.trim="password"
              :rules="rules.password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" md="4"></v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="1" md="2"></v-col>
          <v-col cols="12" sm="3" md="3" class="text-right pt-3">
            <div>
              {{ $t("changePassword.passwordConfirm") }}
              <span class="red--text">*</span>
            </div>
          </v-col>
          <v-col cols="12" sm="7" md="3">
            <v-text-field
              v-model.trim="passwordConfirm"
              :rules="rules.passwordConfirm.concat(passwordConfirmationRule)"
              :type="showPasswordConfirm ? 'text' : 'password'"
              :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPasswordConfirm = !showPasswordConfirm"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" md="4"></v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="4" md="5"></v-col>
          <v-col cols="12" sm="7" md="3" class="d-flex justify-end">
            <v-btn
              @click="changePassword"
              :loading="isLoading"
              class="w-100 deep-purple accent-4 white--text"
              >{{ $t("changePassword.btnSubmit") }}</v-btn
            >
          </v-col>
          <v-col cols="12" sm="1" md="4"></v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class ChangePassword extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };
  password = "";
  passwordConfirm = "";
  showPassword = false;
  showPasswordConfirm = false;
  isLoading = false;
  rules = {
    password: [(v: any) => !!v || this.$t("changePassword.rules.password")],
    passwordConfirm: [
      (v: any) => !!v || this.$t("changePassword.rules.passwordConfirm"),
    ],
  };
  async changePassword() {
    if (this.$refs.form.validate()) {
      this.isLoading = true;
      try {
        const id = parseInt(store.state.user.user.user.id);
        const user = {
          id: id,
          password: this.password,
        };
        await store.dispatch("user/changePassword", user);
        const alert = {
          isShow: true,
          message: this.$t("snackbar.changePasswordSuccess"),
          icon: "mdi-check-circle",
          color: "success",
        };
        store.dispatch("alert/showAlert", alert);
      } catch (error) {
        const alert = {
          isShow: true,
          message: this.$t("snackbar.changePasswordFail"),
          icon: "mdi-alert-circle",
          color: "error",
        };
        store.dispatch("alert/showAlert", alert);
      }
      this.password = "";
      this.passwordConfirm = "";
      this.$refs.form.resetValidation();
      this.isLoading = false;
    }
  }

  get passwordConfirmationRule() {
    return () =>
      this.password === this.passwordConfirm ||
      this.$t("changePassword.rules.passwordConfirm");
  }
}
</script>
