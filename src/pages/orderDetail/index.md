<!--
    订单明细
 * @Author: xmj
 * @Date: 2022-09-08 16:10:23
-->

<template>
  <view class="goodsInfo-container">
    <view class="p-2">
      <scroll-view style="height: calc(100vh - 150rpx)" :scroll-y="true">
        <template v-if="isHasAddress">
          <view class="flex p-3 mx-auto bg-white order-cell">
            <view class="w-[50rpx] flex justify-center items-center">
              <img :src="addressSrc" mode="widthFix" />
            </view>
            <view>
              <view class="pb-2 pl-2 font-bold text-md">
                {{ addressdata.region + addressdata.detail }}
              </view>
              <view class="pl-2">
                <text class="text-gray-600"> {{ addressdata.user_name }} </text>
                <text class="pl-2 text-gray-600">
                  {{ addressdata.user_phone }}
                </text>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="order-cell h-[100rpx]">
            <tm-cell
              :margin="[0, 0]"
              :titleFontSize="30"
              :title="address"
              @click="navAddAddress"
            >
            </tm-cell>
          </view>
        </template>

        <view class="mt-2 bg-white order-cell">
          <text class="pt-3 pl-2 title">商品信息 </text>
          <view class="w-full py-3">
            <view class="w-11/12 mx-auto">
              <img
                :src="productdata.productimg"
                mode="widthFix"
                alt=""
                srcset=""
              />
            </view>
            <view class="w-2/3 ml-6">
              <text class="text-sm title"
                >{{ productdata.producttitle }}\n</text
              >
              <view class="my-3 text-sm title"
                >库存: {{ productdata.inventory }}</view
              >
              <view class="my-3 text-red-500 text-md"
                >￥{{ productdata.preferentialprice }}</view
              >
              <view class="flex items-center text-xs">
                <view class="mr-2 title">购买数量</view>
                <!-- <tm-stepper
                  :min="1"
                  :max="productdata.inventory"
                  v-model="count"
                  :defaultValue="1"
                  @change="blur"
                ></tm-stepper> -->

                <uni-number-box
                  v-model="count"
                  :min="1"
                  :max="productdata.inventory"
                >
                </uni-number-box>

              </view>

              <view class="my-3 text-sm title"
                >运费: {{ addressdata.freight }} 元</view
              >
            </view>
          </view>

          
          <view class="w-11/12 pb-2 mx-auto order-cell">
            <view class="flex-title"
              ><text class="total">订单总额</text>
              <text class="total">￥{{ prodPrice  }}</text>
            </view>
          </view>
        </view>

        <!-- 假如有地址 -->
        <!-- <template v-if="isHasAddress">
          <view class="flex px-3 ml-3 order-cell mx-10/12 h-[200rpx]">
            <text class="text-sm font-bold">收货地址:</text>

            <view class="flex-title">
              <text class="text-sm font-bold">{{
                addressdata.region + addressdata.detail
              }}</text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="order-cell h-[200rpx]">
            <tm-cell
              :margin="[0, 0]"
              :titleFontSize="30"
              :title="address"
              @click="navAddAddress"
            >
            </tm-cell>
          </view>
        </template> -->
      </scroll-view>
    </view>
    <view class="flex-bottom">
      <view class="payprice"
        ><text>应付总额:</text>
        <text style="color: #e94e4b; padding-left: 20rpx"
          >￥{{ prodPrice }}</text
        >
      </view>
      <!-- <tm-button
        :shadow="0"
        text
        size="small"
        outlined
        label="支付"
        :disabled="disabled"
        color="payColor"
        _class="wxpay"
      ></tm-button> -->
      <button class="wxpay" @click="gowxpay" :disabled="disabled">支付</button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import tmStepper from "@/tmui/components/tm-stepper/tm-stepper.vue";
import tmCell from "@/tmui/components/tm-cell/tm-cell.vue";
import { showError, showToast } from "@/utils/toast";
import addressSrc from "@/assets/address.png";
const count = ref(1);
// const orderDetail = reactive({
//   id: "",
//   pic: "",
//   prodName: "",
//   color: "",
//   size: "",
//   price: "",
//   count: 0,
//   csRelation: "",
// });

const prodPrice = computed(() => {
  return productdata.preferentialprice * count.value + addressdata.freight ;
});

// 支付按钮禁用 1. 没有地址没有数量,没有金额, 禁用
const disabled = computed(() => {
  if (!isHasAddress.value) {
    return true;
  }
  if (!productdata.num) {
    return true;
  }
  if (!prodPrice.value) {
    return true;
  }
  return false;
});


