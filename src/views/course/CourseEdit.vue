<template>
  <div>
    <v-card class="pb-4">
      <v-card-title>
        {{ $t("course.titleEdit") }}
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
                v-model="editedCourse.name"
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
                v-model="selectCourseType"
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
                v-model="editedCourse.time"
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
                v-model="selectWeekdays"
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
                :dateString.sync="editedCourse.start_date"
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
                :dateString.sync="editedCourse.end_date"
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
              <v-textarea
                v-model="editedCourse.note"
                outlined
                dense
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="green darken-2 white--text"
            :to="{
              name: 'courseParticipants',
              params: {
                courseId: course.id,
              },
            }"
          >
            <v-icon dense left>mdi-account-group-outline</v-icon>
            {{ $t("course.btnDetail") }}</v-btn
          >
          <v-btn color="primary" @click="saveCourse" :loading="isLoading">
            <v-icon dense left>mdi-content-save-edit-outline</v-icon>

            {{ $t("course.btnSave") }}</v-btn
          >
          <v-btn color="amber darken-2 white--text" @click="cancelCourse">
            <v-icon dense left>mdi-close</v-icon>
            {{ $t("course.btnCancel") }}</v-btn
          >
          <v-btn color="red darken-2 white--text" @click="deleteCourse">
            <v-icon dense left>mdi-delete</v-icon>
            {{ $t("course.btnDelete") }}</v-btn
          >
        </v-card-actions>
      </v-form>
      <ModalDelete
        :isLoadingSync.sync="isLoading"
        :isModalDeleteShow.sync="isModalDeleteShow"
        :cancel="closeModalDetele"
        :deleteConfirm="deleteCourseConfirm"
      />
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import InputDatePicker from "@/components/InputDatePicker.vue";
import GoBack from "@/components/GoBack.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import store from "@/store/index";

@Component({
  components: {
    InputDatePicker,
    GoBack,
    ModalDelete,
  },
})
export default class CourseEdit extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };
  isLoading = false;
  isModalDeleteShow = false;
  editedCourse = Object.assign({}, this.course); //Clone object course

  select = {
    courseType: { id: "", name: "" },
    weekdays: [],
  };
  courseType = [
    { id: "1", name: this.$t("course.courseTypes.course").toString() },
    { id: "2", name: this.$t("course.courseTypes.event").toString() },
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

  async saveCourse() {
    this.isLoading = true;
    if (this.$refs.form.validate()) {
      try {
        const editedCourse = this.editedCourse;
        editedCourse["updated_user"] = store.state.user?.user?.user?.login_id;
        await store.dispatch("courses/updateCourse", editedCourse);
        const alert = {
          isShow: true,
          message: this.$t("snackbar.editSuccess"),
          icon: "mdi-check-circle",
          color: "success",
        };
        store.dispatch("alert/showAlert", alert);
      } catch (error) {
        const alert = {
          isShow: true,
          message: this.$t("snackbar.editFail"),
          icon: "mdi-error-circle",
          color: "error",
        };
        store.dispatch("alert/showAlert", alert);
      }
    }
    this.isLoading = false;
  }

  cancelCourse() {
    this.editedCourse = Object.assign({}, this.course);
    this.$router.push({ name: "course" });
  }
  closeModalDetele() {
    this.isModalDeleteShow = false;
  }
  deleteCourse() {
    this.isModalDeleteShow = true;
  }

  async deleteCourseConfirm() {
    try {
      const id = this.editedCourse.id;
      await store.dispatch("courses/deleteCourse", id);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.editSuccess"),
        icon: "mdi-check-circle",
        color: "success",
      };
      store.dispatch("alert/showAlert", alert);
      this.$router.back();
    } catch (error) {
      console.log(error);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.editFail"),
        icon: "mdi-error-circle",
        color: "error",
      };
      store.dispatch("alert/showAlert", alert);
    }
  }

  get course() {
    return store.state.courses?.items?.find(
      (course: any) => course.id === parseInt(this.$route.params.id)
    );
  }

  get selectWeekdays() {
    return this.editedCourse.weekdays != "" ||
      this.editedCourse.weekdays.length != 0
      ? (this.select.weekdays = this.editedCourse.weekdays.split(","))
      : [];
  }
  set selectWeekdays(items: any) {
    const filterWeekdays = items.sort((a: any, b: any) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    this.editedCourse.weekdays = filterWeekdays.toString();
  }
  get selectCourseType() {
    return this.editedCourse.course_type === "1"
      ? (this.select.courseType = this.courseType[0])
      : (this.select.courseType = this.courseType[1]);
  }
  set selectCourseType(item: any) {
    this.editedCourse.course_type = item.id;
  }
}
</script>
