<template>
  <v-responsive
    class="grey lighten-4 rounded-lg"
    max-width="70%"
    min-width="70%"
    min
  >
    <v-flex justify="center" class="">
      <v-row>
        <v-col
          sm="0"
          md="4"
          class="grey lighten-2 d-flex justify-center align-center"
        >
          <v-img
            alt="Vue logo"
            src="@/assets/logo.png"
            max-width="150"
            min-height="150"
          />
        </v-col>
        <v-col sm="12" md="8">
          <h1 class="text-center mt-10">LOGIN</h1>
          <v-alert
            v-if="error"
            prominent
            text
            type="error"
            class="mx-10 rounded-lg mt-5"
          >
            {{ error }}
          </v-alert>
          <v-form ref="form" dark class="ma-10 text-center">
            <v-text-field
              v-model="username"
              :rules="rules.username"
              label="Username"
              outlined
              prepend-inner-icon="mdi-account"
              @keydown.enter.prevent="login"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="rules.password"
              :type="isShow ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :append-icon="isShow ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="isShow = !isShow"
              @keydown.enter.prevent="login"
              outlined
              required
            ></v-text-field>
            <v-btn
              @click="login"
              :loading="isLoading"
              class="deep-purple accent-4 white--text"
              width="100%"
              >Submit</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
    </v-flex>
  </v-responsive>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/index";
import i18n from "@/i18n";

@Component
export default class Login extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };
  username = "";
  password = "";
  isShow = false;
  rules = {
    username: [(v: any) => !!v || "Name is required"],
    password: [(v: any) => !!v || "Password is required"],
  };
  error = "";
  isLoading = false;
  async login(): Promise<void> {
    if (this.$refs.form.validate()) {
      this.isLoading = true;
      const user = JSON.stringify({
        login_id: this.username,
        password: this.password,
      });
      try {
        await store.dispatch("user/loginAsync", user);
        const alert = {
          isShow: true,
          message: this.$t("snackbar.loginSuccess"),
          icon: "mdi-check-circle",
          color: "success",
        };
        store.dispatch("alert/showAlert", alert);

        const redirectPath =
          this.$route.query.redirect || `${i18n.locale}/dashboard`;
        this.$router.push(redirectPath.toString());
      } catch (err) {
        const alert = {
          isShow: true,
          message: this.$t("snackbar.loginFail"),
          color: "error",
          icon: "mdi-alert-circle",
        };
        store.dispatch("alert/showAlert", alert);

        this.error = "Wrong username or password";
      }
      this.isLoading = false;
    }
  }
}
</script>
