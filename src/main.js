import App from "./App.vue";
import router from "./router";
import store from "./stores";
import { createApp } from "vue";
import 'element-plus/dist/index.css'
import "./styles/reset.scss";

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
