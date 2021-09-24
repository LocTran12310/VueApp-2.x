import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { AlertState, RootState } from "../models/types";

// type AlertGetter = GetterTree<AlertState, RootState>;

export const state: AlertState = {
  snackBarAlert: {
    isShow: false,
    icon: "",
    message: "",
    color: "",
    timeOut: 5000,
  },
};

export const mutations: MutationTree<AlertState> = {
  setAlert(state, alert) {
    state.snackBarAlert = alert;
  },
};
export const actions: ActionTree<AlertState, RootState> = {
  showAlert({ commit }, alert: AlertState) {
    commit("setAlert", alert);
  },
};

export const alert: Module<AlertState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};
