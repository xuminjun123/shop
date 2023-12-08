<!--
 * @Description: 个人版 编辑收货地址
 * @Author: xmj
 * @Date: 2022-09-13 14:24:23
-->
<template>
  <view>
    <view class="w-11/12 mx-auto mt-2">
      <uni-forms
        :modelValue="formData"
        label-position="left"
        :label-width="100"
        :rules="rules"
        ref="form"
      >
        <forms-item label="收货人" name="user_name" required>
          <uni-easyinput
            v-model="formData.user_name"
            placeholder="请输入收货人"
          >
          </uni-easyinput>
        </forms-item>
        <forms-item label="手机" name="user_phone" required>
          <view class="flex items-center justify-between">
            <uni-easyinput
              v-model="formData.user_phone"
              type="tel"
              placeholder="请输入手机"
            >
            </uni-easyinput>
            <tm-button
              :margin="[0]"
              size="small"
              :shadow="0"
              openType="getPhoneNumber"
              label="获取手机号"
              color="baseColor"
              @getphonenumber="getPhoneNumberCode"
            ></tm-button>
          </view>
        </forms-item>
        <forms-item label="区域" name="region" required>
          <uni-data-picker
            placeholder="请选择省市"
            popup-title="请选择省市"
            :localdata="arerJSON"
            v-model="formData.region"
            @change="change"
          >
          </uni-data-picker>
        </forms-item>
        <forms-item label="详细地址" name="detail" required>
          <uni-easyinput
            v-model="formData.detail"
            type="textarea"
            placeholder="请输入详细地址"
          >
          </uni-easyinput>
        </forms-item>
        <view class="mx-auto my-4">
          <tm-button
            class=""
            block
            color="baseColor"
            @click="sumbit"
            label="保存"
          ></tm-button>
        </view>
      </uni-forms>

      <view class="text-sm">
        为完成配送，我们将手机您提供的姓名、电话和收货地址信息；并且，
        我们可能会根据您提供的收货地址所在的省市，展示相应的页面内容。
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import FormsItem from "@/uni-ui/uni-forms/components/uni-forms-item/uni-forms-item.vue";
import uniDataPicker from "@/uni-ui/uni-data-picker/components/uni-data-picker/uni-data-picker.vue";
import { isPhone } from "@/tmui/tool/function/util";
import { onLoad, onReady } from "@dcloudio/uni-app";
import arerJSON from "@/static/JSON/area.json";
import { showToast } from "@/utils/toast";
import { http } from "@/utils/http";
import { useUserStore } from "@/store/modules/user";

// 获取手机号
const getPhoneNumberCode = async (e: any) => {
  const code = e.detail.code;
  const res: any = await http.post("Users/getUserPhoneNumber", {
    openid: openid.value,
    code,
  });
  formData.user_phone = res.phone_info.phoneNumber;
};

const formData = reactive<any>({
  user_name: null,
  user_phone: null,
  region: null,
  detail: null,
  postCode: null,
  userId: null,
});
const rules = {
  user_name: {
    rules: [
      {
        required: true,
        errorMessage: "请输入收货人",
      },
    ],
  },

  user_phone: {
    rules: [
      {
        required: true,
        errorMessage: "请输入手机",
      },
      {
        validateFunction: function (rule, value, data, callback) {
          // /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
          if (!isPhone(value)) {
            callback("请输入正确的手机号");
          }
          return true;
        },
      },
    ],
  },
  region: {
    rules: [
      {
        required: true,
        errorMessage: "请输入区域",
      },
    ],
  },
  detail: {
    rules: [
      {
        required: true,
        errorMessage: "请输入详细地址",
      },
    ],
  },
};
const form = ref<HTMLDivElement | null>(null);
const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});
const sumbit = () => {
  (form.value as any).validate().then((res: any) => {
    http
      .post(`Small/shoppingAddressEdit`, {
        ...res,
        region: addressArea.value,
        id: Number(id.value),
        openid: openid.value,
      })
      .then((res) => {
        showToast(res.message);
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1200);
      });
  });
};
const addressArea = ref("");
const change = (e: any) => {
  const value = e.detail.value;
  if (value.length == 3) {
    addressArea.value =
      value[0].text + "/" + value[1].text + "/" + value[2].text;
  } else {
    addressArea.value = value[0].text + "/" + value[1].text;
  }
};

const id = ref(0);
onLoad((options: any) => {
  id.value = Number(options.id);
});
</script>
<style lang="scss" scoped>
.addAddress-continer {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
