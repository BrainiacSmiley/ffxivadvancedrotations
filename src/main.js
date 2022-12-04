// import "@/assets/css/reset.css";
import "floating-vue/dist/style.css";
import "@/css/v-popper.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "mdb-ui-kit/css/mdb.min.css";

import App from "@/App.vue";
import FloatingVue from "floating-vue";
import router from "@/router";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { i18n } from "@/i18n/";
import "material-symbols";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(FloatingVue);
app.use(i18n);
app.use(pinia);

app.mount("#app");
