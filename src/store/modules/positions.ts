import Vue from "vue";
import API from "@/utils/api";
import { Module, ActionTree, GetterTree, MutationTree } from "vuex";
import { PositionsState, RootState } from "../models/types";

export const state: PositionsState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.positions?.items,
};

export const getters: GetterTree<PositionsState, RootState> = {
  positionsName: (state) => state.items?.map((item: any) => item.name),
  positionsShortName: (state) =>
    state.items?.map((item: any) => item.short_name),
};

export const mutations: MutationTree<PositionsState> = {
  setPositions(state, positions) {
    state.items = positions;
  },
  addPosition(state, position) {
    state.items.push(position);
  },
  updatePosition(state, position) {
    const index = state.items.findIndex((item: any) => {
      return item.id === position.id;
    });
    if (index !== -1) Vue.set(state.items, index, position);
  },
};

export const actions: ActionTree<PositionsState, RootState> = {
  getPositions({ commit }) {
    return new Promise((resolve, reject) => {
      API.get("/auth/positions/")
        .then((res) => {
          commit("setPositions", res.data.result);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createPosition({ commit }, position) {
    return new Promise((resolve, reject) => {
      API.post("/auth/positions/create", position)
        .then((res) => {
          commit("addPosition", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updatePosition({ commit }, position) {
    return new Promise((resolve, reject) => {
      const positionJson = JSON.stringify(position);
      API.patch("/auth/positions/update/" + position.id, positionJson)
        .then((res) => {
          commit("updatePosition", res.data.data);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deletePosition({ commit }, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/positions/delete/" + id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const positions: Module<PositionsState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};
