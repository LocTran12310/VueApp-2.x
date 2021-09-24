import API from "@/utils/api";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { CoursesState, RootState } from "../models/types";

// type AlertGetter = GetterTree<AlertState, RootState>;

export const state: CoursesState = {
  items:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.courses?.items,
  courseParticipants:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.courses?.courseParticipants,
};

export const mutations: MutationTree<CoursesState> = {
  setCourses(state, courses) {
    state.items = courses;
  },
  setCourseParticipants(state, courseParticipants) {
    state.courseParticipants = courseParticipants;
  },
};
export const actions: ActionTree<CoursesState, RootState> = {
  getCourses(context, queryParams) {
    return new Promise((resolve, reject) => {
      API.get("/auth/courses/")
        .then((res) => {
          context.commit("setCourses", res.data.result);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createCourse(context, course) {
    return new Promise((resolve, reject) => {
      API.post("/auth/courses/create", course)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateCourse(context, course) {
    return new Promise((resolve, reject) => {
      const courseJson = JSON.stringify(course);
      API.patch("/auth/courses/update/" + course.id, courseJson)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteCourse(context, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/courses/delete/" + id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getCourseParticipants(context, id) {
    return new Promise((resolve, reject) => {
      API.get("/auth/courses/" + id + "/participants")
        .then((res) => {
          context.commit("setCourseParticipants", res.data.result);
          resolve(JSON.parse(JSON.stringify(res.data.result)));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createCourseParticipant(context, participant) {
    return new Promise((resolve, reject) => {
      API.post("/auth/courses/participant/create", participant)
        .then((res) => {
          resolve(JSON.parse(JSON.stringify(res.data)));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteParticipant(context, id) {
    return new Promise((resolve, reject) => {
      API.patch("/auth/courses/participant/delete/" + id)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const courses: Module<CoursesState, RootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};
