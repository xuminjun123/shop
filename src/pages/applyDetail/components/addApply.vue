<!--
 * @Description: 参加预约
   先查看有无预约信息
    有: info 组件
    无: 新增预约
 * @Author: xmj
 * @Date: 2023-04-12 14:57:26
-->
<template>
  <view>
    <view class="w-11/12 mx-auto mt-2"> </view>
    <view class="w-11/12 mx-auto bg-white">
      <view class="p-2 form-item">
        <text> 姓名: </text>
        <input
          class="mt-1 uni-input"
          placeholder="请输入"
          focus
          v-model="formData.user_name"
        />
      </view>

      <view class="p-2 form-item">
        <view class="">
          <view> 手机号码: </view>
        </view>
        <view class="flex justify-between mt-1">
          <input placeholder="请输入" v-model="formData.user_phone" />
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
      </view>

      <view class="p-2">
        <view> 日期时间: </view>
      </view>
    </view>
    <SelectDate
      :activeId="activeId"
      @sendSelectDate="sendSelectDate"
      @sendSelectTime="sendSelectTime"
      @sendSelectCount="sendSelectCount"
    ></SelectDate>

    <view class="flex justify-between w-11/12 pb-5 mx-auto">
      <view class="flex-1 mr-2">
        <tm-button
          :shadow="0"
          text
          form-type="reset"
          label="取消"
          block
          color="baseColor"
          @click="resetApply"
        >
        </tm-button>
      </view>
      <view class="flex-1">
        <!-- <tm-button form-type="submit" label="新增预约" block color="baseColor" @click="submit" :disabled="disabled">
				</tm-button> -->
        <tm-button
          form-type="submit"
          label="新增预约"
          block
          color="baseColor"
          @click="vote"
        >
        </tm-button>
      </view>
    </view>
  </view>

  <!-- 消息提示 -->
  <tm-notification
    :placement="placement"
    ref="msg"
    label="提示"
    icon="tmicon-info-circle"
  ></tm-notification>
  <uni-popup ref="popupCoupon" background-color="#fff" type="bottom">
    <view class="popup_content">
      <uni-section title="门票类型" type="line">
        <view class="example-body">
          <view class="tag_view">
            <uni-tag
              v-if="
                priceInfo.value.single !== '0' && priceInfo.value.single !== ''
              "
              :disabled="selectCount == 0"
              :inverted="selected == 0 ? false : true"
              text="单人票"
              type="success"
              @click="favClick(0)"
              class="mar_right"
            />
            <uni-tag
              v-if="
                priceInfo.value.family !== '0' && priceInfo.value.family !== ''
              "
              :disabled="selectCount < 2"
              :inverted="selected == 1 ? false : true"
              text="家庭票"
              type="success"
              @click="favClick(1)"
              class="mar_right"
            />
            <uni-tag
              v-if="
                priceInfo.value.group !== '0' && priceInfo.value.group !== ''
              "
              :disabled="selectCount < 5"
              :inverted="selected == 2 ? false : true"
              text="团队票"
              type="success"
              @click="favClick(2)"
            />
          </view>
        </view>
      </uni-section>
      <uni-section title="请选择人数" type="line" v-if="selected == 2">
        <view class="tag_view">
          <template v-for="(item, index) of selectCount" :key="item">
            <uni-tag
              class="mar_right"
              :key="item"
              :inverted="peopleNum == item ? false : true"
              v-if="item >= 2"
              :text="item"
              type="success"
              @click="selectPeopleNum(item)"
            />
          </template>
        </view>
      </uni-section>
      <uni-section title="总价(元)" type="line">
        <view class="h1_title">
          {{ price }}
        </view>
      </uni-section>
    </view>
    <!-- <button type="success" @click="payment">确认提交</button> -->
    <tm-button
      :disabled="selectCount == 0"
      form-type="submit"
      label="新增预约"
      block
      color="baseColor"
      @click="payment"
    >
    </tm-button>
  </uni-popup>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { http } from "@/utils/http";
import tmButton from "@/tmui/components/tm-button/tm-button.vue";
import tmNotification from "@/tmui/components/tm-notification/tm-notification.vue";
import { isPhone } from "@/utils/is";
import { useUserStore } from "@/store/modules/user";
import { showToast } from "@/utils/toast";
import SelectDate from "./selectDate.vue";

