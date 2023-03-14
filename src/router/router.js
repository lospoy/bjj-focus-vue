import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Settings from "../views/Settings.vue";
import Charts from "../views/student/Charts.vue";
import PrivateClass from "../views/student/PrivateClass.vue";
import StudentHome from "../views/student/StudentHome.vue";
import StudentSession from "../views/student/StudentSession.vue";
import Human from "../views/teacher/Human.vue";
import Overview from "../views/teacher/Overview.vue";
import Session from "../views/teacher/Session.vue";
import StudentList from "../views/teacher/StudentList.vue";
import Technique from "../views/teacher/Technique.vue";

const routes = [
  // ROLE AGNOSTIC/ALL USERS
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },

  // ADMIN ROUTES
  {
    path: "/teacher/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/teacher/session",
    name: "Session",
    component: Session,
  },
  {
    path: "/teacher/human",
    name: "Human",
    component: Human,
  },
  {
    path: "/teacher/technique",
    name: "Technique",
    component: Technique,
  },
  {
    path: "/teacher/student-list",
    name: "StudentList",
    component: StudentList,
  },

  // STUDENT ROUTES
  {
    path: "/student/home",
    name: "StudentHome",
    component: StudentHome,
  },
  {
    path: "/student/charts",
    name: "Charts",
    component: Charts,
  },
  {
    path: "/student/private-class",
    name: "PrivateClass",
    component: PrivateClass,
  },
  {
    path: "/student/session",
    name: "StudentSession",
    component: StudentSession,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
