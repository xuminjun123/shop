<template>
  <view class="wrapper">
    <view>
      <uni-search-bar
        radius="5"
        v-model="searchValue"
        placeholder="搜索商品"
        clearButton="always"
        cancelButton="none"
        @blur="search"
        @cancel="cancel"
      />
    </view>
    <scroll-view
      scroll-y="true"
      style="height: calc(100vh - 150rpx)"
      scroll-with-animation
      @scrolltolower="touchBottom"
    >
      <!-- <view>
        <view class="flex justify-between w-11/12 mx-auto tzContent">
          <view
            v-for="child in data"
            :key="child.id"
            class="children bg-yellow-500"
          >
            <view class="my-2 bor" @click="navGoodsViewDetail(child.id)">
              <view class="w-full h-[310rpx]">
                <img :src="child.productimg" alt="" />
              </view>
              <view class="p-1 text-sm"> {{ child.producttitle }} </view>
              <view class="text-sm tag"> 限时购优惠 </view>
              <view class="flex justify-between w-full p-1 text-sm">
                <view class="text-red-500">
                  ¥ {{ child.preferentialprice }} 元
                </view>
                <view
                  class="w-[35rpx] h-[35rpx] mr-2"
                  @click.stop="addShoppingCart(child.id)"
                >
                  <image :src="shoppingImg" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view> -->

      <view class="flex justify-between w-11/12 mx-auto tzContent">
        <view
          v-for="child in data"
          :key="child.id"
          class="children bg-white my-2"
        >
          <view class="" @click="navGoodsViewDetail(child.id)">
            <view class="w-full h-[310rpx]">
              <img :src="child.productimg" alt="" />
            </view>
            <view class="flex p-1 text-sm">
              <view>
                {{ propTitle(child.producttitle) }}
              </view>
            </view>
            <!-- <view class="text-sm tag"> 限时购优惠 </view> -->
            <view class="flex justify-between w-full p-1 text-sm">
              <view class="text-red-500">
                ¥ {{ child.preferentialprice }} 元
              </view>
              <view
                class="w-[35rpx] h-[35rpx] mr-2"
                @click.stop="addShoppingCart(child.id)"
              >
                <image :src="shoppingImg" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { http } from "@/utils/http";
import { showToast } from "@/utils/toast";
import shoppingImg from "@/assets/shopping.png";
import { useUserStore } from "@/store/modules/user";
const searchValue = ref("");
const search = (e) => {
  searchValue.value = e.value;
  queryPage.value = 1;
  data.value = [];
  getData();
};
const cancel = () => {};
const propTitle = (title: string) => {
  return title.length > 8 ? title.substring(0, 8) + "..." : title;
};
// 当前页数
const queryPage = ref<number>(1);
// 总页数
const totalPages = ref<number>(0);
// 总条数
const totalElements = ref<number>(0);

const data = ref<any[]>([]); // 推荐商品
const getData = async () => {
  if (!searchValue.value) return;
  const res: any = await http.post("Small/productSelect", {
    producttitle: searchValue.value,
    page: queryPage.value,
  });
  if (res.code == 1) {
    data.value = [...data.value, ...res.data];
    totalPages.value = res.data.totalPage;
    totalElements.value = res.data.totalCount;
  } else {
  }
};
const navGoodsViewDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

const touchBottom = () => {
  console.log("-->>>>");
  if (queryPage.value >= totalPages.value) {
    showToast("没有更多数据了");
  } else {
    queryPage.value++;
    getData();
  }
};
const addCount = ref(0);
// 加入购物车
const addShoppingCart = (id: number) => {
  if (addCount.value > 0) {
    showToast("您已加入购物车！");
    return;
  }
  const userStore = useUserStore();
  http
    .post(`Small/shoppingCartAdd`, {
      openid: userStore.getOpenId,
      productid: id,
    })
    .then((res) => {
      addCount.value = 1;
      if (res.code == 1) {
        showToast("加入购物车成功");
      }
    });
};
onMounted(async () => {
  await getData();
});
</script>
<style lang="scss" scoped>
.wrapper {
  background-color: #f9f9f9;
}
:deep(.uni-searchbar) {
  padding: 10px 20px 0px 20px !important;
}
:deep(.uni-searchbar__box) {
  justify-content: left;
  background-color: #f4f4f4 !important;
}
.tzContent {
  flex-wrap: wrap;
  background-color: #f9f9f9;
}
.children {
  width: 48%;
}
.tag {
  display: inline;
  border: 1rpx solid #ec6f59;
  border-radius: 10rpx;
  margin-left: 10rpx;
  color: #ec6f59;
  padding: 2rpx 3rpx;
  @apply text-xs bg-red-500 text-white;
}
</style>
