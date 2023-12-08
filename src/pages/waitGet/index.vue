<!--
 * @Description:  所有订单
 * @Author: xmj
 * @Date: 2023-04-15 10:11:46
-->
<template>
  <view class="pb-10 wrapper">
    <view class="flex flex-col w-full p-2">
      <template v-if="list.length > 0">
        <view class="w-full">
          <view
            class="p-2 mb-2 bg-white order-cell"
            v-for="order in list"
            :key="order.id"
            @click="navOrderDetailById(order)"
          >
            <view class="flex justify-between">
              <view class="flex">
                <view class="text-sm">订单号:</view>
                <view class="text-sm">{{ order.orderid }}</view>
              </view>
              <view class="text-sm">{{ order.state }}</view>
            </view>

            <!-- 订单 -->
            <view
              class="mt-2"
              v-for="item in JSON.parse(order.orderinfo)"
              :key="item.id"
            >
              <view class="flex">
                <view class="w-1/3 h-[240rpx]">
                  <img :src="item.productimg" />
                </view>
                <view class="w-2/3">
                  <view class="flex justify-between pl-2">
                    <view>{{ item.producttitle }}</view>
                    <view class="text-red-500"
                      >¥{{ item.preferentialprice }}</view
                    >
                  </view>
                  <view class="flex justify-between pt-2 pl-2">
                    <view class="text-sm text-gray-400">数量</view>
                    <view class="text-sm text-gray-400">x{{ item.num }}</view>
                  </view>
                </view>
              </view>
            </view>

            <view class="flex w-full flex-end">
              <view class="text-sm text-gray-500"> 含运费 </view>
              <view class="pl-2">实付款 ¥ {{ order.total_price }} </view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="w-11/12 h-full mx-auto">
          <img
            src="https://cdn.uviewui.com/uview/empty/order.png"
            mode="widthFix"
          />
          <view class="text-center text-gray-400">暂无订单</view>
        </view>
      </template>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { http } from "@/utils/http";
import { useUserStore } from "@/store/modules/user";
import { onShow } from "@dcloudio/uni-app";

const navGoodsDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

// 列表数据
interface IRes {
  addtime: string; //  订单生成时间
  freight_price: number; //  运费
  id: number; // 订单唯一id
  noncestr: any; // 微信订单号
  openid: string;
  orderid: string; // orderid:  订单号
  orderinfo: string; // orderinfo  订单id 订单名称，订单图片，价格，购买数量
  product_price: number; // 商品金额
  state: string; //  订单状态
  total_price: number; // 总金额
  trackingnumber_back: string; // 退货订单号（退货才显示）
  trackingnumber_send: string; // 发货订单号（发货才显示）
  updatatime: number;
  user_address: string;
  user_name: string;
  user_phone: string;
}
const response = reactive<IRes>({
  addtime: "",
  freight_price: 0, //  运费
  id: 0, // 订单唯一id
  noncestr: null, // 微信订单号
  openid: "",
  orderid: "", // orderid:  订单号
  orderinfo: "", // orderinfo  订单id 订单名称，订单图片，价格，购买数量
  product_price: 0, // 商品金额
  state: "", //  订单状态
  total_price: 0, // 总金额
  trackingnumber_back: "", // 退货订单号（退货才显示）
  trackingnumber_send: "", // 发货订单号（发货才显示）
  updatatime: 0,
  user_address: "",
  user_name: "",
  user_phone: "",
});
const list = ref<any[]>([]);

const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});

function getAllData() {
  http
    .post("Users/getUserOrder", {
      openid: openid.value,
      // openid: "oR8AC5ikw7akvOh3WE6k2ZbsgRMU",
      state: "待收货",
    })
    .then((res: any) => {
      if (res.data && res.data.length > 0) {
        list.value = res.data;
      }
    });
}

// 跳转
const navOrderDetailById = (order: any) => {
  const jsonOrder = JSON.stringify(order);
  uni.navigateTo({
    url: `/pages/orderDetailById/index?order=${jsonOrder}`,
  });
};

onShow(() => {
  list.value = [];
  getAllData();
});
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
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
</style>
