<template>
  <div>
    <v-dialog v-model="showModal" max-width="700px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          {{ $t("profileList.modalActions.btnAdd") }}
        </v-btn>
      </template>
      <v-form ref="profileModalForm" lazy-validation class="white pa-5">
        <span class="text-h5 pl-3 pb-3">{{ modalTitle }}</span>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                :disabled="editedIndex !== -1"
                v-model.trim="editedItem.employee_id"
                :rules="rules.employeeID"
                dense
                outlined
                :label="$t('profileList.modalActions.employeeID')"
                class="mr-6"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                :disabled="editedIndex < -1"
                v-model.trim="editedItem.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="editedIndex === -1 ? rules.password : []"
                :type="showPassword ? 'text' : 'password'"
                dense
                outlined
                :label="$t('profileList.modalActions.password')"
                class="mx-3"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                :disabled="editedIndex < -1"
                v-model.trim="editedItem.passwordConfirm"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="
                  editedIndex === -1
                    ? rules.passwordConfirm.concat(passwordConfirmationRule)
                    : []
                "
                :type="showPasswordConfirm ? 'text' : 'password'"
                dense
                outlined
                :label="$t('profileList.modalActions.passwordConfirm')"
                class="ml-6"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                :disabled="editedIndex < -1"
                :rules="rules.department"
                v-model="selectInput.department"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="departments"
                item-text="name"
                item-value="id"
                return-object
                dense
                outlined
                class="mr-4"
                :label="$t('profileList.modalActions.department')"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                :disabled="editedIndex < -1"
                :rules="rules.position"
                v-model="selectInput.position"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="positions"
                item-text="name"
                item-value="id"
                return-object
                class="ml-4"
                dense
                outlined
                :label="$t('profileList.modalActions.position')"
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" md="6" class="pr-4">
              <v-text-field
                :disabled="editedIndex < -1"
                :rules="rules.name"
                v-model.trim="editedItem.name"
                :label="$t('profileList.modalActions.employeeName')"
              ></v-text-field>
              <v-text-field
                :disabled="editedIndex < -1"
                :rules="rules.email"
                v-model.trim="editedItem.email"
                :label="$t('profileList.modalActions.mailAddress')"
              ></v-text-field>
              <InputDatePicker
                :disabled="editedIndex < -1"
                :datePicker.sync="datePicker.birthday"
                :dateString.sync="editedItem.birthday"
                :label="$t('profileList.modalActions.birthday')"
                :setDefault="true"
              />
              <v-text-field
                :disabled="editedIndex < -1"
                v-model.trim="editedItem.address"
                :label="$t('profileList.modalActions.address')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pl-4">
              <v-file-input
                :disabled="editedIndex < -1"
                :rules="rules.image"
                name="file"
                @change="uploadImage"
                v-model="editedItem.imageFile"
                accept="image/png, image/jpeg, imgage/bmp"
                prepend-icon="mdi-camera"
                :label="$t('profileList.modalActions.image')"
              ></v-file-input>
              <v-img
                :src="previewImage"
                :alt="previewImage"
                contain
                max-height="150"
                max-width="150"
              ></v-img>
            </v-col>
          </v-row>
          <v-row dense wrap>
            <v-col cols="12" sm="6" md="6" class="pr-4">
              <v-text-field
                :disabled="editedIndex < -1"
                v-model.trim="editedItem.telephone"
                :label="$t('profileList.modalActions.telephone')"
              ></v-text-field>
              <v-text-field
                :disabled="editedIndex < -1"
                v-model.trim="editedItem.mobile"
                :label="$t('profileList.modalActions.mobile')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pl-4">
              <InputDatePicker
                :disabled="editedIndex < -1"
                :datePicker.sync="datePicker.officialDate"
                :dateString.sync="editedItem.official_date"
                :label="$t('profileList.modalActions.officalDate')"
                :setDefault="true"
              />
              <InputDatePicker
                :disabled="editedIndex < -1"
                :datePicker.sync="datePicker.probationDate"
                :dateString.sync="editedItem.probation_date"
                :label="$t('profileList.modalActions.probationDate')"
                :setDefault="true"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" md="5">
              <!-- 1: male; 2: female -->
              <v-radio-group
                :disabled="editedIndex < -1"
                v-model="editedItem.gender"
                row
              >
                <v-radio :value="parseInt(1)">
                  <template v-slot:label>
                    <v-icon color="blue" class="mr-2">mdi-gender-male</v-icon>
                    {{ $t("profileList.modalActions.gender.male") }}
                  </template>
                </v-radio>
                <v-radio :value="parseInt(2)">
                  <template v-slot:label>
                    <v-icon color="pink" class="mr-2">mdi-gender-female</v-icon>
                    {{ $t("profileList.modalActions.gender.female") }}
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex justify-end">
              <v-switch
                :disabled="editedIndex < -1"
                v-model="editedItem.status"
                dense
                :input-value="editedItem.status === 1"
              >
                <template #prepend
                  ><v-label>{{
                    editedItem.status === 1
                      ? $t("profileList.modalActions.status.on")
                      : $t("profileList.modalActions.status.off")
                  }}</v-label></template
                >
              </v-switch>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="4"
              class="justify-end align-center d-flex"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red lighten-4 red--text" @click="close">
                  {{ $t("profileList.modalActions.btnCancel") }}
                </v-btn>
                <v-btn
                  v-if="editedIndex > -2"
                  color="blue darken-2"
                  dark
                  @click="save"
                  :loading="isLoading"
                >
                  <v-icon left dense>mdi-content-save</v-icon>
                  {{ $t("profileList.modalActions.btnSave") }}
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showModalDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 text-center d-block"
          >Bạn thật sự muốn xóa thông tin này?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-2" text @click="close">HỦY</v-btn>
          <v-btn
            color="red darken-2"
            dark
            @click="deleteItemConfirm"
            :loading="isLoading"
            class="pr-3"
          >
            <v-icon left> mdi-delete </v-icon>
            XÓA</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import InputDatePicker from "@/components/InputDatePicker.vue";
