/*
 * @Description: 授权hook
 * @Author: xmj
 * @Date: 2022-06-20 11:16:10
 */
import { computed } from "vue";
import avatar from "@/static/login/avatar.png";

import { useUserStore } from "@/store/modules/user";
export const useAuth = () => {
  const userStore = useUserStore();

  const avatarSrc = computed(() => {
    const isAuth = userStore.getIsAuth;
    const userInfo: any = userStore.getUserInfo;
    if (isAuth) {
      return userInfo.avatarUrl;
    } else {
      return avatar;
    }
  });
  const userName = computed(() => {
    const isAuth = userStore.getIsAuth;
    const userInfo: any = uni.getStorageSync("authInfo");
    if (isAuth) {
      return userInfo.nickName;
    } else {
      return '';
    }
  });


  return {
    isAuth: userStore.getIsAuth,
    avatarSrc,
    userName,
  };
};
