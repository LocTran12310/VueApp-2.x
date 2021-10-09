import API from "@/utils/api";
import Vue from "vue";
import { ActionTree, Module, MutationTree } from "vuex";
import { LeaveTypesState, RootState } from "../models/types";

export const state: LeaveTypesState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.leaveTypes?.items,
};

export const mutations: MutationTree<LeaveTypesState> = {
  setTypes(state, types) {
    state.items = types;
  },
  addType(state, type) {
    state.items.push(type);
  },
  editType(state, type) {
    const index = state.items.findIndex((item: any) => {
      return item.id === type.id;
    });
    if (index !== -1) Vue.set(state.items, index, type);
  },
};

export const actions: ActionTree<LeaveTypesState, RootState> = {
  getLeaveTypes({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/auth/leave/types/")
        .then((res) => {
          commit("setTypes", res.data.result);
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createLeaveType({ commit }, leaveType) {
    return new Promise((resolve, reject) => {
      API.post("/auth/leave/types/create", leaveType)
        .then((res) => {
          commit("addType", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateLeaveType({ commit }, leaveType) {
    const leaveTypeJson = JSON.stringify(leaveType);
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/types/update/" + leaveType.id, leaveTypeJson)
        .then((res) => {
          commit("editType", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteLeaveType({ commit }, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/types/delete/" + id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getLeaveReasons({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/auth/leave/reasons/")
        .then((res) => {
          commit("setReasons", res.data.result);
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const leaveTypes: Module<LeaveTypesState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};
