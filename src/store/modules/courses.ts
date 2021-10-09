import Vue from "vue";
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
  allCourseParticipants:
    localStorage.getItem("vuex") &&
    JSON.parse(localStorage.getItem("vuex") || "")?.courses
      ?.allCourseParticipants,
};
export const getters: GetterTree<CoursesState, RootState> = {
  courseParticipantList: (state) => (year: string) => {
    const courses = state.items?.filter((item: any) => {
      return item.start_date.split("-")[0] === year;
    });

    const courseParticipantList: any[] = [];

    courses.map((course: any) => {
      const courseParticipants = state.allCourseParticipants.filter(
        (courseParticipant: any) => {
          return courseParticipant.course_id === course.id;
        }
      );
      if (courseParticipants.length > 0) {
        courseParticipantList.push(courseParticipants);
      }
    });

    const courseParticipantListCount: number[] = courseParticipantList.map(
      (item: any) => {
        return item.length;
      }
    );
    const indices = Array.from(
      Array(courseParticipantListCount.length).keys()
    ).sort((a: number, b: number) =>
      courseParticipantListCount[a] < courseParticipantListCount[b]
        ? -1
        : courseParticipantListCount[a] > courseParticipantListCount[b]
        ? 1
        : 0
    );
    const sortedParticipantList = indices.map((i) => courseParticipantList[i]);
    const sortedParticipantListCount = indices.map(
      (i) => courseParticipantListCount[i]
    );

    return { sortedParticipantList, sortedParticipantListCount };
  },
};
export const mutations: MutationTree<CoursesState> = {
  setCourses(state, courses) {
    state.items = courses;
  },
  setAllCourseParticipants(state, courseParticipants) {
    state.allCourseParticipants = courseParticipants;
  },
  setCourseParticipants(state, courseParticipants) {
    state.courseParticipants = courseParticipants;
  },
  addCourses(state, course) {
    state.items.push(course);
  },
  editCourses(state, course) {
    const index = state.items?.findIndex((item: any) => {
      return item.id === course.id;
    });
    if (index !== -1) Vue.set(state.items, index, course);
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
  createCourse({ commit }, course) {
    return new Promise((resolve, reject) => {
      API.post("/auth/courses/create", course)
        .then((res) => {
          commit("addCourses", res.data.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateCourse({ commit }, course) {
    return new Promise((resolve, reject) => {
      const courseJson = JSON.stringify(course);
      API.patch("/auth/courses/update/" + course.id, courseJson)
        .then((res) => {
          commit("editCourses", res.data.data);
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
  getAllCourseParticipants(context) {
    return new Promise((resolve, reject) => {
      API.get("/auth/courses/participants")
        .then((res) => {
          context.commit("setAllCourseParticipants", res.data.result);
          resolve(res);
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
  getters,
  mutations,
  actions,
  namespaced: true,
};
