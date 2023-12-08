<!--
 * @Author: xmj
 * @Date: 2023-04-15 10:11:46
-->
<template>
  <view class="wrapper pb-10">
    <view class="flex flex-col w-full mx-auto">
      <template v-if="list.length > 0">
        <view
          class="flex flex-col w-11/12 py-2 mx-auto bg-white my-1"
          style="border: 1px solid #095b2b; border-radius: 8rpx"
          v-for="order in list"
          :key="order.id"
        >
          <view class="flex flex-col w-11/12 py-2 mx-auto">
            <view class="flex" @click="navGoodsDetail(order.prodId)">
              <view class="w-[196rpx] pt-1">
                <img :src="order.pic" mode="widthFix" />
              </view>
              <view class="flex flex-col justify-around flex-1 text-right">
                <view class="text-sm"> {{ order.status }} </view>
                <view class="text-sm"> 共{{ order.prodNums }}件商品 </view>
                <view class="text-sm">
                  <text> 合计: </text>
                  <text class="text-red-500"> ¥{{ order.total }} </text>
                </view>
              </view>
            </view>

            <view class="flex justify-end w-full py-1 bg-white">
              <!-- <view class="w-[164rpx]">
              <button
                @click="navOrderDetailById(order.id, order.status)"
                class="w-[164rpx] p-2 text-sm bg-white rounded-sm"
              >
                查看详情
              </button>
            </view> -->
              <view class="w-[164rpx]">
                <button
                  @click="cancelOrder(order.id)"
                  class="w-[164rpx] p-2 text-sm rounded-sm ml-1 bg-red-500 text-white"
                >
                  取消订单
                </button>
              </view>
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
import { ref } from "vue";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { http } from "@/utils/http";
import { showModal, showToast } from "@/utils/toast";
import config from "@/config";
// 当前页数
const queryPage = ref<number>(1);
// 总页数
const totalPages = ref<number>(0);
// 总条数
const totalElements = ref<number>(0);

// 查看详情
const navOrderDetailById = (id: number, status: string) => {
  uni.navigateTo({
    url: `/pages/orderDetailById/index?id=${id}&status=${status}`,
  });
};

const navGoodsDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

const activeName = ref("0");
const defaultName = ref<number | string>("0");

// 列表数据
const list = ref<any[]>([]);
const getorderlist = async () => {
  const data: any = await http.get(`/order/list`, {
    params: {
      size: 10,
      page: queryPage.value,
    },
  });
  list.value = data.list;
  totalPages.value = data.totalPage;
  totalElements.value = data.totalCount;
};

// 取消订单
const cancelOrder = (id: number) => {
  // showModal("是否确认取消订单？", async () => {
  //   const res: any = await http.post(`/order/cancelOrder/${id}`);
  //   if (res.code == 200) {
  //     showToast(res.message);
  //     getorderlist();
  //   }
  // });
};

onShow(() => {
  list.value = [
    {
      prodId: 1,
      pic: "https://www.stdhlmsg.com/public/uploads/20230417/71a1291b3e7994ae9e4fbe93986e4baa.jpg",
      status: "待付款",
      prodNums: "1",
      total: "100",
    },
  ];
  // getorderlist();
});

onLoad((options) => {
  defaultName.value = options.payload ?? "0";
  activeName.value = options.payload ?? "0";
});

onReachBottom(() => {
  if (queryPage.value >= totalPages.value) {
    showToast("没有更多数据了");
  } else {
    queryPage.value++;
    getorderlist();
  }
});
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: white;
}
</style>
