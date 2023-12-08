<!--
 * @Author: xmj
 * @Date: 2022-06-16 16:33:43
-->
<template>

  <view class="wrapper">
    <view class="w-11/12 mx-auto mt-2 mb-4">
      <view class="py-4 title">
        登录
      </view>
      <view class="my-2">
        <tm-button block color="logoutColor" @click="wxLogin" label="微信一键登录"></tm-button>
      </view>

      <view>
        <checkbox-group @change="changeCheck">
          <label>
            <checkbox :checked="checked" />
            <text class="text-sm">
              我已阅读并同意
            </text>
            <text class="text-sm font-bold"> 《谷德维斯注册协议》 </text>
            和
          </label>
        </checkbox-group>
      </view>
      <view class="text-sm font-bold"> 《谷德维斯隐私政策》。 </view>
    </view>

    <tui-modal :show="show" custom>
      <view class="tui-modal-custom">
        <view class="flex items-center justify-center">
          <tui-icon name="about-fill" size="50" color="#007aff"></tui-icon>
        </view>
        <view class="py-3 text-center tui-modal-custom-text">为了更方便使用小程序，我们需要您的获取手机号登录</view>
        <tui-button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" height="72rpx" :size="28" type="primary"
          shape="circle">确定</tui-button>
      </view>
    </tui-modal>


  </view>
</template>
<script lang="ts" setup>
// import { propTypes } from "@/utils/propTypes";
import { ref } from "vue";
import tmButton from "@/tmui/components/tm-button/tm-button.vue";
import { showToast } from "@/utils/toast";
import { onShow } from "@dcloudio/uni-app";
// defineProps({
//   value: propTypes.string.def(""),
// });

import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";
import { getToken, setToken } from "@/utils/auth/token";
function bindPhone(params: any) {
  http.get(`/wxMini/bindMobile`, {
    params: {
      ...params,
    },
  }).then((res) => {
    if (res.code == 200) {
      setToken(res.data.token)
      show.value = false;
      showToast('登录成功');
      userStore.setUserInfo(res.data.user)
      if (res.data.user?.companyId) {
        uni.reLaunch({
          url: '/pages/choose/index'
        })
      } else {
        // 跳转到选择页面
        uni.reLaunch({
          url: '/pagesUser/index/index'
        })
      }
    }
  })
}

const show = ref(false);
const userStore = useUserStore();
let bindPhoneParams = {};
const wxLogin = async () => {
  const token = userStore.getToken;
  userStore.setAuthInfo().then((res: any) => {
    bindPhoneParams = {
      openid: userStore.getOpenId,
      sessionKey: userStore.getSessionKey,
      signature: res.signature,
      rawData: res.rawData,
      encryptedData: res.encryptedData,
      iv: res.iv
    }
    if (token) {
      uni.reLaunch({
        url: "/pages/choose/index"
      });
      return
    }
    show.value = true;
  })

};

const getPhoneNumber = async (e: any) => {
  if (e.errMsg == "getPhoneNumber:ok") {
    let payload = {
      encryptedData: e.encryptedData,
      iv: e.iv,
      openid: userStore.getOpenId,
      sessionKey: userStore.getSessionKey,
      signature: bindPhoneParams.signature,
      rawData: bindPhoneParams.rawData,
    };

    bindPhone(payload);
  } else {
    console.log("用户点击了拒绝");
  }
};

const checked = ref(false);
function changeCheck() {
  checked.value = !checked.value;
}

onShow(() => {
  if (getToken()) {
    uni.reLaunch({
      url: "/pages/choose/index"
    });
  }
});
</script>