const props = defineProps({
  activeId: {
    type: String,
    default: "",
  },
  // 余票数量
  applyCount: {
    type: Number,
    default: 0,
  },
  //预约类型 0 免费 1收费
  applyType: {
    type: Number,
    default: 0,
  },
  //门票价格
  pricedata: {
    type: Object,
    default: {},
  },
});
const popupCoupon = ref(null);
const selected = ref(0);
const peopleNum = ref(2);
const applyNum = ref(0);
const applysType = ref(0);
const priceInfo = reactive({
  family: "",
  group: "",
  single: "",
});
const price = ref(0);
const userStore = useUserStore();
const msg = ref<InstanceType<typeof tmNotification> | null>(null);
const placement = ref("top");
const formData = reactive({
  user_name: "",
  user_phone: "",
});

const code = ref(4); // 0: 无预约 1显示预约数据 2:管理员 显示扫码框
// 预约信息
const info = reactive({
  id: 0, // 唯一id
  openid: "",
  qrcode: "", //生成二维码
  applytime: "",
});

// code == 1; 预约数据
interface IData {
  id: number;
  title: string;
  img: string;
  state: string;
}
const applyDataList = ref<IData[]>([]);

// 获取手机号
const openid = userStore.openId;
const getPhoneNumberCode = async (e: any) => {
  const code = e.detail.code;
  const res: any = await http.post("Users/getUserPhoneNumber", {
    openid,
    code,
  });
  formData.user_phone = res.phone_info.phoneNumber;
  userStore.setPhoneNumber(res.phone_info.phoneNumber);
};

const selectDate = ref("");
const selectTime = ref("");
const selectCount = ref(0);
const sendSelectDate = (e: any) => {
  console.log("日期------>>", e);

  selectDate.value = e;
};
const sendSelectTime = (e: any) => {
  selectTime.value = e;
};
const sendSelectCount = (e: any) => {
  selectCount.value = e;
};

const disabled = computed(() => {
  if (!formData.user_name) {
    return true;
  }
  if (!formData.user_phone) {
    return true;
  }
  if (!selectTime.value) {
    return true;
  }
  if (!selectDate.value) {
    return true;
  }
  return false;
});

// 提交表单
const submit = async (nonceStr: String) => {
  const _selectDate = selectDate.value.replace(/-/g, "/");

  const applytime = `${_selectDate} ${selectTime.value}:00`;

  const dateTime = new Date(applytime).getTime();
  const openid = userStore.openId;
  console.log("applytime-->>", applytime);
  const info = await setNumType();
  console.log("submit-->>>>", {
    id: props.activeId,
    openid,
    user_name: formData.user_name,
    user_phone: formData.user_phone,
    applytime: dateTime / 1000,
    applytype: info.applyType,
    peoplenum: info.peoplenum,
  });
  const res: any = await http.post("Appointment/userAppointmentAdd", {
    id: props.activeId,
    openid,
    user_name: formData.user_name,
    user_phone: formData.user_phone,
    applytime: dateTime / 1000,
    applytype: info.applyType,
    peoplenum: info.peoplenum,
    nonceStr: info.applyType == "free" ? "" : nonceStr,
  });

  showToast(res.message);
  // 返回 活动列表
  if (res.code == 1) {
    setTimeout(() => {
      uni.switchTab({
        url: "/pages/applyActive/index",
      });
    }, 1200);
  }
};

// 取消
const resetApply = () => {
  uni.navigateBack({
    delta: 1,
  });
};

// 获取预约信息
async function getApplyData() {
  const userStore = useUserStore();
  const res = await http.get("Appointment/userAppointment", {
    params: {
      openid: userStore.getOpenId,
    },
  });
  code.value = res.code;

  switch (code.value) {
    case 0:
      // 显示新增预约界面
      break;
    case 1:
      // 显示预约列表
      applyDataList.value = res.data;
      break;
    case 2:
      // 管理员 显示扫码框
      break;
  }
}

// 跳转到预约详情
const navApplyDetil = (id: number) => {
  uni.navigateTo({
    url: `/pages/applyDetail/index?id=${id}`,
  });
};