// 微信支付
function gowxpay() {
  // 普通下单 跳转到订单支付页面
  let params = {
    openid: openid.value,
    products: [
      {
        id: Number(id.value),
        num: count.value,
      },
    ],
    addressid: addressdata.id,
    totalprice: prodPrice.value,
  };
  http
    .post(`Order/wxPay `, params)
    .then((res: any) => {
      if (res.code == "200") {
        const {
          appId,
          nonceStr,
          package: packageValue,
          paySign,
          signType,
          timeStamp,
        } = res.payData;
        uni.requestPayment({
          // appId: appId,
          provider: "wxpay", //支付类型-固定值
          timeStamp: String(timeStamp), // 时间戳（单位：秒）
          nonceStr: nonceStr, // 随机字符串
          package: packageValue, // 固定值
          signType: signType, //固定值
          paySign: paySign, //签名
          success: function (res) {
            console.log("success:-->>>>>>" + JSON.stringify(res));
            console.log("支付成功");
            uni.navigateTo({
              url: `/pages/paySuccess/index`,
            });
          },
          fail: function (err) {
            showError("支付失败");
          },
        });
      }
    })
    .catch(() => {
      showError("支付失败");
    });
}
const id = ref(0);
const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});

const navAddAddress = () => {
  uni.navigateTo({
    url: `/pages/addAddress/index`,
  });
};

// 商品信息
const productdata = reactive({
  id: 0,
  inventory: 0,
  num: 0,
  preferentialprice: 0,
  productimg: "",
  producttitle: "",
});
// 订单总金额
// const totalprice = ref(0);
// 地址信息
const addressdata = reactive({
  id: 0,
  openid: "",
  user_name: "",
  user_phone: "",
  region: "",
  detail: "",
  freight: "",
});
const address = ref("");
const isHasAddress = ref(false);

// const blur = (e)=> {
//   console.log('e-->>',e)
//   if(count.value > productdata.inventory) {
//     count.value = 1;
//     return
//   }
//   console.log('blurblur --> >')
// }

// 获取商品
function getGoodsInfo() {
  http
    .post(`Small/productPay`, {
      products: JSON.stringify([
        {
          id: Number(id.value),
          num: count.value,
        },
      ]),
      openid: openid.value,
    })
    .then((res: any) => {
      console.log("res->>>>>>>>>", res);

      productdata.id = res.productdata[0].id;
      productdata.inventory = res.productdata[0].inventory;
      productdata.num = res.productdata[0].num;
      productdata.preferentialprice = res.productdata[0].preferentialprice;
      productdata.productimg = res.productdata[0].productimg;
      productdata.producttitle = res.productdata[0].producttitle;

      if (
        Array.isArray(res.addressdata) &&
        res.addressdata.includes("请添加邮寄地址")
      ) {
        address.value = "请添加邮寄地址";
        isHasAddress.value = false;
      } else {
        addressdata.id = res.addressdata.id;
        addressdata.openid = res.addressdata.openid;
        addressdata.user_name = res.addressdata.user_name;
        addressdata.user_phone = res.addressdata.user_phone;
        addressdata.region = res.addressdata.region;
        addressdata.detail = res.addressdata.detail;
        addressdata.freight = res.addressdata.freight;
        isHasAddress.value = true;
      }
      // totalprice.value = res.totalprice;
    });
}

onLoad((options: any) => {
  id.value = options.id;
  // orderDetail.count = options?.count ?? 0;
});

onShow(() => {
  getGoodsInfo();
});
</script>
<style scoped lang="scss">
.goodsInfo-container {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  margin-bottom: 100px;
}

.pd-card {
  padding: 0;
  background: #fff;
}

.order-address {
  height: 206rpx;
  background: #ffffff;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.12);
  padding: 32rpx;
}

.address-1 {
  display: flex;
  justify-content: space-between;
}

.title {
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
}

.linetitle {
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  text-decoration-line: underline;
  color: #282d42;
}

.address-text {
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 40rpx;
  /* identical to box height */
  letter-spacing: 0.557693px;
  color: #666666;
}

.order-info {
  padding: 32rpx;

  img {
    width: 246rpx;
    height: 280rpx;
    position: absolute;
    display: block;
    top: 90rpx;
  }
}

.info-right {
  position: absolute;
  right: 140rpx;
  top: 90rpx;
}

.price-big {
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  /* identical to box height */
  letter-spacing: 0.557693px;
  color: #e94e4b;
}

.info {
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height */
  display: block;
  margin-left: -14rpx;
  letter-spacing: 0.557693px;
  /* 字体主色 */
  color: #333333;
}

.small-text {
  font-family: "PingFang HK";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  /* identical to box height */
  letter-spacing: 0.557693px;
  /* 字体主色 */
  color: #333333;
}

.order-cell {
  border-radius: 20rpx;
  // padding: 14rpx 32rpx;
}

.flex-title {
  display: flex;
  justify-content: space-between;
}

.small-price {
  font-weight: 600;
  font-size: 12px;
}

.total {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.390385px;
  color: #282d42;
}

.flex-bottom {
  display: flex;
  height: 120rpx;
  background: #ffffff;
  box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.12);
  align-items: center;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.wxpay {
  width: 94px;
  height: 31px;
  background: #e94e4b;
  color: #fff;
  line-height: 31px;
  font-size: 14px;
  border-radius: 0;
}

.payprice {
  margin-left: 220rpx;
}
</style>
