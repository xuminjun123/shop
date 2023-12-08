import { defineStore } from "pinia";
// import { http } from "../utils/http";

export type TabBarState = {
    tabbarShow: boolean,
    tabbarIndex: number
}

export const useTabbarStore = defineStore({
  id: "tabbar",
  state: (): TabBarState => ({
    tabbarShow: false,
    tabbarIndex: 0
  }),
  getters: {
    getTabbarShow(): boolean {
        return this.tabbarShow
    },
    getTabbarIndex(): number {
        return this.tabbarIndex
    }
  },
  actions: {
    setTabbarShow(tabbarShow: boolean){
        this.tabbarShow = tabbarShow;
    },
    setTabbarIndex(tabbarIndex: number){
        this.tabbarIndex = tabbarIndex;
    }
  },
});
