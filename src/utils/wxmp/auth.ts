import { showToast } from '../toast';


/**
 * 
 * @returns 获取微信code
 */
export function getAuthCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: function (loginRes) {
        resolve(loginRes.code)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

/**
 * 
 * @returns 获取用户头像，昵称，地区及性别
 */
export function getUserProfile(): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: "获取用户相关信息",
      success: function (infoRes) {
        console.log('infoRes->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', infoRes);

        if (infoRes.errMsg === 'getUserProfile:ok') {

          console.log('获取用户相关信息------->>>.', infoRes);


          resolve(infoRes);
          // showToast('授权成功')
        } else {
          uni.showToast({
            title: '授权失败！',
            icon: 'error'
          });
          reject(infoRes);
        }
      },
      fail: function (err) {
        console.log('err-->>', err);

        showToast('授权失败')
      }
    })
  })
}
/**
 * 
 * @returns 检测小程序更新
 */
export function checkUpdateVersion(): void {
  //新版本更新
  if (uni.canIUse('getUpdateManager')) {
    //判断当前微信版本是否支持版本更新
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        // 请求完新版本信息的回调
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: '更新提示',
            content: '已更新版本，是否重启小程序？',
            showCancel: false,
            cancelColor: '#eeeeee',
            confirmColor: '#40A2ED',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });
        // 新的版本下载失败
        updateManager.onUpdateFailed(function () {
          uni.showModal({
            title: '更新失败',
            content: '请检查网络设置，若仍更新失败，重新搜索打开',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
  } else {
    uni.showModal({
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
    });
  }
}
/**
 * 
 * @returns 打开其他的小程序
 */
export function navigateToMiniProgram(appId: string, path: string, extraData?: any): void {
  uni.navigateToMiniProgram({
    appId: appId,
    path: path,
    extraData: extraData,
    success(res) {
      // 打开成功
    },
  });
}

/**
 * @params tempId: string; 模板ID
 * @returns  订阅消息
 */
export function requestSubscribeMessage(tempId: string) {
  return new Promise((resolve, reject): void => {
    uni.requestSubscribeMessage({
      tmplIds: [tempId],
      success: (res: any): void => {
        console.log(res);
        if (res[tempId] == "accept") {
          uni.setStorageSync("acceptSubscribeMessage", true);
          resolve(res);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: (res) => {
        // console.log("我被点了");
      },
    });
  })
}



/**
 * @params current: string; 模板ID; urls: 需要预览的图片链接列表
 * @returns  图片预览 单张
 */
export function previewImage(url: string[]) {
  return uni.previewImage({
    current: 0,
    urls: url,
  })
}

/**
 * @params data: string; 
 * @returns  内容复制到粘贴板
 */
export function setClipboardData(data: string) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data, //要被复制的内容
      success: () => { //复制成功的回调函数
        uni.showToast({ //提示
          title: '复制成功'
        })
      }
    });
  })
}


/**
 * 从本地相册选择图片或使用相机拍照。
 * @params count:最多可以选择的图片张数
 */
export function chooseImage(count: number = 1) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType: ['original', 'compressed'],//original 原图，compressed 压缩图，
      sourceType: ['camera', 'album'],// album 从相册选图，camera 使用相机
      success: (res) => {
        // const { tempFilePaths, tempFiles } = res;
        //获取图片的数据插入到upload中
        resolve(res);
      },
      fail: (err) => {
        uni.getSetting({
          success: (res) => {
            let authStatus = res.authSetting['scope.camera'];
            if (!authStatus) {
              uni.showModal({
                title: '授权失败',
                content: '需要从您的相机获取图片，请在设置界面打开相关权限',
                success: (res) => {
                  if (res.confirm) {
                    // scope.camera
                    uni.openSetting({
                      success: (res) => {
                        // res.authStatus['scope.camera']
                      }
                    })
                  }
                }
              })
            }
          },
        })
      }
    })
  })
}