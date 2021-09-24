<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="profiles"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          :loading="isLoading"
          :search="search"
          fixed-header
          :height="570"
          hide-default-footer
          @page-count="pageCount = $event"
          sort-by="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat class="px-2">
              <v-toolbar-title>
                {{ $t("profileList.datatable.title") }}
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
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
                    parseInt($event, 10) < 30 ? parseInt($event, 10) : 30 || 5
                "
              ></v-text-field>
              <v-btn
                color="primary"
                dark
                @click="importFile"
                class="mr-4"
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
              <ProfileModal
                :isModalOpen.sync="isModalOpen"
                :isModalDeleteOpen.sync="isModalDeleteOpen"
                :isModalLoading.sync="isModalLoading"
                :editItem.sync="editedItem"
                :editedIndex="editedIndex"
                :modalTitle="modalTitle"
                :close="closeModal"
                :save="save"
                :deleteItemConfirm="deleteItemConfirm"
                ref="profileModal"
              />
            </v-toolbar>
          </template>
          <template v-slot:[`item.id`]="{ index }">
            <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
          </template>
          <template v-slot:[`item.employee_id`]="{ item }">
            <v-btn
              depressed
              @click="seeItem(item)"
              width="100%"
              height="100%"
              class="font-weight-regular text-none"
              >{{ item.employee_id }}</v-btn
            >
          </template>
          <template v-slot:[`item.image`]="{ item }">
            <v-img
              :lazy-src="item.image !== '' ? baseURL + item.image : ''"
              :src="item.image !== '' ? baseURL + item.image : ''"
              :alt="item.image !== '' ? baseURL + item.image : ''"
              contain
              max-height="100"
              max-width="120"
              class="my-3"
            />
          </template>
          <template v-slot:[`item.gender`]="{ item }">
            <span>{{ item.gender === 1 ? "M" : "F" }}</span>
          </template>
          <template v-slot:[`item.birthday`]="{ item }">
            <span>{{ getDate(item.birthday) }}</span>
          </template>
          <template v-slot:[`item.department_id`]="{ item }">
            <span>{{ getDepartment(item.department_id) }}</span>
          </template>
          <template v-slot:[`item.position_id`]="{ item }">
            <span>{{ getPosition(item.position_id) }}</span>
          </template>
          <template v-slot:[`item.probation_date`]="{ item }">
            <span>{{ getDate(item.probation_date) }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2 primary--text" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="red--text" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">
              {{ $t("profileList.datatable.btnReset") }}
            </v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <div class="text-center pt-2">
      <!-- :length="maxPage"
          @input="getProfiles" -->
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch, Ref } from "vue-property-decorator";
import { BASE_URL, EMAILJS } from "@/constants/constants";
import store from "@/store/index";
import moment from "moment";
import emailjs from "emailjs-com";
import XLSX from "xlsx";

import ProfileModal from "@/views/profile/ProfileModal.vue";

@Component({
  components: {
    ProfileModal,
  },
})
export default class ProfileListDataTable extends Vue {
  @PropSync("profilesSync", { type: Array }) profiles!: any;
  @PropSync("searchByIdSync", { type: String }) searchById!: any;
  @PropSync("searchByNameSync", { type: String }) searchByName!: any;
  @PropSync("searchByDepartmentSync", { type: String })
  searchByDepartment!: any;
  @PropSync("searchByPositionSync", { type: String }) searchByPosition!: any;
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @Ref("fileUploader") fileUploader!: HTMLInputElement;
  $refs!: {
    profileModal: ProfileModal;
  };
  contractTypeId = store.state.user.user.user.contract_type_id;

