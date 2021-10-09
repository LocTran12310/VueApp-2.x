<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="leaveTypes"
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
                {{ $t("positionList.titleDataTable") }}
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
              <LeaveTypeModal
                :leaveTypesSync.sync="leaveTypes"
                :editedItemSync.sync="editedItem"
                :editedIndex="editedIndex"
                :isModalShowSync.sync="isModalShow"
                :isModalLoadingSync.sync="isModalLoading"
                :modalTitle="modalTitle"
                :close="closeModal"
                :save="saveModal"
                ref="leaveTypeModal"
              />
            </v-toolbar>
          </template>
          <template v-slot:[`item.id`]="{ index }">
            <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
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
              {{ $t("positionList.btnReset") }}
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
    <ModalDelete
      :isLoadingSync.sync="isModalDeleteLoading"
      :isModalDeleteShow.sync="isModalDeleteShow"
      :cancel="closeModalDelete"
      :deleteConfirm="deleteConfirm"
    />
  </v-card>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { Component, PropSync, Watch, Ref } from "vue-property-decorator";
import ModalDelete from "@/components/ModalDelete.vue";
import LeaveTypeModal from "./LeaveTypeModal.vue";

@Component({
  components: {
    ModalDelete,
    LeaveTypeModal,
  },
})
export default class ProfileDataTable extends Vue {
  @PropSync("leaveTypesSync", { type: Array, required: true }) leaveTypes!: any;
  @PropSync("searchByNameSync", { type: String }) searchByName!: any;
  @PropSync("isLoadingSync", { type: Boolean }) isLoading!: boolean;
  // @Ref() leaveTypeModal!: leaveTypeModal;
  $refs!: {
    leaveTypeModal: HTMLFormElement;
  };
  search = "";
  itemsPerPage = 10;
  page = 1;
  pageCount = 0;
  isModalShow = false;
  isModalLoading = false;

  isModalDeleteShow = false;
  isModalDeleteLoading = false;

  editedIndex = -1;

  editedItem = {
    id: 0,
    name: "",
    del_flag: 0,
    updated_user: store.state.user.user.user.login_id,
  };
  defaultItem = {
    id: 0,
    name: "",
    del_flag: 0,
    updated_user: store.state.user.user.user.login_id,
  };

  editItem(item: never) {
    this.editedIndex = this.leaveTypes.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.isModalShow = true;
  }

  deleteItem(item: never) {
    this.editedIndex = this.leaveTypes.indexOf(item);
    this.isModalDeleteShow = true;
  }

  closeModalDelete() {
    this.isModalDeleteShow = false;
    this.editedIndex = -1;
  }

  async deleteConfirm() {
    this.isModalDeleteLoading = true;
    try {
      const id = this.leaveTypes[this.editedIndex]["id"];
      await store.dispatch("leaveTypes/deleteLeaveType", id);
      this.leaveTypes.splice(this.editedIndex, 1);
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteSuccess"),
        icon: "mdi-check-circle",
        color: "success",
      };
      store.dispatch("alert/showAlert", alert);
      this.isModalDeleteShow = false;
      this.isModalDeleteLoading = false;
    } catch (error) {
      const alert = {
        isShow: true,
        message: this.$t("snackbar.deleteFail"),
        icon: "mdi-error-circle",
        color: "error",
      };
      store.dispatch("alert/showAlert", alert);
      this.isModalDeleteLoading = false;
    }
  }

  async saveModal() {
    this.isModalLoading = true;
    if (this.$refs.leaveTypeModal.$refs.leaveTypeModalForm.validate()) {
      if (this.editedIndex > -1) {
        // SUA
        try {
          await store.dispatch("leaveTypes/updateLeaveType", this.editedItem);
          Object.assign(this.leaveTypes[this.editedIndex], this.editedItem);
          const alert = {
            isShow: true,
            message: this.$t("snackbar.editSuccess"),
            icon: "mdi-check-circle",
            color: "success",
          };
          store.dispatch("alert/showAlert", alert);
          this.isModalShow = false;
        } catch (error) {
          const alert = {
            isShow: true,
            message: this.$t("snackbar.editFail"),
            icon: "mdi-error-circle",
            color: "error",
          };
          store.dispatch("alert/showAlert", alert);
        }
      } else {
        //THEM
        try {
          const leaveType = JSON.stringify(this.editedItem);
          await store.dispatch("leaveTypes/createLeaveType", leaveType);
          const alert = {
            isShow: true,
            message: this.$t("snackbar.addSuccess"),
            icon: "mdi-check-circle",
            color: "success",
          };
          store.dispatch("alert/showAlert", alert);
          this.isModalShow = false;
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
    }
    this.isModalLoading = false;
  }

  closeModal() {
    this.$refs.leaveTypeModal.$refs.leaveTypeModalForm.resetValidation();
    this.isModalShow = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }
  get headers() {
    return [
      {
        text: this.$t("positionList.id"),
        align: "center",
        sortable: false,
        value: "id",
        width: "50px",
        filterable: false,
        divider: true,
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("positionList.name"),
        filter: (f: any) => {
          return (f + "")
            .toLowerCase()
            .includes(this["searchByName"].toLowerCase());
        },
        align: "start",
        value: "name",
        divider: true,
        class: "deep-purple lighten-4 fixed",
      },
      {
        text: this.$t("positionList.actions"),
        align: "center",
        value: "actions",
        width: "100px",
        divider: true,
        class: "deep-purple lighten-4 fixed",
      },
    ];
  }

  @Watch("isModalShow")
  onModalChange(val: any) {
    val || this.closeModal();
  }
  @Watch("isModalDeleteShow")
  onModalClose(val: any) {
    val || this.closeModalDelete();
  }

  get modalTitle() {
    if (this.editedIndex === -2) return this.$t("positionList.titleSee");
    return this.editedIndex === -1
      ? this.$t("positionList.titleModalAdd")
      : this.$t("positionList.titleModalEdit");
  }
}
</script>
