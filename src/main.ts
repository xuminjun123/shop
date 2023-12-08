/*
 * @Description: 
 * @param : 
 * @return: 
 * @Author: xmj
 * @Date: 2022-09-02 09:31:46
 */
import { createSSRApp } from "vue";
import App from "./App.vue";
// import CustomPage from "@/components/customPage/index.vue";
// import ScrollSwiperTab from '@/components/scrollSwiperTab/index.vue';
// import StickyView from '@/components/stickyView/index.vue';
import esPage from "./easy-ui/components/es-page/page.vue";
import hpyFormSelect from '@/components/hpy-form-select/components/hpy-form-select/hpy-form-select.vue';
import { setupStore } from '@/store';
import tmui from "./tmui";


export function createApp() {
  const app = createSSRApp(App);
  app.use(tmui);
  setupStore(app)
  // 全局自定义组件
  // app.component('custom-page', CustomPage);
  // app.component('scroll-swiper-tab', ScrollSwiperTab);
  // app.component('sticky-view', StickyView);
  app.component("EsPage", esPage);
  app.component("hpy-form-select", hpyFormSelect);
  return {
    app,
  };

}
