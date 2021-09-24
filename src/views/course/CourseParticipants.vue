<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="courseParticipants"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          fixed-header
          :height="570"
          hide-default-footer
          :loading="isLoading"
          @page-count="pageCount = $event"
          sort-by="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat class="px-2">
              <v-toolbar-title>
                {{ $t("courseParticipants.title") }}
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                :value="itemsPerPage"
                label="Items"
                type="number"
                min="5"
                max="30"
                dense
                outlined
                hide-details="true"
                class="shrink mr-4"
                @input="
                  itemsPerPage =
                    parseInt($event, 10) < 50 ? parseInt($event, 10) : 50 || 5
                "
              ></v-text-field>
              <v-spacer></v-spacer>
              <GoBack />
              <div>
                <v-btn
                  color="primary"
                  dark
                  @click="importFile"
                  class="ml-4"
                  :loading="isSelecting"
                >
                  UPLOAD
                </v-btn>
                <input
                  ref="fileUploader"
                  @change="onFileChanged"
                  type="file"
                  class="d-none"
                  accept=".xls, .xlsx"
                />
              </div>

              <v-btn
                color="primary"
                dark
                @click="isModalAddShow = true"
                class="ml-4"
              >
                {{ $t("courseParticipants.btnAdd") }}
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.id`]="{ index }">
            <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
          </template>
          <template v-slot:[`item.course_type`]="{ item }">
            <v-chip
              v-if="item.course_type === '1'"
              class="ma-2 black--text"
              color="green lighten-3"
              label
              >{{ $t("courseList.courseType.course") }}</v-chip
            >
            <v-chip
              v-else
              class="ma-2 black--text"
              color="light-blue lighten-3"
              label
              >{{ $t("courseList.courseType.event") }}</v-chip
            >
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="deleteItem(item)" min-width="25" text>
              <v-icon small class="red--text"> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <ModalDelete
          :isLoadingSync.sync="isLoading"
          :isModalDeleteShow.sync="isModalDeleteShow"
          :cancel="cancel"
          :deleteConfirm="deleteConfirm"
        />
        <v-dialog v-model="isModalAddShow" max-width="500px">
          <v-form ref="courseParticipantsFrom">
            <v-card class="pa-5">
              <v-card-title class="text-h5 text-center d-block">{{
                $t("courseParticipants.modalAdd.title")
              }}</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("courseParticipants.modalAdd.employeeName") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <v-autocomplete
                      v-model="name"
                      :rules="rules.employeeName"
                      :items="employeesName"
                      clearable
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="amber darken-2"
                  class="pr-3"
                  dark
                  @click="closeModalAdd"
                >
                  <v-icon dense left> mdi-close </v-icon>
                  {{ $t("courseParticipants.modalAdd.btnCancel") }}</v-btn
                >

                <v-btn
                  color="primary"
                  dark
                  @click="addNew"
                  :loading="isLoading"
                  class="pr-3"
                >
                  <v-icon dense left> mdi-content-save-outline </v-icon>
                  {{ $t("courseParticipants.modalAdd.btnAdd") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-flex>
    </v-layout>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import store from "@/store/index";
import ModalDelete from "@/components/ModalDelete.vue";
import GoBack from "@/components/GoBack.vue";
import XLSX from "xlsx";

@Component({
  components: {
    ModalDelete,
    GoBack,
  },
})
export default class CourseParticipants extends Vue {
  @Ref("fileUploader") fileUploader!: HTMLInputElement;
  $refs!: {
    courseParticipantsFrom: HTMLFormElement;
  };
  isLoading = true;
  itemsPerPage = 25;
  page = 1;
  pageCount = 0;
  courseParticipants: any[] = [];
  // employeesName: any[] = [];
  name = "";
  fileUpload: any = null;
  objectFromFile: any = [];
  isSelecting = false;
  profiles: any[] = [];
  rules = {
    employeeName: [
      (v: any) =>
        !!v || this.$t("courseParticipants.modalAdd.rules.employeeName"),
    ],
  };
  isModalDeleteShow = false;
  isModalAddShow = false;
  deleteItemId = -1;
  deleteIndex = -1;

  getName() {
    return this.name != undefined || this.name != null
      ? this.name.split(" ")
      : "";
  }
  getProfileEmployee() {
    let name = this.getName()[2] ? this.getName()[2] : "";
    return this.profiles.find((item: any) => item.name == name);
  }
  importFile() {
    this.isSelecting = true;
    window.addEventListener(
      "focus",
      () => {
        this.isSelecting = false;
      },
      { once: true }
    );

    this.fileUploader.value = ""; // UPLOAD lan 2
    this.fileUploader.click(); // UPLOAD lan 2
    this.fileUploader.value = ""; // UPLOAD lan 2
  }
  async onFileChanged(event: any) {
    const now = new Date();

    this.fileUpload = event.target.files ? event.target.files[0] : null;
    if (this.fileUpload) {
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        this.objectFromFile = XLSX.utils.sheet_to_json(worksheet);

        const COURSE_ID = parseInt(this.$route.params.id);
        const LOGIN_ID = store.state.user.user.login_id;
        try {
          for (let i = this.objectFromFile.length - 1; i > -1; i--) {
            if (
              // Neu ko thay employee_id hoac password ==> Continue
              this.objectFromFile[i].employee_id === undefined ||
              this.objectFromFile[i].name === undefined
            ) {
              this.objectFromFile.splice(i, 1);
              continue;
            }
            let flag = true; //Khong tim thay thi flag = true
            for (let j = this.profiles.length - 1; j > -1; j--) {
              if (
                this.objectFromFile[i].employee_id ==
                this.profiles[j].employee_id
              ) {
                this.objectFromFile[i]["profile_id"] = this.profiles[j].id;
                this.objectFromFile[i]["course_id"] = COURSE_ID;
                this.objectFromFile[i]["created_user"] = LOGIN_ID;
                flag = false;
              }
            }
            if (flag === true) {
              this.objectFromFile.splice(i, 1); // Delete Object thu i neu khong tim thay
            }
          }
          for (let i = this.objectFromFile.length - 1; i > -1; i--) {
            let flag = false;
            for (let j = this.courseParticipants.length - 1; j > -1; j--) {
              if (
                this.objectFromFile[i].employee_id ===
                this.courseParticipants[j].employee_id
              ) {
                flag = true;
                break;
              }
            }
            if (flag === true) {
              this.objectFromFile.splice(i, 1); //DELETE object thu i neu tim thay
            }
          }

          if (this.objectFromFile && this.objectFromFile.length > 0) {
            this.objectFromFile.map(async (participant: any) => {
              await store
                .dispatch("courses/createCourseParticipant", participant)
                .then((res) => {
                  this.courseParticipants.push(res.data);
                });
            });
            const alert = {
              isShow: true,
              message: this.$t("snackbar.addSuccess"),
              icon: "mdi-check-circle",
              color: "success",
            };
            await store.dispatch("alert/showAlert", alert);
          } else {
            const alert = {
              isShow: true,
              message: this.$t("snackbar.addFail"),
              icon: "mdi-error-circle",
              color: "error",
            };
            await store.dispatch("alert/showAlert", alert);
          }
        } catch (error) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.addFail"),
            icon: "mdi-error-circle",
            color: "error",
          };
          await store.dispatch("alert/showAlert", alert);
        }
      };
      reader.readAsArrayBuffer(this.fileUpload);
    }
  }

  async addNew() {
    this.isLoading = true;
    if (this.$refs.courseParticipantsFrom.validate()) {
      try {
        const employee = this.getProfileEmployee();
        let participant = JSON.stringify({
          course_id: parseInt(this.$route.params.id),
          profile_id: parseInt(employee.id),
          created_user: store.state.user.user.login_id,
        });
        await store
          .dispatch("courses/createCourseParticipant", participant)
          .then((res) => {
            this.courseParticipants.push(res.data);
            this.name = "";
          });
        const alert = {
          isShow: true,
          message: this.$t("snackbar.addSuccess"),
          icon: "mdi-check-circle",
          color: "success",
        };
        store.dispatch("alert/showAlert", alert);
        this.isModalAddShow = false;
      } catch (error) {
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

  closeModalAdd() {
    this.$refs.courseParticipantsFrom.resetValidation();
    this.isModalAddShow = false;
    this.name = "";
  }
  cancel() {
    this.isModalDeleteShow = false;
    this.deleteItemId = -1;
  }
  deleteItem(item: never) {
    this.isModalDeleteShow = true;
    this.deleteItemId = item["id"];
    this.deleteIndex = this.courseParticipants.indexOf(item);
  }
  async deleteConfirm() {
    this.isLoading = true;
    try {
      await store.dispatch("courses/deleteParticipant", this.deleteItemId);
      this.isModalDeleteShow = false;
      this.courseParticipants.splice(this.deleteIndex, 1);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteSuccess"),
        icon: "mdi-check-circle",
        color: "success",
      };
      store.dispatch("alert/showAlert", alert);
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteFail"),
        icon: "mdi-error-circle",
        color: "error",
      };
      store.dispatch("alert/showAlert", alert);
    }
    this.isLoading = false;
  }

  get headers() {
    return [
      {
        text: this.$t("courseParticipants.id"),
        align: "center",
        sortable: false,
        value: "id",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.employeeName"),
        align: "start",
        value: "employee_name",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.employeeId"),
        align: "start",
        value: "employee_id",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.courseType"),
        align: "center",
        sortable: false,
        value: "course_type",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.endDate"),
        align: "start",
        sortable: false,
        value: "end_date",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.weekdays"),
        align: "start",
        sortable: false,
        value: "weekdays",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.time"),
        align: "start",
        sortable: false,
        value: "time",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("courseParticipants.actions"),
        align: "center",
        sortable: false,
        value: "actions",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
    ];
  }

  async mounted() {
    try {
      await this.getCourseParticipants();

      store.state.profiles.items.result === undefined
        ? (this.profiles = await this.getProfies())
        : (this.profiles = store.state.profiles.items.result);
    } catch (error) {
      console.log(error);
    }
  }
  async getProfies() {
    const queryParams = {};
    const res = await store.dispatch("courses/getProfiles", queryParams);
    return res.result;
  }
  async getCourseParticipants(): Promise<void> {
    this.isLoading = true;
    try {
      const id = this.$route.params.id;
      const allParticipants = await store.dispatch(
        "courses/getCourseParticipants",
        id
      );
      this.courseParticipants = allParticipants === null ? [] : allParticipants;
    } catch (error) {
      console.log(error);
    }
    this.isLoading = false;
  }
  get employeesName() {
    return this.profiles.map(
      (item: any) => item.employee_id + "  " + item.name
    );
  }
}
</script>
