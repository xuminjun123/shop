<!--
 * @Description: 首页
 * @Author: xmj0.
 * @Date: 2022-06-11 18:49:12
-->
<template>
  <view>
    <view class="container">
      <servicePerson />
      <!-- 获取分类 -->
      <view>
        <SelectType @select="select" />
      </view>
      <view class="w-full carousel">
        <tm-carousel
          autoplay
          :margin="[0, 16]"
          :round="3"
          :width="686"
          :height="350"
          :list="listimg"
          @click="selectCarousel"
        ></tm-carousel>
      </view>
      <view @click="navSearch">
        <uni-search-bar
          class="uni-mt-10"
          radius="5"
          placeholder="搜索商品"
          clearButton="auto"
          cancelButton="none"
          readonly
        />
      </view>

      <view class="flex justify-between w-11/12 mx-auto tzContent">
        <view v-for="child in newData" :key="child.id" class="children">
          <view class="my-2 bg-white" @click="navGoodsViewDetail(child.id)">
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
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import tmCarousel from "@/tmui/components/tm-carousel/tm-carousel.vue";
import { onShow } from "@dcloudio/uni-app";
import { http } from "@/utils/http";
import SelectType from "./components/selectType.vue";
import { showToast } from "@/utils/toast";
import shoppingImg from "@/assets/shopping.png";
import { useUserStore } from "@/store/modules/user";
import servicePerson from "./components/servicePerson.vue";

// 轮播图
const listimg = ref([]);
const navGoodsViewDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

const navSearch = () => {
  uni.navigateTo({
    url: "/pages/search/index",
  });
};

const propTitle = (title: string) => {
  return title.length > 8 ? title.substring(0, 8) + "..." : title;
};

// 选择分类
const newData = ref<any[]>([]);

const select = (e: string) => {
  console.log("e->>>>>>>>>>>", e);
  if (!e) {
    // 默认显示全部
    newData.value = data.value;
  } else {
    newData.value = data.value.filter((item) => {
      return item.productclass == e;
    });
    if (newData.value.length === 0) {
      showToast("无数据");
    }
  }
};

const data = ref<any[]>([]); // 推荐商品
const carouselInfoList = ref<any>([]);
const getData = async () => {
  const res: any = await http.post("Small/productList");
  if (res.code == 1) {
    console.log("");
    carouselInfoList.value = res.carouselInfo;
    listimg.value = res.carouselInfo.map((item: any) => {
      return item.productimg;
    });
    data.value = res.homepageInfo.map((item: any) => {
      return {
        id: item.id,
        preferentialprice: item.preferentialprice,
        productclass: item.productclass,
        productimg: item.productimg,
        producttitle: item.producttitle,
      };
    });
    select("");
  }
};

const selectCarousel = (i: number) => {
  const obj = carouselInfoList.value.find((item: number, index: number) => {
    return i == index;
  });
  const { id } = obj;
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
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

onShow(async () => {
  await getData();
});
</script>
<style lang="scss" scoped>
.container {
  display: flow-root;
  width: 100%;
  background-color: #f9f9f9;
}
:deep(.uni-searchbar) {
  padding: 10px 13px 0px 13px !important;
}
:deep(.uni-searchbar__box) {
  justify-content: left;
  background-color: #f4f4f4 !important;
  // border: 1px solid #095b2b;
}
.searchBg {
  width: 100vw;
  margin-top: 180rpx;
}

swiper {
  width: 100%;
  height: 350rpx;
  overflow: hidden;
}

swiper.pic-swiper {
  margin-top: 75rpx;
  padding: 10rpx 0;
  background: #fff;
  height: 422rpx;
}

swiper-item {
  font-size: 26rpx;
  font-weight: bold;
}

swiper.pic-swiper .img-box {
  font-size: 0;
}

.wx-swiper-dots {
  margin-bottom: 15rpx;
}

.banner-item {
  box-sizing: border-box;
}

/* 轮播图 */
swiper {
  width: 100%;
  height: 350rpx;
  overflow: hidden;
}

swiper.pic-swiper {
  margin-top: 75rpx;
  padding: 10rpx 0;
  background: #fff;
  height: 422rpx;
}

swiper-item {
  font-size: 26rpx;
  font-weight: bold;
}

.carousel {
  :deep(.py-5) {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.tzContent {
  flex-wrap: wrap;
}

.text {
  font-size: 20rpx;
}

.content {
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
.bor {
  border: 1px solid #095b2b;
  background-color: white;
  border-radius: 8rpx;
}
</style>
