<!--
 * @Description: 单个订单详情 
 * @Author: xmj
 * @Date: 2022-09-08 19:08:46
-->
<template>
  <view class="p-2 wrapper">
    <view class="w-11/12 py-3 mx-auto text-xl font-bold">
      <view> 订单详情</view>
    </view>

    <view class="w-full py-2 bg-white rounded-md">
      <view class="flex justify-between p-3 mx-auto bg-white order-cell">
        <view class="w-[55rpx] flex justify-center items-center">
          <img :src="addressSrc" mode="widthFix" />
        </view>
        <view class="flex-1">
          <view class="pb-1 pl-2 text-md">
            {{ goodsDetail.user_address }}
          </view>
          <view class="pl-2">
            <text class="text-sm text-gray-600">
              {{ goodsDetail.user_name }}
            </text>
            <text class="pl-2 text-sm text-gray-600">
              {{ goodsDetail.user_phone }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="w-full pb-2 my-3 bg-white">
      <view class="w-11/12 pt-2 mx-auto text-xl font-bold">
        <view> 商品信息 </view>
      </view>

      <view
        class="mt-2 bg-white order-cell"
        v-for="item in JSON.parse(goodsDetail.orderinfo)"
        :key="item.id"
      >
        <view class="flex w-full p-3">
          <view class="w-[200rpx] h-[250rpx]">
            <img :src="item.productimg" alt="" srcset="" />
          </view>
          <view class="flex flex-col justify-between w-2/3 ml-6">
            <view class="flex justify-between w-full">
              <view>
                <view class="text-sm">{{ item.producttitle }}</view>
              </view>

              <view class="text-red-500 text-md"
                >￥{{ item.preferentialprice }}</view
              >
            </view>

            <view
              class="flex items-center justify-between text-xs bg-light-100"
            >
              <view class="text-sm">购买数量</view>
              <view> x{{ item.num }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- v-if="goodsDetail.refunded == 1 && goodsDetail.state == '待收货'" -->
      <view class="flex w-full flex-end">
        <view class="flex text-sm text-gray-500">
          <button
            class="mr-1 text-sm text-gray-500 btn"
            @click="lookLogistics"
            v-if="goodsDetail.state == '待收货'"
          >
            查看物流
          </button>
          <button
            class="text-sm text-gray-500 btn"
            @click="outGoodsPay()"
            v-if="goodsDetail.refunded == 1 && goodsDetail.state == '待收货'"
          >
            退款或退货
          </button>
          <button
            class="ml-2 mr-1 text-sm text-gray-500 btn saveGoods"
            @click="saveGoods"
            v-if="goodsDetail.state == '待收货'"
          >
            确认收货
          </button>
        </view>
      </view>

      <view class="flex w-full flex-end" v-if="goodsDetail.state == '待发货'">
        <view class="flex text-sm text-gray-500">
         <!-- <button class="text-sm text-gray-500 btn" @click="outPay">
            申请退款
          </button> -->
        </view>
      </view>
    </view>

    <view class="w-full pb-4 my-3 bg-white">
      <view class="flex justify-between w-11/12 py-2 mx-auto border-b-1">
        <view> 订单编号: </view>
        <view class="text-sm">{{ goodsDetail.orderid }} </view>
      </view>

      <view class="flex justify-between w-11/12 py-2 mx-auto border-b-1">
        <view> 订单状态: </view>
        <view class="text-sm">{{ goodsDetail.state }} </view>
      </view>

      <view class="flex justify-between w-11/12 py-2 mx-auto border-b-1">
        <view> 订单生成时间: </view>
        <view class="text-sm">{{ goodsDetail.addtime }} </view>
      </view>

      <view
        class="flex justify-between w-11/12 py-2 mx-auto border-b-1"
        v-if="goodsDetail.sendtime"
      >
        <view> 发货时间 </view>
        <view class="text-sm">{{ goodsDetail.sendtime }} </view>
      </view>

      <view
        class="flex justify-between w-11/12 py-2 mx-auto border-b-1"
        v-if="goodsDetail.trackingnumber_send"
      >
        <view> 运单号 </view>
        <view class="text-sm">{{ goodsDetail.trackingnumber_send }} </view>
      </view>

      <view
        class="flex justify-between w-11/12 py-2 mx-auto border-b-1"
        v-if="goodsDetail.trackingnumber_back"
      >
        <view> 退货订单号 </view>
        <view class="text-sm">{{ goodsDetail.trackingnumber_back }} </view>
      </view>

      <view
        class="flex justify-between w-11/12 py-2 mx-auto border-b-1"
        v-if="goodsDetail.backtime"
      >
        <view> 申请退货时间 </view>
        <view class="text-sm">{{ goodsDetail.backtime }} </view>
      </view>

      <view
        class="flex justify-between w-11/12 py-2 mx-auto border-b-1"
        v-if="goodsDetail.endtime"
      >
        <view> 订单完成时间 </view>
        <view class="text-sm">{{ goodsDetail.endtime }} </view>
      </view>

      <view class="w-11/12 mx-auto border-b-1">
        <view class="flex justify-between py-2 text-md">
          <view> 商品金额 </view>
          <view> ¥{{ goodsDetail.product_price }} </view>
        </view>
        <view class="flex justify-between py-1">
          <view> 运费 </view>
          <view class="tetx-red-500"> ¥{{ goodsDetail.freight_price }} </view>
        </view>
      </view>

      <view class="flex justify-between w-11/12 py-2 mx-auto border-b-1">
        <view> 订单总额 </view>
        <view class="text-sm text-red-400"
          >¥{{ goodsDetail.total_price }}
        </view>
      </view>
    </view>
  </view>

  <uni-popup ref="popup" background-color="#fff" popupstyle="popupstyle">
    <view class="w-full p-3 popup-content">
      <view class="pt-3">
        <view>邮寄地址</view>
      </view>
      <view class="pt-3">
        <view class="flex-1">
          <view class="pb-1 pl-2 text-md">
            地址: {{ messageAddress.user_address }}
          </view>
          <view class="pl-2">
            <text class="text-sm text-gray-600">
              姓名: {{ messageAddress.user_name }}
            </text>
            <text class="pl-2 text-sm text-gray-600">
              手机号: {{ messageAddress.user_phone }}
            </text>
          </view>
        </view>
      </view>

      <view class="p-3">
        <tm-input
          :border="2"
          :followTheme="false"
          focusColor="white"
          color="white"
          fontColor="black"
          placeholder="请输入快递单号"
          v-model="trackingnumber_back"
        ></tm-input>
      </view>

      <view class="pb-8 mx-auto">
        <tm-button
          block
          :disabled="trackingnumber_back ? false : false"
          color="logoutColor"
          @click="onOK"
          label="确定"
        ></tm-button>
      </view>
    </view>
  </uni-popup>
</template>
<script lang="ts" setup>
import { http } from "@/utils/http";
import { onLoad, onReady } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import addressSrc from "@/assets/address.png";
import { showModal, showToast } from "@/utils/toast";
let goodsDetail = ref<any>({});
const popup = ref(null);
const trackingnumber_back = ref("");
// 退款
const outPay = () => {
  showModal("是否确定退款？", () => {
    http
      .post(`Order/orderRefunded`, {
        orderid: goodsDetail.value.orderid,
        type: 1,
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

// 邮寄信息
const messageAddress = reactive({
  user_address: "",
  user_name: "",
  user_phone: "",
});

// 申请退货退款
const outGoodsPay = () => {
  http.post("Order/orderRefundedInfo").then((res: any) => {
    if (res.code == 1) {
      messageAddress.user_address = res.message.user_address;
      messageAddress.user_name = res.message.user_name;
      messageAddress.user_phone = res.message.user_phone;
    }
    (popup.value as any).open("bottom");
  });
};

// 确认收货
const saveGoods = () => {
  showModal("是否确认收货？", () => {
    http
      .post(`Order/orderCompleted`, {
        orderid: goodsDetail.value.orderid,
      })
      .then((res) => {
        showToast("确认成功");
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1200);
      });
  });
};

// 确认申请退货退款
const onOK = () => {
  if (!trackingnumber_back.value) {
    showToast("请输入退货运单号");
    return;
  }

  http
    .post(`Order/orderRefunded`, {
      orderid: goodsDetail.value.orderid,
      type: 2,
      trackingnumber_back: trackingnumber_back.value,
    })
    .then((res) => {
      (popup.value as any).close();
      showToast(res.message);
      setTimeout(() => {
        uni.switchTab({
          url: "/pages/mine/index",
        });
      }, 1200);
    });
};

// 查看物流信息
const lookLogistics = () => {
  uni.navigateTo({
    url: `plugin://kdPlugin/index?num=${goodsDetail.value.trackingnumber_send}&appName=快递跟踪`,
  });
};

onLoad((options: any) => {
  goodsDetail.value = JSON.parse(options.order);
});
</script>
<style lang="scss" scoped>
.wrapper {
  padding-bottom: 50rpx;
}
.order-cell {
  border-radius: 20rpx;
}

.btn {
  margin-top: 25rpx;
  padding: 10rpx 25rpx;
  font-size: 30rpx;
  background-color: white;
  border-radius: 35rpx;
  border: 1rpx solid #ccc;
}
.saveGoods {
  color: #095b2b;
  border: 1rpx solid #095b2b;
}
:deep(.uni-popup__wrapper .bottom) {
  border-radius: 30rpx !important;
}
.popup-content {
  overflow: hidden;
}
:deep(.py-10) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
