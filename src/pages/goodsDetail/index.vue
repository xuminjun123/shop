<!--
 * @Description:
 * @Author: xmj
 * @Date: 2022-09-08 15:13:56
-->
<template>
  <view class="detail-container">
    <template v-if="productData.productvideo">
      <video
        :poster="productData.productimg"
        id="myVideo"
        :src="productData.productvideo"
        :danmu-btn="false"
        controls
        objectFit="cover"
      ></video>
      <!-- <video
        v-if="showVideo"
        id="myVideo"
        :src="productData.productvideo"
        :danmu-btn="false"
        controls
      ></video>
      <cover-view
        v-else
        class="flex flex-center"
        style="width: 100vw; height: 750rpx"
      >
        <cover-image
          @click="play"
          :src="productData.productimg"
          class="relative"
          style="width: 100vw; height: 750rpx"
        ></cover-image>
        <cover-image
          @click="play"
          :src="videoPlayImg"
          class="videoPlayImg"
        ></cover-image>
      </cover-view> -->
    </template>
    <template v-else>
      <div class="w-full">
        <image id="" mode="widthFix" :src="productData.productimg"></image>
      </div>
    </template>

    <view class="flex justify-between prd-tip">
      <view class="w-full">
        <template v-if="productData.price == productData.preferentialprice">
          <view class="flex justify-between w-full">
            <view class="preferentialprice"
              >¥{{ productData.preferentialprice }}</view
            >
            <view class="self-center pb-2 text-xs prdname"
              >库存: {{ productData.inventory }}</view
            >
          </view>
          <view class="pt-1 font-bold"> {{ productData.producttitle }}</view>
        </template>
        <template v-else>
          <view class="flex justify-between">
            <view class="flex">
              <view class="self-end text-red-500 preferentialprice">
                <text class="text-sm"> ¥ </text>
                <text class="text-xl">
                  {{ productData.preferentialprice }}
                </text>
              </view>

              <view class="ml-2 text-xs text-gray-500 prdprice"
                >原价 ¥{{ productData.price }}</view
              >
            </view>
            <view class="self-center pb-2 text-xs prdname"
              >库存: {{ productData.inventory }}</view
            >
          </view>

          <view class="pt-1 font-bold"> {{ productData.producttitle }}</view>

          <!-- <view class="self-center pb-2 text-xs prdname"
            >库存: {{ productData.inventory }}</view
          > -->
        </template>
      </view>

      <!-- <view class="self-center pb-2 text-xs prdname"
        >库存: {{ productData.inventory }}</view
      > -->
    </view>
    <!-- 商品信息 -->
    <view class="p-2 mt-2 product">
      <view
        class="w-11/12 p-2 mx-auto my-2 bg-white rounded-md"
        style="margin-bottom: 100rpx"
      >
        <mp-html :content="productData.productcontent" />
      </view>
    </view>

    <!-- 商品导航 -->
    <view class="mt-2 shop-action">
      <view class="flex w-full py-1 bg-white">
        <view class="flex w-1/3">
          <view class="flex flex-col flex-1 flex-center">
            <view class="" @click="navIndex">
              <uni-icons type="home" size="25"></uni-icons>
              <view class="text"> 首页 </view>
            </view>
          </view>
          <view
            class="flex flex-col flex-1 flex-center"
            @click="navShoppingCart"
          >
            <uni-icons type="cart" size="25"></uni-icons>
            <view class="text"> 购物车 </view>
          </view>
        </view>

        <view
          class="w-1/3 text-sm flex-center add_shoppoing"
          @click="addShoppingCart"
        >
          加入购物车
        </view>
        <view
          class="w-1/3 text-sm flex-center bugGoods"
          @click="navOrderDetail"
        >
          立即购买
        </view>
      </view>
    </view>

    <tm-drawer
      :round="3"
      :height="900"
      ref="calendarView"
      placement="bottom"
      v-model:show="showDrawer"
      hideHeader
      :zIndex="999999999"
    >
      <view class="">
        <view>
          <view class="order-info">
            <!-- 商品图片 -->
            <view class="goods-info">
              <image :src="productData.productimg"></image>
            </view>

            <!-- 配送方式 -->
            <view class="other-info">
              <view class="title">配送方式</view>
              <view class="distribution">
                <radio-group>
                  <view class="distribution-item">
                    <radio class="radio" color="#000" :checked="true"></radio>
                    <text>快递配送</text>
                  </view>
                </radio-group>
              </view>
            </view>
            <!-- 购买数量 -->
            <view class="other-info buy-number">
              <view class="title">购买数量</view>
              <uni-number-box
                v-model:value="count"
                :min="1"
                :max="productData.inventory"
                @change="changeCount"
              ></uni-number-box>
            </view>
            <button type="warn" @click="save">确定</button>
          </view>
        </view>
      </view>
    </tm-drawer>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
