<template>
  <div>
    <v-dialog v-model="isModalShow" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          {{ $t("positionList.btnAdd") }}
        </v-btn>
      </template>
      <v-form ref="departmentModalForm" lazy-validation class="white pa-5">
        <span class="text-h5 pl-3 pb-3">{{ modalTitle }}</span>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="4" md="5" class="black--text pt-3 pl-4">
              Name
            </v-col>
            <v-col cols="12" sm="8" md="7" class="pr-4">
              <v-text-field
                :rules="rules.name"
                v-model="editedItem.name"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="4" md="5" class="black--text pt-3 pl-4">
              Short Name
            </v-col>
            <v-col cols="12" sm="8" md="7" class="pr-4">
              <v-text-field
                :rules="rules.shortName"
                v-model="editedItem.short_name"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="4" md="5" class="black--text pt-3 pl-4">
              Note
            </v-col>
            <v-col cols="12" sm="8" md="7" class="pr-4">
              <v-textarea v-model="editedItem.note" outlined dense>
              </v-textarea>
            </v-col>
          </v-row>
          <v-row dense>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-4 red--text mr-4" @click="close">
              {{ $t("positionList.btnCancel") }}
            </v-btn>
            <v-btn
              color="blue darken-2 mr-4"
              dark
              @click="save"
              :loading="isModalLoading"
            >
              <v-icon left dense>mdi-content-save</v-icon>
              {{ $t("positionList.btnSave") }}
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Prop } from "vue-property-decorator";
import store from "@/store/index";

@Component
export default class DepartmentModal extends Vue {
  @PropSync("isModalLoadingSync", { type: Boolean }) isModalLoading!: boolean;
  @PropSync("isModalShowSync", { type: Boolean }) isModalShow!: boolean;
  @PropSync("editedItemSync", { type: Object, required: true }) editedItem: any;
  @PropSync("departmentsSync", { type: Array }) departments!: any;

  @Prop(Number) readonly editedIndex!: number;
  @Prop(String) readonly modalTitle!: string;
  @Prop(Function) close!: any;
  @Prop(Function) save!: any;
  @Prop(Function) deleteItemConfirm!: any;

  $refs!: {
    departmentModalForm: HTMLFormElement;
  };

  departmentsName = store.getters["departments/departmentsName"];
  departmentsShortName = store.getters["departments/departmentsShortName"];

  get rules() {
    return this.editedIndex > -1
      ? {
          name: [(v: string) => !!v || this.$t("positionList.rules.name")],
          shortName: [
            (v: string) => !!v || this.$t("positionList.rules.shortName"),
          ],
        }
      : {
          name: [
            (v: string) => !!v || this.$t("positionList.rules.name"),
            (v: string) =>
              v &&
              this.checkDepartmentExist(
                v,
                this.departmentsName,
                this.$t("positionList.rules.nameIsExisted")
              ),
          ],
          shortName: [
            (v: string) => !!v || this.$t("positionList.rules.shortName"),
            (v: string) =>
              v &&
              this.checkDepartmentExist(
                v,
                this.departmentsShortName,
                this.$t("positionList.rules.shortNameIsExisted")
              ),
          ],
        };
  }

  checkDepartmentExist(value: string, items: string[], message: any) {
    const itemsLength = items.length;
    for (let i = 0; i < itemsLength; i++) {
      if (items[i] === value) return message;
    }
    return true;
  }
}
</script>
