import { useTabbarStore } from '@/store/modules/tabbar';
export const useTabbar = () => {

  const initTabbar = (index: number): void => {
    useTabbarStore().setTabbarIndex(index)
    uni.hideTabBar({
      animation: false,
      success: res => {
        useTabbarStore().setTabbarShow(true);      
      }
    });
  }

  return {
    initTabbar
  }

}