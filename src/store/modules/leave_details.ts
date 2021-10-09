import Vue from "vue";
import API from "@/utils/api";
import { ActionTree, Module, MutationTree } from "vuex";
import { LeaveState, RootState } from "../models/types";

export const actions: ActionTree<LeaveState, RootState> = {
  getAllLeaveDetails({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/auth/leave/")
        .then((res) => {
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  createLeaveDetails({ commit }, leaves) {
    return new Promise((resolve, reject) => {
      API.post("/auth/leave/create", leaves)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getLeaveDetails({ commit }, userId) {
    return new Promise((resolve, reject) => {
      API.get("/auth/leave/" + userId)
        .then((res) => {
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateLeaveDetails({ commit }, leaveDetails) {
    const leaveDetailsJson = JSON.stringify(leaveDetails);
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/update/" + leaveDetails.id, leaveDetailsJson)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteLeaveDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/leave/delete/" + id)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const leaveDetails: Module<LeaveState, RootState> = {
  actions,
  namespaced: true,
};