  baseURL = BASE_URL + "/auth/user/";
  itemsPerPage = 10;
  page = 1;
  pageCount = 0;
  isModalOpen = false;
  isModalLoading = false;
  isModalDeleteOpen = false;
  isSelecting = false;
  editedIndex = -1;
  search = "";
  fileUpload: any = null;
  objectFromFile: any = [];
  editedItem = {
    employee_id: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    birthday: "",
    position_id: 1,
    department_id: 1,
    status: 1,
    address: "",
    telephone: "",
    mobile: "",
    official_date: "",
    probation_date: "",
    gender: 1,
    image: "", //receive image url from server
    imageFile: [], // Send to server
    del_flag: 0,
  };
  defaultItem = {
    employee_id: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    birthday: "",
    position_id: 1,
    department_id: 1,
    status: 1,
    address: "",
    telephone: "",
    mobile: "",
    official_date: "",
    probation_date: "",
    gender: 1,
    image: "", //receive image url from server
    imageFile: [], // Send to server
    del_flag: 0,
  };

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
        let cloneProfiles = Object.keys(this.profiles).map(
          (key) => this.profiles[key]
        );
        try {
          for (let i = this.objectFromFile.length - 1; i > -1; i--) {
            if (
              // Neu ko thay employee_id hoac password ==> Continue
              this.objectFromFile[i].employee_id === undefined ||
              this.objectFromFile[i].name === undefined ||
              this.objectFromFile[i].email === undefined ||
              this.objectFromFile[i].position_id === undefined ||
              this.objectFromFile[i].department_id === undefined
            ) {
              this.objectFromFile.splice(i, 1);
              continue;
            }
            let flag = false;
            for (let j = cloneProfiles.length - 1; j > -1; j--) {
              if (
                this.objectFromFile[i].employee_id ===
                cloneProfiles[j].employee_id
              ) {
                flag = true;
                cloneProfiles.splice(j, 1);
              }
            }
            if (flag == true) {
              this.objectFromFile.splice(i, 1); //DELETE object thu i neu tim thay
            }
          }
          if (this.objectFromFile && this.objectFromFile.length > 0) {
            for (let i = 0; i < this.objectFromFile.length; i++) {
              const formData = this.getFormData(this.objectFromFile[i]);
              const profileTmp = await store.dispatch(
                "profiles/createProfile",
                formData
              );

              this.profiles.push(profileTmp.data);
              const user = JSON.stringify({
                login_id: this.objectFromFile[i].employee_id,
                password: this.objectFromFile[i].password,
                contract_type_id:
                  parseInt(this.objectFromFile[i].contract_type_id) || 1,
                profile_id: profileTmp.data.id,
              });
              await store.dispatch("user/createUser", user);
              this.sendEmail(user);
            }
            const alert = {
              isShow: true,
              message: this.$t("snackbar.addSuccess"),
              icon: "mdi-check-circle",
              color: "success",
            };
            store.dispatch("alert/showAlert", alert);
          } else {
            const alert = {
              isShow: true,
              message: this.$t("snackbar.addFail"),
              icon: "mdi-error-circle",
              color: "error",
            };
            store.dispatch("alert/showAlert", alert);
          }
        } catch (error) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.addFail"),
            icon: "mdi-error-circle",
            color: "error",
          };
          store.dispatch("alert/showAlert", alert);
        }
      };
      reader.readAsArrayBuffer(this.fileUpload);
    }
  }

  get itemsWithIndex() {
    return this.profiles.map((items: any, index: any) => ({
      index: index + 1,
    }));
  }
  get headers() {
    return [
      {
        text: this.$t("profileList.datatable.header.id"),
        align: "center",
        sortable: false,
        value: "id",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("profileList.datatable.header.employeeID"),
        width: "150px",
        value: "employee_id",
        filter: (f: any) => {
          return (f + "")
            .toLowerCase()
            .includes(this["searchById"].toLowerCase());
        },
        align: "center",
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.employeeName"),
        width: "250px",
        value: "name",
        filter: (f: any) => {
          return (f + "")
            .toLowerCase()
            .includes(this["searchByName"].toLowerCase());
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.image"),
        value: "image",
        align: "center",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.gender"),
        width: "100px",
        align: "center",
        value: "gender",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.birthday"),
        width: "150px",
        value: "birthday",
        filterable: false,
        align: "center",
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.department"),
        value: "department_id",
        align: "center",
        width: "100",
        filter: (value: any) => {
          if (!this.searchByDepartment) return true;
          return value == parseInt(this.searchByDepartment);
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.position"),
        value: "position_id",
        align: "center",
        width: "100",
        filter: (value: any) => {
          if (!this.searchByPosition) return true;
          return value == parseInt(this.searchByPosition);
        },
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.probationDate"),
        width: "150px",
        value: "probation_date",
        align: "center",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.mailAddress"),
        width: "250px",
        value: "email",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
      {
        text: this.$t("profileList.datatable.header.actions"),
        width: "50px",
        value: "actions",
        align: "center",
        filterable: false,
        sortable: false,
        divider: true,
        class: "deep-purple lighten-4",
      },
    ];
  }
  seeItem(item: never) {
    this.editedIndex = -2;
    this.editedItem = Object.assign({}, item);
    this.isModalOpen = true;
  }
  editItem(item: never) {
    this.editedIndex = this.profiles.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.editedItem.imageFile = []; //VUE NOT ALLOW FILE IMAGE INPUT AS STRING | https://stackoverflow.com/questions/60332960/vue-vuetify-invalid-prop-custom-validator-check-failed-for-prop-value-found
    this.isModalOpen = true;
  }
  deleteItem(item: never) {
    this.editedIndex = this.profiles.indexOf(item);
    this.isModalDeleteOpen = true;
  }
  async deleteItemConfirm() {
    try {
      const id = this.profiles[this.editedIndex]["id"];
      await store.dispatch("profiles/deleteProfile", id);
      this.profiles.splice(this.editedIndex, 1);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteSuccess"),
        icon: "mdi-check-circle",
        color: "success",
      };
      store.dispatch("alert/showAlert", alert);
      this.closeModal("");
    } catch (err) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteFail"),
        icon: "mdi-alert-circle",
        color: "error",
      };
      store.dispatch("alert/showAlert", alert);
    }
  }
  @Watch("isModalOpen")
  onModalChange(val: any) {
    val || this.closeModal("modal");
  }
  @Watch("isModalDeleteOpen")
  onModalDeleteChange(val: any) {
    val || this.closeModal("modalDelete");
  }
  closeModal(modal: string) {
    switch (modal) {
      case "modal":
        this.$refs.profileModal.$refs.profileModalForm.resetValidation();
        this.isModalOpen = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
        break;
      case "modalDelete":
        this.isModalDeleteOpen = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
        break;
      default:
        this.isModalOpen = false;
        this.isModalDeleteOpen = false;
        break;
    }
  }
  getDate(date: any) {
    let getDate = moment(date).format("DD/MM/YYYY");
    return getDate === "Invalid date" ? "" : getDate;
  }
  getDepartment(item: any) {
    return store.state.departments.items &&
      store.state.departments.items.length > 0
      ? store.state.departments.items
          .filter((department: any) => department.id === item)
          .map((filteredObj: any) => filteredObj.name)
          .toString()
      : {};
  }
  getPosition(item: any) {
    return store.state.positions.items && store.state.positions.items.length > 0
      ? store.state.positions.items
          .filter((position: any) => position.id === item)
          .map((filteredObj: any) => filteredObj.name)
          .toString()
      : {};
  }
  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }
  async save() {
    this.isModalLoading = true;
    if (this.$refs.profileModal.$refs.profileModalForm.validate()) {
      const select = this.$refs.profileModal.select;
      const status = this.$refs.profileModal.editedItem.status;
      JSON.parse(JSON.stringify(select));

      this.editedItem.position_id = parseInt(select.position.id);
      this.editedItem.department_id = parseInt(select.department.id);
      switch (status) {
        case true:
          this.editedItem.status = 1;
          break;
        case false:
          this.editedItem.status = 2;
          break;
        default:
          break;
      }

      const formData = this.getFormData(this.editedItem);
      if (
        this.editedItem.imageFile == null ||
        this.editedItem.imageFile.length == 0
      ) {
        formData.delete("imageFile");
      }
      if (this.editedIndex > -1) {
        // SUA
        try {
          const id = this.profiles[this.editedIndex]["id"];
          formData.append("id", id);
          const editedProfile = await store.dispatch(
            "profiles/updateProfile",
            formData
          );
          Object.assign(this.profiles[this.editedIndex], editedProfile.data);
          const alert = {
            isShow: true,
            message: this.$t("snackbar.editSuccess"),
            icon: "mdi-check-circle",
            color: "success",
          };
          store.dispatch("alert/showAlert", alert);
          this.closeModal("");
        } catch (err) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.editFail"),
            icon: "mdi-alert-circle",
            color: "error",
          };
          store.dispatch("alert/showAlert", alert);
        }
      } else {
        // THEM
        try {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.addSuccess"),
            icon: "mdi-check-circle",
            color: "success",
          };

          const profile = await store.dispatch(
            "profiles/createProfile",
            formData
          );

          const user = JSON.stringify({
            login_id: this.editedItem.employee_id,
            password: this.editedItem.password,
            contract_type_id: 1,
            profile_id: profile.data.id,
          });

          await store.dispatch("user/createUser", user);
          this.sendEmail(user);
          store.dispatch("alert/showAlert", alert);
          this.closeModal("");
        } catch (err) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.addFail"),
            icon: "mdi-alert-circle",
            color: "error",
          };
          store.dispatch("alert/showAlert", alert);
        }

        //this.profiles.push(this.editedItem)
      }
      this.isModalLoading = false;
    } else {
      this.isModalLoading = false;
    }
  }
  get modalTitle() {
    if (this.editedIndex === -2)
      return this.$t("profileList.modalActions.titleSee");
    return this.editedIndex === -1
      ? this.$t("profileList.modalActions.titleAdd")
      : this.$t("profileList.modalActions.titleEdit");
  }
  sendEmail(item: any) {
    const templateParams = {
      from_name: "Automation Email (INTERNSHIP)",
      to_name: item.email,
      username: item.login_id,
      password: item.password,
    };
    emailjs
      .send(
        EMAILJS.serviceID,
        EMAILJS.templateID,
        templateParams,
        EMAILJS.userID
      )
      .then((res) => console.log("SUCCESS", res))
      .catch((err) => {
        console.log("FAILED", err);
      });
  }
}
</script>
