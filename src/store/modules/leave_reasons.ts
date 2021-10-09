import API from "@/utils/api";
import Vue from "vue";
import { ActionTree, Module, MutationTree } from "vuex";
import { LeaveReasonsState, RootState } from "../models/types";

export const state: LeaveReasonsState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.leaveReasons?.items,
};

export const mutations: MutationTree<LeaveReasonsState> = {
  setReasons(state, reasons) {
    state.items = reasons;
  },
  addReason(state, reason) {
    state.items.push(reason);
  },
  editReason(state, reason) {
    const index = state.items.findIndex((item: any) => {
      return item.id === reason.id;
    });
    if (index !== -1) Vue.set(state.items, index, reason);
  },
};

export const actions: ActionTree<LeaveReasonsState, RootState> = {
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
  createLeaveReason({ commit }, leaveReason) {
    return new Promise((resolve, reject) => {
      API.post("/auth/leave/reasons/create", leaveReason)
        .then((res) => {
          commit("addReason", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateLeaveReason({ commit }, leaveReason) {
    const leaveReasonJson = JSON.stringify(leaveReason);
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/reasons/update/" + leaveReason.id, leaveReasonJson)
        .then((res) => {
          commit("editReason", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteLeaveReason({ commit }, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/reasons/delete/" + id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const leaveReasons: Module<LeaveReasonsState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};
