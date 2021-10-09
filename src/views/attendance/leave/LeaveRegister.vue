<template>
  <v-card class="mb-8">
    <v-layout>
      <v-flex>
        <v-card-title>{{ $t("leave.titleRegister") }}</v-card-title>
        <v-data-table
          :headers="headers"
          :items="editedItems"
          :loading="isLoading"
          fixed-header
          hide-default-footer
          sort-by="id"
          class="elevation-0"
        >
          <template v-slot:[`item.id`]="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-slot:[`item.employee_id`]="{ item }">
            <v-select
              v-model="editedItems[item.id].employee_id"
              :items="employeeID"
              :menu-props="{ bottom: true, offsetY: true }"
              single-line
              :hide-details="true"
              outlined
              dense
            ></v-select>
          </template>
          <template v-slot:[`item.start_date`]="{ item }">
            <InputDatePicker
              :datePicker.sync="editedItems[item.id].isStartDatePickerShow"
              :dateString.sync="editedItems[item.id].start_date"
              :hideDetails="true"
              :clearable="true"
              :label="`yyyy-mm-dd`"
              outlined
              dense
              singleLine
            />
          </template>
          <template v-slot:[`item.end_date`]="{ item }">
            <InputDatePicker
              :datePicker.sync="editedItems[item.id].isEndDatePickerShow"
              :dateString.sync="editedItems[item.id].end_date"
              :hideDetails="true"
              :clearable="true"
              :label="`yyyy-mm-dd`"
              outlined
              dense
              singleLine
            />
          </template>
          <template v-slot:[`item.leave_type_id`]="{ item }">
            <v-select
              v-model="editedItems[item.id].leave_type_id"
              :items="types"
              :menu-props="{ bottom: true, offsetY: true }"
              item-text="name"
              item-value="id"
              single-line
              :hide-details="true"
              outlined
              dense
            ></v-select>
          </template>
          <template v-slot:[`item.leave_reason_id`]="{ item }">
            <v-select
              v-model="editedItems[item.id].leave_reason_id"
              :items="reasons"
              :menu-props="{ bottom: true, offsetY: true }"
              item-text="name"
              item-value="id"
              single-line
              :hide-details="true"
              outlined
              dense
            ></v-select>
          </template>
          <template v-slot:[`item.note`]="{ item }">
            <v-text-field
              v-model="editedItems[item.id].note"
              single-line
              :hide-details="true"
              outlined
              dense
            ></v-text-field>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">
              {{ $t("profileList.datatable.btnReset") }}
            </v-btn>
          </template>
        </v-data-table>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="createLeave" color="primary">{{
            $t("leave.btnRegister")
          }}</v-btn>
          <v-btn @click="cancelLeave" color="amber darken-2 white--text">{{
            $t("leave.btnCancel")
          }}</v-btn>
        </v-card-actions>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import InputDatePicker from "@/components/InputDatePicker.vue";
import store from "@/store";

@Component({
  components: {
    InputDatePicker,
  },
})
export default class LeaveRegister extends Vue {
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  @Prop(Array) readonly types!: any;
  @Prop(Array) readonly reasons!: any;

  isStartDatePickerShow = false;
  isEndDatePickerShow = false;

  get employeeID() {
    return store.state.profiles?.items?.result?.map(
      (item: any) => item.employee_id + "  " + item.name
    );
  }

  cancelLeave() {
    this.editedItems = JSON.parse(JSON.stringify(this.defaultItems));
  }
  async createLeave() {
    let cloneItems = [...this.editedItems];
    for (let i = cloneItems.length - 1; i > -1; i--) {
      if (
        !cloneItems[i].start_date &&
        !cloneItems[i].end_date &&
        !cloneItems[i].employee_id
      ) {
        cloneItems.splice(i, 1);
      }
    }

    if (!cloneItems.length) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.emptyField"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("alert/showAlert", alert);
      return;
    } else {
      for (let i = 0; i < cloneItems.length; i++) {
        if (
          cloneItems[i].start_date === "" ||
          cloneItems[i].end_date === "" ||
          cloneItems[i].employee_id === ""
        ) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.emptyField"),
            color: "error",
            icon: "mdi-alert-circle",
          };
          store.dispatch("alert/showAlert", alert);
          return;
        }
        if (cloneItems[i].start_date > cloneItems[i].end_date) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.startGreaterThan"),
            color: "error",
            icon: "mdi-alert-circle",
          };
          store.dispatch("alert/showAlert", alert);
          return;
        }
      }
    }

    try {
      cloneItems.map((item: any) => {
        item.employee_id = item.employee_id.split(" ")[0];
      });
      const leaveJson = JSON.stringify(cloneItems);
      await store.dispatch("leaveDetails/createLeaveDetails", leaveJson);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.registerSuccess"),
        color: "success",
        icon: "mdi-check-circle",
      };
      store.dispatch("alert/showAlert", alert);
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.registerFail"),
        color: "error",
        icon: "mdi-alert-circle",
      };
      store.dispatch("alert/showAlert", alert);
    }
  }

  headers = [
    {
      text: this.$t("leave.id"),
      value: "id",
      sortable: false,
      divider: true,
      width: "30px",
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("leave.employee"),
      value: "employee_id",
      sortable: false,
      width: "250px",
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("leave.startDate"),
      value: "start_date",
      sortable: false,
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
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("leave.leaveReason"),
      value: "leave_reason_id",
      sortable: false,
      divider: true,
      align: "center",
      class: "deep-purple lighten-4 fixed",
    },
    {
      text: this.$t("leave.note"),
      value: "note",
      sortable: false,
      divider: true,
      align: "center",
      width: "200px",
      class: "deep-purple lighten-4 fixed",
    },
  ];
  editedItems: any[] = [];
  defaultItems: any[] = [];

  created() {
    this.initialize();
  }
  initialize() {
    this.isLoading = true;

    for (let i = 0; i < 5; i++) {
      let obj = {
        id: i,
        employee_id: "",
        // user_id: store.state.user.user.user.id,
        start_date: "",
        end_date: "",
        leave_type_id: 1,
        leave_reason_id: 1,
        created_user: store.state.user.user.login_id,
        note: "",
        isStartDatePickerShow: false,
        isEndDatePickerShow: false,
      };
      this.editedItems.push(obj);
    }
    this.defaultItems = JSON.parse(JSON.stringify(this.editedItems)); // Clone
    this.isLoading = false;
  }
}
</script>
