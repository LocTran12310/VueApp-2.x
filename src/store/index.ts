import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { user } from "./modules/user";
import { alert } from "./modules/alert";
import { profiles } from "./modules/profiles";
import { courses } from "./modules/courses";
import { positions } from "./modules/positions";
import { departments } from "./modules/departments";
import { leaveDetails } from "./modules/leave_details";
import { leaveTypes } from "./modules/leave_types";
import { leaveReasons } from "./modules/leave_reasons";

// import { history } from "./plugin";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({})],
  // plugins: [history({ persist: true })],
  state: undefined,
  mutations: {},
  actions: {},
  modules: {
    alert,
    user,
    profiles,
    courses,
    positions,
    departments,
    leaveDetails,
    leaveTypes,
    leaveReasons,
  },
});
