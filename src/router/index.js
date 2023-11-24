import { createRouter, createWebHistory } from "vue-router";
import swal from "sweetalert";
import Index from "../views/Index.vue";
import Dashboard from "../views/Dashboard.vue";
import Records from "../views/Records.vue";
import Funds from "../views/Funds.vue";
import Account from "../views/Account.vue";
import NotFound from "../views/NotFound.vue";
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";

const routes = [
  {
    path: "/",
    name: "Index",
    meta: { locked: false },
    component: Index,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/funds",
    name: "Funds",
    component: Funds,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

function validateSession() {
  const authStore = useAuthStore();
  const { auth } = storeToRefs(authStore);
  const tokenHasData = (auth.value.token !== "" && auth.value.token !== null && auth.value.token !== undefined);
  const expirationDate = new Date(auth.value.exp * 1000);
  const tokenIsNotExpired = expirationDate > new Date();
  const tokenIsValid = tokenHasData && tokenIsNotExpired;

  if (!tokenIsValid) {
    authStore.logout();
    swal({
      icon: "info",
      title: "Please log in",
      text: "To protect your data, your session has finished.",
      timer: 3000,
      button: false
    });
    router.replace("/");
  }
}

router.beforeEach(async (to, from) => {
  if (to.name !== 'Index') validateSession()
});

export default router;
