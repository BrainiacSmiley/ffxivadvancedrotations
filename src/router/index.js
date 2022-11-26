import { createRouter, createWebHistory } from "vue-router";
import { setLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/";
import NewsVersion from "@/components/NewsVersion";
import JobActions from "@/components/JobActions";

const castParams = (casts) => {
  return (route) => {
    const props = {};
    for (var key in route.params) {
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
        console.log("Unexpected route param cast", cast);
        props[key] = rawValue;
      }
    }
    return props;
  };
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: `/${DEFAULT_LOCALE}`,
    },
    {
      name: "jobActions",
      path: "/:locale/jobActions/:jobId",
      component: JobActions,
      props: castParams({ locale: "String", jobId: "Number" }),
    },
    {
      path: "/:locale",
      component: NewsVersion,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const newLocale = to.params.locale;
  const oldLocale = from.params.locale;

  if (newLocale === oldLocale) {
    next();
    return;
  }

  if (Object.keys(!SUPPORTED_LOCALES).includes(newLocale)) {
    next(`/${DEFAULT_LOCALE}`);
  }

  setLocale(newLocale);
  next();
});

export default router;
