import Vue from "vue";
import API from "@/utils/api";
import { Module, ActionTree, GetterTree, MutationTree } from "vuex";
import { DepartmentsState, RootState } from "../models/types";

export const state: DepartmentsState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.departments?.items,
};

export const getters: GetterTree<DepartmentsState, RootState> = {
  departmentsName: (state) => state.items?.map((item: any) => item.name),
  departmentsShortName: (state) =>
    state.items?.map((item: any) => item.short_name),
};

export const mutations: MutationTree<DepartmentsState> = {
  setDepartments(state, departments) {
    state.items = departments;
  },
  addDepartment(state, department) {
    state.items.push(department);
  },
  updateDepartment(state, department) {
    const index = state.items.findIndex((item: any) => {
      return item.id === department.id;
    });
    if (index !== -1) Vue.set(state.items, index, department);
  },
};

export const actions: ActionTree<DepartmentsState, RootState> = {
  getDepartments({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/auth/departments/")
        .then((res) => {
          commit("setDepartments", res.data.result);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createDepartment({ commit }, department) {
    return new Promise((resolve, reject) => {
      API.post("/auth/departments/create", department)
        .then((res) => {
          commit("addDepartment", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateDepartment({ commit }, department) {
    return new Promise((resolve, reject) => {
      const departmentJson = JSON.stringify(department);
      API.patch("/auth/departments/update/" + department.id, departmentJson)
        .then((res) => {
          commit("updateDepartment", res.data.data);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteDepartment({ commit }, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/departments/delete/" + id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const departments: Module<DepartmentsState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};