import { BASE_URL } from "@/constants/constants";
import store from "@/store";

@Component({
  components: {
    InputDatePicker,
  },
})
export default class ProfileModal extends Vue {
  @PropSync("isModalOpen", { type: Boolean }) showModal!: boolean;
  @PropSync("isModalDeleteOpen", { type: Boolean }) showModalDelete!: boolean;
  @PropSync("isModalLoading", { type: Boolean }) isLoading!: boolean;
  @PropSync("editItem", { type: Object, required: true }) editedItem: any;
  @Prop(Number) readonly editedIndex!: number;
  @Prop(String) readonly modalTitle!: string;
  @Prop(Function) close!: any;
  @Prop(Function) save!: any;
  @Prop(Function) deleteItemConfirm!: any;
  $refs!: {
    profileModalForm: HTMLFormElement;
  };
  baseURL = BASE_URL + "/auth/user/";
  showPassword = false;
  showPasswordConfirm = false;
  urlImage = "";
  image = [];
  select = {
    position: { id: "", name: "" },
    department: { id: "", name: "" },
  };
  get positions() {
    return store.state.positions.items;
  }

  get departments() {
    return store.state.departments.items;
  }

  employeesID = store.getters["profiles/employeesID"];

  get rules() {
    return {
      employeeID: [
        (v: any) => !!v || this.$t("profileList.modalActions.rules.employeeID"),
        (v: any) =>
          (v && v.length <= 6) ||
          this.$t("profileList.modalActions.rules.employeeIDLength"),
        (v: string) =>
          (v &&
            this.editedIndex === -1 &&
            this.checkEmployeeIdExist(
              v,
              this.employeesID,
              this.$t("profileList.modalActions.rules.employeeIdIsExisted")
            )) ||
          !!v,
      ],
      password: [
        (v: any) => !!v || this.$t("profileList.modalActions.rules.password"),
      ],
      passwordConfirm: [
        (v: any) =>
          !!v || this.$t("profileList.modalActions.rules.passwordConfirm"),
      ],
      position: [
        (v: any) =>
          JSON.parse(JSON.stringify(v)).id != "" ||
          this.$t("profileList.modalActions.rules.position"),
      ],
      department: [
        (v: any) =>
          JSON.parse(JSON.stringify(v)).id != "" ||
          this.$t("profileList.modalActions.rules.department"),
      ],
      name: [
        (v: any) =>
          !!v || this.$t("profileList.modalActions.rules.employeeName"),
      ],
      email: [
        (v: any) =>
          !!v || this.$t("profileList.modalActions.rules.mailAddress"),
        (v: any) =>
          /.+@.+/.test(v) ||
          this.$t("profileList.modalActions.rules.mailAddressValid"),
      ],
      image: [
        (v: any) =>
          v == "" ||
          v == null ||
          v.size < 5000000 ||
          this.$t("profileList.modalActions.rules.image"),
      ],
    };
  }

  checkEmployeeIdExist(value: string, items: string[], message: any) {
    const itemsLength = items.length;
    for (let i = 0; i < itemsLength; i++) {
      if (items[i] === value) return message;
    }
    return true;
  }

  get passwordConfirmationRule() {
    return () =>
      this.editedItem.password === this.editedItem.passwordConfirm ||
      this.$t("profileList.modalActions.rules.passwordConfirm");
  }
  datePicker = {
    birthday: false,
    officialDate: false,
    probationDate: false,
  };
  get selectInput() {
    return this.editedIndex === -1
      ? (this.select = {
          position: { id: this.editedItem.position_id, name: "Vị trí 1" },
          department: { id: this.editedItem.department_id, name: "Bộ phận 1" },
        })
      : (this.select = {
          position: { id: this.editedItem.position_id, name: "Position 1" },
          department: {
            id: this.editedItem.department_id,
            name: "Department 1",
          },
        });
  }
  previewImage = "";
  @Watch("editedItem.imageFile")
  imageUrl() {
    if (this.editedItem.imageFile && this.editedItem.imageFile.name) {
      return (this.previewImage = URL.createObjectURL(
        this.editedItem.imageFile
      ));
    }
    if (this.editedItem.image !== "") {
      return (this.previewImage = this.baseURL + this.editedItem.image);
    }
    return (this.previewImage = "");
  }
  uploadImage() {
    if (this.editedItem.image !== "") {
      this.previewImage = this.baseURL + this.editedItem.image;
    }
    if (this.editedItem.imageFile && this.editedItem.imageFile.name) {
      this.previewImage = URL.createObjectURL(this.editedItem.imageFile);
    }
  }
}
</script>
