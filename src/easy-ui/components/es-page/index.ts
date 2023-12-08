/*
 * @Author: xmj
 * @Date: 2022-06-12 15:39:14
 */
import Page from "./page.vue";

export const esPage = {
  install(app: any) {
    console.log("esPage install-->>>>>", app);
    app.component("EsPage", Page);
  },
};
