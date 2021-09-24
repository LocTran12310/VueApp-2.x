import API from "@/utils/api";
import { Store, GetterTree, MutationTree, Module, ActionTree } from "vuex";
import { UserState, RootState } from "../models/types";

export const state: UserState = {
  user:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.user?.user,
  isLoggedIn:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.user?.isLoggedIn,
};

export const mutations: MutationTree<UserState> = {
  login(state, user) {
    state.user = user;
    state.isLoggedIn = true;
  },
  logout(state) {
    state.user = {};
    state.isLoggedIn = false;
  },
};

export const actions: ActionTree<UserState, RootState> = {
  loginAsync({ commit, dispatch, rootGetters }, user) {
    return new Promise((resolve, reject) => {
      API.post("/login", user)
        .then(async (res) => {
          console.log("HEADER:", res.headers);
          commit("login", res.data);
          dispatch("profiles/getProfiles", null, { root: true });
          dispatch("positions/getPositions", null, { root: true });
          dispatch("departments/getDepartments", null, { root: true });
          resolve(res?.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  logoutAsync({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/logout")
        .then((res) => {
          commit("logout");
          commit("profiles/setProfiles", {}, { root: true });
          commit("courses/setCourses", {}, { root: true });
          commit("positions/setPositions", {}, { root: true });
          commit("departments/setDepartments", {}, { root: true });
          commit("alert/setAlert", {}, { root: true });

          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  changePassword(context, user) {
    const password = JSON.stringify(user);
    return new Promise((resolve, reject) => {
      console.log(user);
      API.patch("/auth/user/changepassword/" + user.id, password)
        .then((res) => {
          console.log(res);
          resolve(res.data);
        })
        .catch((err) => {
          console.log(err);

          reject(err);
        });
    });
  },
  createUser(context, user) {
    return new Promise((resolve, reject) => {
      API.post("user/signup", user)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const user: Module<UserState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};
