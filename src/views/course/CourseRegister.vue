<template>
  <div>
    <v-card class="pb-4">
      <v-card-title>
        {{ $t("course.titleRegister") }}
        <v-spacer></v-spacer>
        <GoBack />
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="form">
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.name") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <v-text-field
                :rules="rules.name"
                v-model="course.name"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.courseType") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <v-select
                :rules="rules.courseType"
                v-model="course.courseType"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="courseType"
                item-text="name"
                item-value="id"
                return-object
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.time") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <v-text-field
                :rules="rules.time"
                type="time"
                v-model="course.time"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.weekdays") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <v-select
                v-model="course.weekdays"
                :items="weekdays"
                :menu-props="{ bottom: true, offsetY: true }"
                multiple
                chips
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.startDate") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <InputDatePicker
                :rulesSync.sync="rules.startDate"
                :datePicker.sync="datePicker.startDate"
                :dateString.sync="course.startDate"
                :outlined="true"
                :dense="true"
                :setDefault="true"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.endDate") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <InputDatePicker
                :datePicker.sync="datePicker.endDate"
                :dateString.sync="course.endDate"
                :outlined="true"
                :dense="true"
                :setDefault="true"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="5"
              md="3"
              class="body-1 black--text pt-3 pl-8"
              >{{ $t("course.note") }}</v-col
            >
            <v-col cols="12" sm="7" md="5">
              <v-textarea v-model="course.note" outlined dense></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" @click="register" :loading="isLoading">
            <v-icon dense left>mdi-content-save-outline</v-icon>
            {{ $t("course.btnRegister") }}
          </v-btn>
          <v-btn color="amber darken-2 white--text" @click="cancel">
            <v-icon dense left>mdi-close</v-icon>
            {{ $t("course.btnCancel") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import InputDatePicker from "@/components/InputDatePicker.vue";
import GoBack from "@/components/GoBack.vue";
import store from "@/store/index";

@Component({
  components: {
    InputDatePicker,
    GoBack,
  },
})
export default class CourseRegister extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };
  isLoading = false;
  course = {
    name: "",
    courseType: { id: "", name: "" },
    time: "",
    weekdays: [],
    startDate: "",
    endDate: "",
    note: "",
  };
  defaultForm = {
    name: "",
    courseType: { id: "", name: "" },
    time: "",
    weekdays: [],
    startDate: "",
    endDate: "",
    note: "",
  };
  courseType = [
    { id: "1", name: "Khóa học" },
    { id: "2", name: "Event" },
  ];
  weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
  datePicker = {
    startDate: false,
    endDate: false,
  };
  rules = {
    name: [(v: any) => !!v || this.$t("course.rules.name")],
    courseType: [
      (v: any) =>
        JSON.parse(JSON.stringify(v)).id != "" ||
        this.$t("course.rules.courseType"),
    ],
    time: [(v: any) => !!v || this.$t("course.rules.time")],
    startDate: [(v: any) => !!v || this.$t("course.rules.startDate")],
  };
  async register() {
    this.isLoading = true;
    if (this.$refs.form.validate()) {
      try {
        const filterWeekdays = this.course.weekdays.sort((a: any, b: any) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        const course = JSON.stringify({
          name: this.course.name,
          course_type: this.course.courseType.id,
          time: this.course.time,
          weekdays: filterWeekdays.toString(),
          start_date: this.course.startDate,
          end_date: this.course.endDate,
          note: this.course.note,
          created_user: store.state.user?.user?.user?.login_id,
        });

        await store.dispatch("courses/createCourse", course);
        const alert = {
          isShow: true,
          message: this.$t("snackbar.addSuccess"),
          icon: "mdi-check-circle",
          color: "success",
        };
        store.dispatch("alert/showAlert", alert);
        this.cancel();
      } catch (err) {
        const alert = {
          isShow: true,
          message: this.$t("snackbar.addFail"),
          icon: "mdi-error-circle",
          color: "error",
        };
        store.dispatch("alert/showAlert", alert);
      }
    }
    this.isLoading = false;
  }
  cancel() {
    this.$refs.form.resetValidation();
    this.course = Object.assign({}, this.defaultForm);
  }
}
</script>