import { http } from "@/utils/http";
import tmDrawer from "@/tmui/components/tm-drawer/tm-drawer.vue";
import { showToast } from "@/utils/toast";
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
import { useUserStore } from "@/store/modules/user";
import videoPlayImg from "@/assets/videoplay.png";
import logo from "@/assets/logo.jpeg";
const showDrawer = ref(false);

const showVideo = ref(false);
const calendarView = ref<HTMLDivElement | null>(null);

const play = () => {
  showVideo.value = true;
  myVideo.value.play();
};

// 回到首页
const navIndex = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
const addCount = ref(0);

// 加入购物车
const addShoppingCart = () => {
  if (productData.inventory == 0) {
    showToast("商品售罄");
    return;
  }
  if (addCount.value > 0) {
    showToast("您已加入购物车！");
    return;
  }
  const userStore = useUserStore();
  http
    .post(`Small/shoppingCartAdd`, {
      openid: userStore.getOpenId,
      productid: id.value,
    })
    .then((res) => {
      addCount.value = 1;
      if (res.code == 1) {
        showToast("加入购物车成功");
      }
    });
};

// 跳转到购物车
const navShoppingCart = () => {
  uni.switchTab({
    url: "/pages/shoppingCart/index",
  });
};

// 跳转到订单明细
const navOrderDetail = () => {
  if (productData.inventory == 0) {
    showToast("商品售罄");
    return;
  }
  uni.navigateTo({
    url: `/pages/orderDetail/index?id=${id.value}&count=${prdinfo.count}`,
  });
};

const prdinfo = reactive({
  imgs: [],
  brief: "",
  price: 0,
  content: "",
  count: 1,
  pic: "",
  colorList: [],
  sizeList: [],
});

const count = ref(1);
// 数量
const changeCount = (e: number) => {
  if (e > productData.inventory) {
    count.value == 1;
    return;
  }
  count.value = e;
};

//确定
const id = ref(0); // 商品id
const productData = reactive({
  producttitle: "", // 商品名称
  productimg: "", // 封面图
  productvideo: "", //  轮播视频
  productcontent: "", // 具体内容
  preferentialprice: 0, // 优惠价格
  price: 0, // 标注价格
  inventory: 0, // 库存数量
});

const save = () => {
  showDrawer.value = false;
};

onLoad(async (options: any) => {
  id.value = options.id;
  const res: any = await http.post(`Small/productDisplay`, {
    id: id.value,
  });

  if (res.code == 1) {
    const {
      producttitle,
      productimg,
      productvideo,
      productcontent,
      preferentialprice,
      price,
      inventory,
    } = res.data;
    productData.productimg = productimg;
    productData.producttitle = producttitle;
    productData.productvideo = productvideo;
    productData.productcontent = productcontent;
    productData.preferentialprice = preferentialprice;
    productData.price = price;
    productData.inventory = inventory;
  }
});
const myVideo = ref();
onReady(() => {
  myVideo.value = uni.createVideoContext("myVideo");
});
</script>

<style lang="scss" scoped>
.detail-container {
  width: 100%;
  height: 100%;
}
page {
  color: #333;
  font-size: 28rpx;
  padding: 80px 0;
}

.text {
  font-size: 20rpx;
  font-weight: 400;
}