// 弹出门票选择框
const vote = async () => {
  /* if(selectCount.value ==0)	{
			nextTick(() => {
				msg.value?.show({
					label: "暂无余票"
				});
			});
			return;
		} */
  if (!formData.user_name) {
    nextTick(() => {
      msg.value?.show({
        label: "请输入姓名",
      });
    });
    return;
  }
  if (!formData.user_phone) {
    nextTick(() => {
      msg.value?.show({
        label: "请输入手机号",
      });
    });
    return;
  }

  if (!isPhone(formData.user_phone)) {
    nextTick(() => {
      msg.value?.show({
        label: "请输入正确的手机号",
      });
    });
    return;
  }

  if (!selectTime.value) {
    msg.value?.show({
      label: "请选择入馆时间",
    });
    return;
  }
  if (applysType.value == 1) {
    selected.value = 0;
    price.value = priceInfo.value.single;
    popupCoupon.value.open();
  } else {
    submit();
  }
};
// 选中票型
const favClick = (id: Number) => {
  selected.value = id;
  if (id == 0) {
    price.value = priceInfo.value.single;
  } else if (id == 1) {
    price.value = parseFloat(priceInfo.value.family) * 1;
  } else if (id == 2) {
    price.value = parseFloat(priceInfo.value.group) * parseInt(peopleNum.value);
  }
};
//如果是团购票，选择团购人数
const selectPeopleNum = (index: Number) => {
  peopleNum.value = index;
  if (selected.value == 2) {
    price.value = parseFloat(priceInfo.value.group) * parseInt(peopleNum.value);
  }
};

// 发起支付
const payment = async () => {
  const info = await setNumType();
  if (price.value == 0 || !price.value) {
    return false;
  }
  let params = {
    openid: userStore.openId,
    appointmentid: props.activeId,
    applytype: info.applyType,
    peoplenum: info.peoplenum,
    totalprice: parseFloat(price.value),
  };
  const res: any = await http.post("Order/wxAppointmentPay", params);
  console.log(res.payData, "res");
  let payData = res?.payData || {};
  wx.requestPayment({
    timeStamp: payData.timeStamp + "", //后端返回的时间戳
    nonceStr: payData.nonceStr, //后端返回的随机字符串
    package: payData.package, //后端返回的prepay_id
    signType: payData.signType, //后端签名算法,根据后端来,后端MD5这里即为MD5
    paySign: payData.paySign, //后端返回的签名
    success(res) {
      console.log("用户支付扣款成功", res);
      msg.value?.show({
        label: "支付成功",
      });
      submit(payData.nonceStr);
    },
    fail(res) {
      msg.value?.show({
        label: "支付失败",
      });
      console.log("用户支付扣款失败", res);
    },
  });
};
//设置选择票的类型与数量
const setNumType = async () => {
  const applyType = ref("");
  const peoplenum = ref(0);
  if (applysType.value == 0) {
    applyType.value = "free";
  } else {
    if (selected.value == 0) {
      applyType.value = "single";
    } else if (selected.value == 1) {
      applyType.value = "family";
    } else if (selected.value == 2) {
      applyType.value = "group";
    }
  }
  if (applysType.value == 0) {
    peoplenum.value = 1;
  } else {
    if (selected.value == 0) {
      peoplenum.value = 1;
    } else if (selected.value == 1) {
      peoplenum.value = 2;
    } else if (selected.value == 2) {
      peoplenum.value = peopleNum.value;
    }
  }
  return {
    peoplenum: peoplenum.value,
    applyType: applyType.value,
  };
};
watch(
  props,
  (newProps) => {
    applyNum.value = parseInt(newProps.applyCount);
    applysType.value = parseInt(newProps.applyType);
    priceInfo.value = newProps.pricedata.value;
    console.log(newProps.pricedata.value, "pricedata");
    price.value = priceInfo?.value?.single;
  },
  {
    immediate: true,
    deep: true,
  }
);
onMounted(() => {
  getApplyData();
});
</script>
<style lang="scss" scoped>
.form-item {
  border-bottom: 1rpx #ccc solid;
}

.bor {
  border: 1px solid #095b2b;
  background-color: white;
  border-radius: 8rpx;
}

.popup_content {
  min-height: 400rpx;
  padding-left: 32rpx;
}

.pad_l_r {
  padding: 20rpx 32rpx;
}

.tag_view {
  display: flex;
  align-items: center;
}

.mar_right {
  margin-right: 20rpx;
}

.uni-tag--success {
  background-color: rgba(9, 93, 44, 1) !important;
}

.h1_title {
  font-size: 45rpx;
  font-weight: 600;
  text-align: center;
  color: red;
}
</style>
