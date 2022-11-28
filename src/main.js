import "floating-vue/dist/style.css";
import "@/css/v-popper.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "mdb-ui-kit/css/mdb.min.css";

import { createApp } from "vue";
import App from "@/App.vue";
import JobsMenu from "@/components/nav/JobsMenu.vue";
import JobEntry from "@/components/nav/JobEntry.vue";
import JobActions from "@/components/JobActions.vue";
import ActionIcon from "@/components/action/ActionIcon";
import RotationActionIcon from "@/components/action/RotationActionIcon";
import ActionGroup from "@/components/action/ActionGroup";
import LocaleSwitcher from "@/components/nav/LocaleSwitcher";
import FloatingVue from "floating-vue";
import { createPinia } from "pinia";
import { i18n } from "@/i18n/";
import router from "@/router";

const pinia = createPinia();
const app = createApp(App);

app.component("jobs-menu", JobsMenu);
app.component("job-entry", JobEntry);
app.component("job-actions", JobActions);
app.component("action-group", ActionGroup);
app.component("action-icon", ActionIcon);
app.component("rotation-action-icon", RotationActionIcon);
app.component("locale-switcher", LocaleSwitcher);

app.use(router);
app.use(FloatingVue);
app.use(i18n);
app.use(pinia);

app.mount("#app");