.swiper {
  height: 616rpx;
  position: relative;

  swiper {
    width: 100%;
    height: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .swiper-tag {
    position: absolute;
    right: 26rpx;
    bottom: 26rpx;
    line-height: 1;
    letter-spacing: 2rpx;
  }
}

.discount {
  color: #e94e4b;
  background-color: #333;
  padding: 24rpx 32rpx;
  font-size: 24rpx;

  > view {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .price {
      font-size: 40rpx;
      transform: translateX(-8rpx);
    }

    .old-price {
      text-decoration-line: line-through;
    }

    .tag {
      font-size: 22rpx;
      line-height: 40rpx;
      background-color: #fff;
      border-radius: 20rpx;
      padding: 0 20rpx;
      margin-left: 20rpx;
    }

    :deep(uni-countdown) {
      margin-left: 14rpx;

      .uni-countdown__splitor {
        color: #e94e4b !important;
      }

      .uni-countdown__number {
        line-height: 1.4 !important;
        font-size: 22rpx !important;
      }
    }
  }
}

.product {
  padding: 20rpx 32rpx;
  display: flex;
  background-color: #fff;
  font-size: 24rpx;

  .info {
    flex: 1 1 auto;
    word-break: break-all;
    line-height: 1.8;
    margin-right: 62rpx;

    .uni-tag {
      border: none;
      margin-right: 16rpx;
      border-radius: 8rpx;
    }
  }

  .share {
    flex-shrink: 0;
    color: #666;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20rpx;
    line-height: 1;
  }
}

.other {
  margin-top: 26rpx;
  padding: 20rpx 32rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  word-break: break-all;
  font-size: 24rpx;
  line-height: 2;

  .label {
    flex-shrink: 0;
    color: #777;
    margin-right: 28rpx;
  }

  .value {
    flex: 1 1 auto;
  }

  .uni-icons {
    flex-shrink: 0;
    line-height: 1;
  }

  &.serve {
    align-items: flex-start;
  }
}

.placeholder {
  height: 126rpx;
}

.prd-tip {
  background: #fff;
  padding: 20rpx 32rpx;
}

.prdtitle {
  font-weight: 400;
  font-size: 12px;
  line-height: 28px;
  color: #aaaaaa;
}

.prdprice {
  color: #333333;
  align-self: flex-end;
  text-decoration: line-through;
}

.title {
  color: #282d42;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.order-info {
  padding: 32rpx;

  .goods-info {
    display: flex;
    padding-bottom: 60rpx;
    border-bottom: 2rpx solid #ededed;

    image {
      width: 300rpx;
      height: 300rpx;
    }

    .info {
      margin-left: 24rpx;
      line-height: 1.8;
      flex: 1 1 auto;

      .price {
        width: 100%;
        font-size: 40rpx;
        color: #e94e4b;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .other-info {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #ededed;

    text {
      font-size: 24rpx;
    }

    .color-box {
      margin-top: 20rpx;

      > view {
        width: 60rpx;
        height: 60rpx;
        display: inline-block;

        + view {
          margin-left: 16rpx;
        }
      }
    }

    .recommend {
      display: flex;

      text {
        font-size: 22rpx;
      }

      .edit-profile {
        flex-shrink: 0;
        margin-left: 50rpx;
        text-decoration: underline;
      }
    }

    .size {
      > text {
        display: inline-block;
        border: 1rpx solid #c4c4c4;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        padding: 10rpx 14rpx;
      }
    }

    .distribution {
      .distribution-item {
        padding: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 0 8rpx 2rpx rgba(0, 0, 0, 0.12);

        .radio {
          transform: scale(0.6);
        }

        .address {
          margin: 0 10rpx;
          color: #e94e4b;
        }

        > view {
          margin-left: 52rpx;
        }
      }
    }

    &.buy-number {
      .title {
        margin: 0;
      }

      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  button {
    margin-top: 28rpx;
    font-size: 28rpx;
    line-height: 88rpx;
    border-radius: 0;

    &::after {
      border-radius: 0;
    }
  }
}

.selectSize {
  background-color: #333;
  color: white;
}

.selectColor {
  border: 5rpx solid black;
}

.shop-action {
  position: fixed;
  bottom: 0rpx;
  width: 100%;
  height: 120rpx;
  z-index: 10;
  background-color: white;
  border-top: 1rpx solid #ccc;
}
#myVideo {
  width: 100vw;
  // height: 550rpx;
  object-fit: fill;
}

.videoPlayImg {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.add_shoppoing {
  border: 2rpx solid #ccc;
  border-radius: 60rpx;
  @apply mr-1;
}
.bugGoods {
  border: 2rpx solid #095b2b;
  border-radius: 60rpx;
  color: #095b2b;
  @apply ml-1 mr-1;
}
</style>
