// noinspection AllyPlainJsInspection

import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { setLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/";

const castParams = (casts) => {
  return (route) => {
    const props = {};
    for (const key in route.params) {
      const rawValue = route.params[key];
      const cast = casts[key];
      if (rawValue == null) {
        // Don't attempt to cast null or undefined values
        props[key] = rawValue;
      } else if (cast == null) {
        // No cast specified for this parameter
        props[key] = rawValue;
      } else if (cast === "String") {
        props[key] = rawValue;
      } else if (cast === "Number") {
        // Try to cast this parameter as an integer
        const castValue = Number.parseInt(rawValue, 10);
        props[key] = isNaN(castValue) ? rawValue : castValue;
      } else if (cast === "Boolean") {
        // Try to cast this parameter as a boolean
        if (rawValue === "true" || rawValue === "1") {
          props[key] = true;
        } else if (rawValue === "false" || rawValue === "0") {
          props[key] = false;
        } else {
          props[key] = rawValue;
        }
      } else if (typeof cast == "function") {
        // Use the supplied function to cast this param
        props[key] = cast(rawValue);
      } else {
        console.error("Unexpected route param cast", cast);
        props[key] = rawValue;
      }
    }
    return props;
  };
};

const historyMode =
  import.meta.env.VITE_ROUTER_HISTROY_MODE === "hash"
    ? createWebHashHistory()
    : createWebHistory();
const router = createRouter({
  history: historyMode,
  routes: [
    {
      name: "jobActions",
      path: "/:locale/jobActions/:jobId/:rotation?",
      component: () => import("@/components/views/JobActions.vue"),
      props: castParams({
        locale: "String",
        jobId: "Number",
        rotation: "String",
      }),
    },
    {
      path: "/",
      redirect: `/${DEFAULT_LOCALE}`,
    },
    {
      path: "/:locale",
      component: () => import("@/components/views/NewsVersion.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: `/${DEFAULT_LOCALE}`,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const newLocale = to.params.locale;
  const oldLocale = from.params.locale;

  if (newLocale === oldLocale) {
    next();
    return;
  }

  if (!Object.keys(SUPPORTED_LOCALES).includes(newLocale)) {
    next(`/${DEFAULT_LOCALE}`);
  }

  await setLocale(newLocale);
  next();
});

export default router;
