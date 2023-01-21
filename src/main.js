import "@/scss/ffxivadvancedrotations.scss";

import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { i18n } from "@/i18n/";
import { tooltip, popover, tooltipPopover } from "@/directives/bootstrap";

const pinia = createPinia();
const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  console.group("ErrorHandler");
  console.log(err);
  console.log(vm);
  console.log(info);
  console.groupEnd();
};

app.use(router);
app.use(i18n);
app.use(pinia);

app.directive("tooltip", tooltip);
app.directive("popover", popover);
app.directive("tooltipPopover", tooltipPopover);

app.mount("#app");
