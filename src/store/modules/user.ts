/*
 * @Author: xmj
 * @Date: 2022-06-12 11:01:10
 */

import { defineStore } from "pinia";
import { getToken, setToken } from "@/utils/auth/token";
import { http } from "@/utils/http";
import { getAuthCode } from "@/utils/wxmp/auth";
import { getUserProfile } from "@/utils/wxmp/auth";
type AuthInfo = {
  avatarUrl: string;
  nickName: string;
}
export type TopInfo = {
  bottom: number;
  height: number;
  left: number
  right: number;
  top: number;
  width: number;
}

export type UserState = {
  phoneNumber: number | null; // 用户手机号
  authInfo: AuthInfo, // 用户授权信息
  isAuth: boolean, // 是否授权
  openId: string; // openId
  token: string;
  myUserInfo: any;// 用户信息
  topInfo: TopInfo, // 顶部标题位置
  mobileInfo: any, // 手机信息
}

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    phoneNumber: uni.getStorageSync('phoneNumber') || null, // 手机号
    authInfo: uni.getStorageSync('authInfo') || {},
    isAuth: uni.getStorageSync('isAuth') || false,
    openId: uni.getStorageSync('openid') || '',
    token: getToken() || '',
    myUserInfo: uni.getStorageSync('myUserInfo') || {},
    topInfo: uni.getStorageSync('topInfo') || {},
    mobileInfo: uni.getStorageSync('mobileInfo') || {},
  }),
  getters: {
    getPhoneNumber(): number | null {
      return this.phoneNumber;
    },

    getUserInfo(): AuthInfo {
      return this.authInfo;
    },
    getIsAuth(): boolean {
      return this.isAuth;
    },

    getOpenId(): string {
      return this.openId;
    },

    getToken(): string {
      return this.token;
    },
    getMyUserInfo(): object {
      return this.myUserInfo;
    },
    getTopInfo(): any {
      return this.topInfo
    },

    getMobileInfo(): any {
      return this.mobileInfo
    },

  },
  actions: {

    setPhoneNumber(phoneNumber: number): void {
      uni.setStorageSync('phoneNumber', phoneNumber)
      this.phoneNumber = phoneNumber;
      console.log('phoneNumber', phoneNumber);

    },
    setTopInfo(): void {
      const info: TopInfo = uni.getMenuButtonBoundingClientRect();
      uni.setStorageSync('topInfo', info)
      this.topInfo = info;
    },
    setMobileInfo(): void {
      uni.getSystemInfo({
        success: (res) => {
          this.mobileInfo = res;
        }
      })
    },

    // 获取openid
    async asyncGetSessionKey() {
      return new Promise(async (resolve, reject) => {
        let code = await getAuthCode();
        const res: any = await http.post('Users/getPluginOpenpid', {
          code,
        });
        const openid = res.openid;
        this.openId = openid;
        uni.setStorageSync('openid', openid);
      })
    },
    //  获取授权用户信息
    async setAuthInfo() {
      return new Promise((resolve, reject): void => {
        getUserProfile().then((res) => {
          console.log('授权登录');
          // console.log(res.userInfo);
          // this.authInfo = res.userInfo;
          // this.isAuth = true;
          // uni.setStorageSync('authInfo', res.userInfo);
          // uni.setStorageSync('isAuth', true);
          resolve(res);
        })
      })
    },
    //  获取token
    async asyncSetToken(token: string) {
      return new Promise((resolve, reject): void => {
        this.token = token;
        setToken(token);
      })
    },

    //存储用户信息
    setUserInfo(user: any) {
      this.myUserInfo = user
      uni.setStorageSync('userId', user.id);
    },
  },
});
