import { createRouter, createWebHistory } from "vue-router";
import { setLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/";
import NewsVersion from "@/components/NewsVersion";
import JobActions from "@/components/JobActions";

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
      props: true,
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
