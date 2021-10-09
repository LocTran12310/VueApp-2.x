import Vue from "vue";
import API from "@/utils/api";
import { Store, GetterTree, MutationTree, Module, ActionTree } from "vuex";
import { ProfilesState, RootState } from "../models/types";

export const state: ProfilesState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.profiles?.items,
};

export const getters: GetterTree<ProfilesState, RootState> = {
  employeesID: (state) =>
    state.items?.result?.map((item: any) => item.employee_id),
  officialYear: (state) => {
    const officialYear = state.items?.result?.map((item: any) => {
      return item.official_date.split("-")[0];
    });
    const officialYearGroup: string[] = [];
    const officialYearGroupCount: string[] = [];

    officialYear?.map((year: string) => {
      if (officialYearGroup?.indexOf(year) === -1) {
        officialYearGroup?.push(year);
        officialYearGroupCount?.push(
          officialYear?.filter((v: string) => {
            return v === year;
          })
        );
      }
    });

    //[...officialYearGroup.key()].sort()
    const indices = Array.from(officialYearGroup?.keys()).sort((a, b) =>
      officialYearGroup[a].localeCompare(officialYearGroup[b])
    );

    const sortedYearGroup = indices?.map((i) => officialYearGroup[i]);
    const sortedYearGroupCount = indices?.map((i) => officialYearGroupCount[i]);

    //get last 10 years from now
    const YEAR_NEEDED = 10;
    const getLastYear = (arr: any) => {
      return arr.slice(arr.length - YEAR_NEEDED, arr.length);
    };

    const yearGroup = getLastYear(sortedYearGroup);
    const yearGroupCount = getLastYear(sortedYearGroupCount);
    return { yearGroup, yearGroupCount };
  },
};

export const mutations: MutationTree<ProfilesState> = {
  setProfiles(state, profiles) {
    state.items = profiles;
  },
  addProfiles(state, profile) {
    state.items.result.push(profile);
  },
  editProfiles(state, profile) {
    const index = state.items.result.findIndex((item: any) => {
      return item.id === profile.id;
    });
    if (index !== -1) Vue.set(state.items.result, index, profile);
  },
};

export const actions: ActionTree<ProfilesState, RootState> = {
  getProfiles({ commit }, queryParams) {
    // If queryParams empty ==> return ALL PROFILES
    return new Promise((resolve, reject) => {
      API.get("/auth/profiles/")
        .then(async (res) => {
          await commit("setProfiles", res.data);
          resolve(JSON.parse(JSON.stringify(res.data)));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createProfile({ commit }, profile) {
    return new Promise((resolve, reject) => {
      API.post("/auth/profiles/create", profile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          commit("addProfiles", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateProfile({ commit }, profile) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/profiles/update/" + profile.get("id"), profile)
        .then((res) => {
          commit("editProfiles", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteProfile(context, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/profiles/delete/" + id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const profiles: Module<ProfilesState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};
