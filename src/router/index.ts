import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/dashboard/Dashboard.vue";
import Login from "../views/Login.vue";
import store from "@/store/index";
import i18n from "@/i18n";

Vue.use(VueRouter);

const DEFAULT_TITLE = "Employee Management";

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: `/${i18n.locale}`,
    meta: { title: "Employee Management | The Internship App", reload: true },
  },
  {
    path: "/:lang",
    component: {
      render(c) {
        return c("router-view");
      },
    },
    meta: { title: "Employee Management | The Internship App" },
    children: [
      {
        path: "/",
        name: "login",
        component: Login,
        meta: { title: "Login | The Internship App", hideNavigation: true },
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () =>
          import(
            /* webpackChunkName: "Dashboard" */ "../views/dashboard/Dashboard.vue"
          ),
        meta: { title: "Dashboard | The Internship App", requiresAuth: true },
      },
      {
        path: "user",
        name: "userDetail",
        component: () =>
          import(
            /* webpackChunkName: "UserDetail" */ "../views/UserDetail.vue"
          ),
        meta: { requiresAuth: true },
      },
      {
        path: "changepassword",
        name: "changePassword",
        component: () =>
          import(
            /* webpackChunkName: "ChangePassword" */ "../views/ChangePassword.vue"
          ),
        meta: {
          title: "Change password | The Internship App",
          requiresAuth: true,
        },
      },
      {
        path: "profile",
        name: "profile",
        component: () =>
          import(
            /* webpackChunkName: "Profiles" */ "../views/profile/ProfileList.vue"
          ),
        meta: { title: "Profile | The Internship App", requiresAuth: true },
      },
      {
        path: "course",
        name: "course",
        component: () =>
          import(
            /* webpackChunkName: "Courses" */ "../views/course/courselist/CourseList.vue"
          ),
        meta: { title: "Course | The Internship App", requiresAuth: true },
      },
      {
        path: "course/edit/:id",
        name: "courseEdit",
        component: () =>
          import(
            /* webpackChunkName: "CourseEdit" */ "../views/course/CourseEdit.vue"
          ),
        props: true,
        meta: { title: "Edit course | The Internship App", requiresAuth: true },
      },
      {
        path: "course/edit/:id/participants",
        name: "courseParticipants",
        component: () =>
          import(
            /* webpackChunkName: "CourseParticipant" */ "../views/course/CourseParticipants.vue"
          ),
        props: true,
        meta: {
          title: "Course participant | The Internship App",
          requiresAuth: true,
        },
      },
      {
        path: "course/detail/:id",
        name: "courseDetail",
        component: () =>
          import(
            /* webpackChunkName: "CourseDetail" */ "../views/course/CourseDetail.vue"
          ),
        props: true,
        meta: {
          title: "Course detail | The Internship App",
          requiresAuth: true,
        },
      },
      {
        path: "course/register",
        name: "courseRegiser",
        component: () =>
          import(
            /* webpackChunkName: "CourseRegister" */ "../views/course/CourseRegister.vue"
          ),
        meta: {
          title: "Register course | The Internship App",
          requiresAuth: true,
        },
      },
      {
        path: "departments",
        name: "departments",
        component: () =>
          import(
            /* webpackChunkName: "Departments" */ "../views/master/department/DepartmentList.vue"
          ),
        meta: { title: "Departments | The Internship App", requiresAuth: true },
      },
      {
        path: "positions",
        name: "positions",
        component: () =>
          import(
            /* webpackChunkName: "Positions" */ "../views/master/position/PositionList.vue"
          ),
        meta: { title: "Positions | The Internship App", requiresAuth: true },
      },
    ],
  },
  {
    path: `/${i18n.locale}/404`,
    // alias: "*",
    name: "notFoundPage",
    component: () =>
      import(
        /* webpackChunkName: "NotFoundPage" */ "../views/TheNotFoundPage.vue"
      ),
    meta: { title: "404 Not Found | The Internship App" },
  },
  {
    path: "*",
    redirect: `/${i18n.locale}/404`,
    meta: { title: "404 Not Found | The Internship App" },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  // use the language from the routing param or default language
  let language = to.params.lang;

  const arrayLang: string[] = Object.keys(i18n.messages);
  let flag = true;
  for (let i = 0; i < arrayLang.length; i++) {
    if (arrayLang[i] === language) flag = false;
  }

  if (!language || flag) {
    language = "en";
  }
  //set the current language for i18n
  i18n.locale = language;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.user.isLoggedIn === false) {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title =
      to.meta !== undefined && to.meta.title !== undefined
        ? to.meta.title
        : DEFAULT_TITLE;
  });
});

export default router;
