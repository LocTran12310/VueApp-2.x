<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="leaveDetails"
          :loading="isLoading"
          fixed-header
          hide-default-footer
          sort-by="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat class="px-2">
              <v-toolbar-title>
                {{ $t("leave.titleDataTable") }}
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                disabled
                :value="employee"
                dense
                outlined
                hide-details="true"
                class="shrink mr-4"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field
                :value="month"
                label="Month"
                type="number"
                dense
                outlined
                hide-details="true"
                class="shrink mr-4"
                @input="(value) => (month = value)"
              ></v-text-field>
              <v-text-field
                :value="year"
                label="Year"
                type="number"
                dense
                outlined
                hide-details="true"
                class="shrink"
                @input="(value) => (year = value)"
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:[`item.id`]="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-slot:[`item.start_date`]="{ item }">
            <span>{{ getDate(item.start_date) }}</span>
          </template>
          <template v-slot:[`item.end_date`]="{ item }">
            <span>{{ getDate(item.end_date) }}</span>
          </template>
          <template v-slot:[`item.leave_type_id`]="{ item }">
            <span>{{ getLeaveType(item.leave_type_id) }}</span>
          </template>
          <template v-slot:[`item.leave_reason_id`]="{ item }">
            <span>{{ getLeaveReason(item.leave_reason_id) }}</span>
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
        <v-dialog v-model="isModalEditShow" max-width="600px">
          <v-form ref="leaveEditForm">
            <v-card class="pa-5">
              <v-card-title class="text-h5 text-center d-block">{{
                $t("leave.titleModalEdit")
              }}</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("leave.startDate") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <InputDatePicker
                      :datePicker.sync="editedItem.isStartDatePickerShow"
                      :dateString.sync="editedItem.start_date"
                      :label="`yyyy-mm-dd`"
                      outlined
                      dense
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("leave.endDate") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <InputDatePicker
                      :datePicker.sync="editedItem.isEndDatePickerShow"
                      :dateString.sync="editedItem.end_date"
                      :label="`yyyy-mm-dd`"
                      outlined
                      dense
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("leave.leaveType") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <v-select
                      v-model="editedItem.leave_type_id"
                      :items="types"
                      :menu-props="{ bottom: true, offsetY: true }"
                      item-text="name"
                      item-value="id"
                      single-line
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("leave.leaveReason") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <v-select
                      v-model="editedItem.leave_reason_id"
                      :items="reasons"
                      :menu-props="{ bottom: true, offsetY: true }"
                      item-text="name"
                      item-value="id"
                      single-line
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" sm="12" md="5">
                    <div class="black--text pt-3">
                      {{ $t("leave.note") }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="7">
                    <v-textarea
                      v-model="editedItem.note"
                      outlined
                      dense
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="amber darken-2"
                  class="pr-3"
                  dark
                  @click="closeModalEdit"
                >
                  <v-icon dense left> mdi-close </v-icon>
                  {{ $t("leave.btnCancel") }}</v-btn
                >

                <v-btn
                  color="primary"
                  dark
                  @click="editConfirm"
                  :loading="isLoading"
                  class="pr-3"
                >
                  <v-icon dense left> mdi-content-save-outline </v-icon>
                  {{ $t("leave.btnSave") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <ModalDelete
          :isLoadingSync.sync="isLoading"
          :isModalDeleteShow.sync="isModalDeleteShow"
          :cancel="closeModalDetele"
          :deleteConfirm="deleteConfirm"
        />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import moment from "moment";
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ModalDelete from "@/components/ModalDelete.vue";
import InputDatePicker from "@/components/InputDatePicker.vue";
import store from "@/store";

@Component({
  components: {
    ModalDelete,
    InputDatePicker,
  },
})
export default class LeaveDataTable extends Vue {
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @PropSync("leaveDetailsSync", { type: Array }) leaveDetails!: any;
  @Prop(Array) readonly types!: any;
  @Prop(Array) readonly reasons!: any;

  isModalEditShow = false;
  isModalDeleteShow = false;
  dateNow = new Date();
  month = this.dateNow.getMonth() + 1;
  year = this.dateNow.getFullYear();
  employee =
    store.state.user.user.profile.employee_id +
    " " +
    store.state.user.user.profile.name;
  editedIndex = 0;

  editedItem = {
    id: 0,
    // employee_id: store.state.user.user.login_id,
    user_id: store.state.user.user.user.id,
    start_date: "",
    end_date: "",
    leave_type_id: 1,
    leave_reason_id: 1,
    note: "",
    updated_user: store.state.user.user.user.login_id,
    isStartDatePickerShow: false,
    isEndDatePickerShow: false,
  };

  closeModalEdit() {
    this.isModalEditShow = false;
  }

  closeModalDetele() {
    this.isModalDeleteShow = false;
  }

  editItem(item: any) {
    this.editedIndex = this.leaveDetails.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.isModalEditShow = true;
  }
  async editConfirm() {
    try {
      await store.dispatch("leaveDetails/updateLeaveDetails", this.editedItem);
      Object.assign(this.leaveDetails[this.editedIndex], this.editedItem);

      this.closeModalEdit();
      const alert = {
        isShow: true,
        message: this.$t("snackbar.editSuccess"),
        color: "success",
        icon: "mdi-check-circle",
      };
      store.dispatch("alert/showAlert", alert);
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.editFail"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("alert/showAlert", alert);
    }
  }

  deleteItem(item: any) {
    this.editedIndex = this.leaveDetails.indexOf(item);
    this.isModalDeleteShow = true;
  }
  async deleteConfirm() {
    const id = this.leaveDetails[this.editedIndex]["id"];
    try {
      await store.dispatch("leaveDetails/deleteLeaveDetails", id);
      this.leaveDetails.splice(this.editedIndex, 1);
      this.closeModalDetele();
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteSuccess"),
        color: "success",
        icon: "mdi-check-circle",
      };
      store.dispatch("alert/showAlert", alert);
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteFail"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("alert/showAlert", alert);
    }
  }

  getDate(date: any) {
    let getDate = moment(date).format("YYYY-MM-DD");
    return getDate === "Invalid date" ? "" : getDate;
  }

  getLeaveType(id: any) {
    return this.types && this.types.length
      ? this.types
          .filter((type: any) => type.id === id)
          .map((filtered: any) => filtered.name)
          .toString()
      : "";
  }

  getLeaveReason(id: any) {
    return this.reasons && this.reasons.length
      ? this.reasons
          .filter((reason: any) => reason.id === id)
          .map((filtered: any) => filtered.name)
          .toString()
      : "";
  }

  get headers() {
    return [
      {
        text: this.$t("leave.id"),
        value: "id",
        sortable: false,
        filterable: false,
        divider: true,
        width: "30px",
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.startDate"),
        value: "start_date",
        sortable: false,
        filter: (value: any) => {
          let month = this.month.toString();
          if (this.month < 10) month = "0" + month;
          let nowDate = this.year + "-" + month;
          return (value + "").includes(nowDate);
        },
        width: "220px",
        divider: true,
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.endDate"),
        value: "end_date",
        sortable: false,
        divider: true,
        width: "220px",
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.leaveType"),
        value: "leave_type_id",
        sortable: false,
        filterable: false,
        divider: true,
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.leaveReason"),
        value: "leave_reason_id",
        sortable: false,
        filterable: false,
        divider: true,
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.note"),
        value: "note",
        sortable: false,
        divider: true,
        filterable: false,
        align: "center",
        width: "200px",
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("leave.actions"),
        value: "actions",
        sortable: false,
        divider: true,
        align: "center",
        class: "deep-purple lighten-4 fixed",
      },
    ];
  }
}
</script>
