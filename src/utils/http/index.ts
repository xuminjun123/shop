import config from "../../config";
import qs from "qs";
import {
  getOptions,
  postOptions,
  requestOptions,
  serverResponse,
} from "./interface";

import { getToken } from "../auth/token";
import { loading, hideLoading } from "../toast";
const alertConfirmBtnColor = "#019fba";
/**
 * 请求前拦截器
 * @param options
 */
const httpBefore = function (options: requestOptions) {
  !options.header ? (options.header = {}) : "";
  let token = getToken() || "";
  token ? (options.header.Authorization = config.tokenPrefix + token) : "";
  options.header["Content-Type"] = options.header["Content-Type"] ? 'application/x-www-form-urlencoded' : "application/json";
  return options;
};
/**
 * 请求后拦截器
 * @param response
 */
const httpAfter = async function (response: any): Promise<serverResponse> {
  // 判断请求状态码
  if (response.statusCode !== 200) {
    console.warn("请求异常");
    uni.showModal({
      title: "提示",
      content: `错误代码:${response.statusCode}`,
      showCancel: false,
      confirmColor: alertConfirmBtnColor,
    });
    // uni.hideLoading();
    return Promise.reject(
      `提示|错误代码:${response.statusCode}|错误信息:http请求异常`
    );
  } else {
    // 判断业务状态码
    try {
      await checkStatusCode(response.data);
      console.log("判断业务状态码成功", response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

};
/**
 * 检测业务码状态
 * @param res
 */
const checkStatusCode = async function (res: serverResponse) {
  let errMessage = "";
  switch (res.code) {
    case 400:
      errMessage = `${res.msg}`;
      break;
    case 401:
      errMessage = "用户没有权限（令牌、用户名、密码错误）!";
      break;
    case 403:
      errMessage = "用户得到授权，但是访问是被禁止的。";
      break;
    // 404请求不存在
    case 404:
      errMessage = "网络请求错误,未找到该资源!";
      break;
    case 405:
      errMessage = "网络请求错误,请求方法未允许!";
      break;
    case 408:
      errMessage = "网络请求超时";
      break;
    case 500:
      errMessage = "服务器错误,请联系管理员!";
      break;
    case 501:
      errMessage = "网络未实现!";
      break;
    case 502:
      errMessage = "网络错误!";
      break;
    case 503:
      errMessage = "服务不可用，服务器暂时过载或维护!";
      break;
    case 504:
      errMessage = "网络超时!";
      break;
    case 505:
      errMessage = "http版本不支持该请求!";
      break;
    default:
  }

  if (errMessage) {
    uni.showModal({
      title: '提示',
      content: `${errMessage}`,
      showCancel: false,
      confirmColor: alertConfirmBtnColor,
    });
    // uni.hideLoading();
    throw `提示|错误代码:${res.code}|错误信息:${res.msg}`;
  }
};

const http = {
  get(url: string = "", options: getOptions = {}): Promise<serverResponse> {
    options = httpBefore(<requestOptions>options);
    return new Promise((resolve, reject) => {
      loading();
      uni.request({
        url: `${config.baseURL}${url}`,
        method: "GET",
        data: {
          ...(options.params || {}),
        },
        header: {
          ...options.header,
        },
        success: async function (res) {
          try {
            const rs = await httpAfter(res);
            // hideLoading();
            resolve(rs);
          } catch (err) {
            // hideLoading();
            reject(err);
          }
        },
        fail(err) {
          // hideLoading();
          reject(err);
        },
        complete() {
          uni.hideLoading();
        }
      });
    });
  },
  post(
    url: string = "",
    data: object = {},
    options: postOptions = {}
  ): Promise<serverResponse> {
    options = httpBefore(<requestOptions>options);
    const URL = `${config.baseURL}${url}`;
    return new Promise((resolve, reject) => {
      loading();
      uni.request({
        url: URL,
        method: "POST",
        data: {
          ...options.params,
          ...data,
          ...options.data,
        },
        header: {
          ...options.header,
        },
        success: async function (res) {
          try {
            const rs = await httpAfter(res);
            // hideLoading();
            resolve(rs);
          } catch (err) {
            reject(err);
          }
        },
        fail(err) {
          // hideLoading();
          reject(err);
        },
        complete() {
          uni.hideLoading();
        }
      });
    });
  },

  put(
    url: string = "",
    data: object = {},
    options: postOptions = {}
  ): Promise<serverResponse> {
    options = httpBefore(<requestOptions>options);

    let queryString = qs.stringify(options.params || {});
    let URL = `${config.baseURL}${url || options.url}`;
    if (queryString) {
      URL = `${config.baseURL}${url || options.url}?${queryString}`;
    }
    return new Promise((resolve, reject) => {
      loading();
      uni.request({
        url: URL,
        method: "PUT",
        data: {
          ...options.params,
          ...data,
          ...options.data,
        },
        header: {
          ...options.header,
        },
        success: async function (res) {
          try {
            const rs = await httpAfter(res);
            // hideLoading();/
            resolve(rs);
          } catch (err) {
            reject(err);
          }
        },
        fail(err) {
          // hideLoading();/
          reject(err);
        },
        complete() {
          uni.hideLoading();
        }
      });
    });
  },


  delete(url: string = "", options: getOptions = {}): Promise<serverResponse> {
    options = httpBefore(<requestOptions>options);
    return new Promise((resolve, reject) => {
      loading();
      uni.request({
        url: `${config.baseURL}${url || options.url}`,
        method: "DELETE",
        data: {
          ...(options.params || {}),
        },
        header: {
          ...options.header,
        },
        success: async function (res) {
          try {
            const rs = await httpAfter(res);
            // hideLoading();
            resolve(rs);
          } catch (err) {
            // hideLoading();
            reject(err);
          }
        },
        fail(err) {
          // hideLoading();
          reject(err);
        },
        complete() {
          uni.hideLoading();
        }
      });
    });
  },

  request(options: requestOptions): Promise<serverResponse> {
    options = httpBefore(options);
    let queryString: string = qs.stringify(options.params);
    let URL = `${config.baseURL}${options.url || options.url}`;
    if (queryString) {
      URL = `${config.baseURL}${options.url || options.url}?${queryString}`;
    }
    return new Promise((resolve, reject) => {
      loading();
      uni.request({
        url: URL,
        method: options.method,
        data: {
          ...options.params,
          ...options.data,
        },
        header: {
          ...options.header,
        },
        success: async function (res) {
          try {
            const rs = await httpAfter(res);
            // hideLoading();
            resolve(rs);
          } catch (err) {
            reject(err);
          }
        },
        fail(err) {
          // hideLoading();
          reject(err);
        },
        complete() {
          uni.hideLoading();
        }
      });
    });
  },
};

export { http };
