/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description:
 */
// import 'amfe-flexible'
import "normalize.css/normalize.css";
import "@/styles/index.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueViewer from "v-viewer";
import "viewerjs/dist/viewer.css"; // 引入css
import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "./routerHook";
import "./icons";
import "@/core/index";
import 'default-passive-events';//去除touchstart谷歌提示
Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.use(VueViewer, {
  defaultOptions: {
    zIndex: 9999,
  },
});

Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
