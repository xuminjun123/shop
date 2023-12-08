import { listItem, openTypeEvent } from "../es-list/types";

export function useOpenType() {
  return {
    getphonenumber(event, menuItem: listItem | null = null) {
      if (!menuItem) {
        console.error("EasyAppError:参数menuItem错误");
        return;
      }
      if (menuItem.openType === "getPhoneNumber") {
        // 判断menuItem.openSuccess 是否为函数
        if (typeof menuItem.openSuccess === "function") {
          menuItem.openSuccess(event.detail);
        } else {
          console.error("EasyAppError:参数openSuccess错误");
        }
      } else {
        console.error("useOpenType getphonenumber error");
      }
    },
    getuserinfo(event, menuItem: listItem | null = null) {
      if (!menuItem) {
        console.error("EasyAppError:参数menuItem错误");
        return;
      }
      if (menuItem.openType === "getUserInfo") {
        if (typeof menuItem.openSuccess === "function") {
          menuItem.openSuccess(event.detail);
        } else {
          console.error("EasyAppError:参数openSuccess错误");
        }
      } else {
        console.error("useOpenType getuserinfo error");
      }
    },
    opensetting(event, menuItem: listItem | null = null) {
      if (!menuItem) {
        console.error("EasyAppError:参数menuItem错误");
        return;
      }
      if (menuItem.openType === "openSetting") {
        if (typeof menuItem.openSuccess === "function") {
          menuItem.openSuccess(event.detail);
        } else {
          console.error("EasyAppError:参数openSuccess错误");
        }
      } else {
        console.error("useOpenType opensetting error");
      }
    },
    launchapp(event, menuItem: listItem | null = null) {
      if (!menuItem) {
        console.error("EasyAppError:参数menuItem错误");
        return;
      }
      if (menuItem.openType === "launchApp") {
        if (typeof menuItem.openSuccess === "function") {
          menuItem.openSuccess(event.detail);
        } else {
          console.error("EasyAppError:参数openSuccess错误");
        }
      } else {
        console.error("useOpenType launchapp error");
      }
    },
  } as openTypeEvent;
}
