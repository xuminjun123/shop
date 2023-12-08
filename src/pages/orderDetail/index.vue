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
          <view
            class="flex justify-between p-3 mx-auto bg-white order-cell"
            @click="changeAddress"
          >
            <view class="w-[55rpx] flex justify-center items-center">
              <img :src="addressSrc" mode="widthFix" />
            </view>
            <view class="flex-1">
              <view class="pb-1 pl-2 text-md">
                {{ addressdata.region + addressdata.detail }}
              </view>
              <view class="pl-2">
                <text class="text-sm text-gray-600">
                  {{ addressdata.user_name }}
                </text>
                <text class="pl-2 text-sm text-gray-600">
                  {{ addressdata.user_phone }}
                </text>
              </view>
            </view>
            <view class="w-[30rpx] flex justify-end items-center">
              <tm-icon name="tmicon-angle-right" color="#8a8a8a"></tm-icon>
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
          <view class="flex w-full p-3">
            <view class="w-[200rpx] h-[250rpx]">
              <img :src="productdata.productimg" alt="" srcset="" />
            </view>
            <view class="flex flex-col justify-between w-2/3 ml-6">
              <view class="flex justify-between w-full">
                <view>
                  <view class="text-sm">{{ productdata.producttitle }}</view>
                  <view class="text-sm">库存: {{ productdata.inventory }}</view>
                </view>

                <view class="text-red-500 text-md"
                  >￥{{ productdata.preferentialprice }}</view
                >
              </view>
              <view
                class="flex items-center justify-between text-xs bg-light-100"
              >
                <view class="text-sm">购买数量</view>
                <uni-number-box
                  v-model="count"
                  :min="1"
                  :max="productdata.inventory"
                >
                </uni-number-box>
              </view>
            </view>
          </view>
        </view>
        <view class="mt-2 bg-white order-cell">
          <view class="w-11/12 pt-2 mx-auto order-cell">
            <view class="flex-title"
              ><text class="total">运费:</text>
              <text class="total">{{ addressdata.freight }} 元</text>
            </view>
          </view>
          <view class="w-11/12 pt-1 pb-2 mx-auto order-cell">
            <view class="flex-title"
              ><text class="total">订单总额</text>
              <text class="total">￥{{ prodPrice }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="flex-bottom">
      <view class="payprice"
        ><text>应付总额:</text>
        <text style="color: #e94e4b; padding-left: 20rpx"
          >￥{{ prodPrice }}</text
        >
      </view>
      <button class="wxpay" @click="gowxpay" :disabled="disabled">支付</button>
    </view>
  </view>

  <uni-popup ref="popup" background-color="#fff">
    <view class="popup-content">
      <scroll-view :scroll-y="true" style="height: 600rpx">
        <view
          v-for="(item, index) in addressList"
          :key="item.id"
          class="px-3 py-4"
        >
          <view class="flex justify-between">
            <view class="flex flex-center">
              <view class="flex flex-center w-[50rpx] h-[50rpx] homeImg">
                <view v-if="index === 0" class="w-[25rpx]">
                  <tm-icon
                    :font-size="25"
                    color="white"
                    name="tmicon-position-fill"
                  ></tm-icon>
                </view>
                <view v-else class="text-sm"> {{ name(item.user_name) }} </view>
              </view>
            </view>

            <view class="flex flex-col flex-1 pl-2">
              <view>
                <text class="text-sm font-bold">{{ item.user_name }}</text>
                <text class="pl-2 text-sm">{{ item.user_phone }}</text>
              </view>
              <view class="text-xs text-gray-500">
                {{ item.region }} {{ item.detail }}
              </view>
            </view>
            <view class="w-[50rpx]">
              <tm-checkbox
                :disabled="item.checked"
                color="white"
                label=""
                :round="20"
                outlined
                v-model="item.checked"
                @change="changeItemCheck(item)"
              >
              </tm-checkbox>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="pb-8 mx-auto btn">
        <tm-button
          block
          color="logoutColor"
          @click="onOK"
          label="确定"
        ></tm-button>
      </view>
    </view>
  </uni-popup>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { computed, onMounted, reactive, ref } from "vue";
import tmCell from "@/tmui/components/tm-cell/tm-cell.vue";
import { showError, showToast } from "@/utils/toast";
import addressSrc from "@/assets/address.png";
interface IAddressData {
  id: number;
  openid: string;
  user_name: string;
  user_phone: string;
  region: string;
  detail: string;
  checked: boolean;
  freight: number;
}

const popup = ref(null);

const count = ref(1);
const showAddressSelect = ref(false); // 地址选择
const prodPrice = computed(() => {
  return productdata.preferentialprice * count.value + addressdata.freight;
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
  if (!isHasAddress.value) {
    showToast("请先添加收货地址");
    return;
  }

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
            uni.reLaunch({
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

// 地址信息
const addressdata = reactive({
  id: 0,
  openid: "",
  user_name: "",
  user_phone: "",
  region: "",
  detail: "",
  freight: 0,
});
const address = ref("");
const isHasAddress = ref(false);

// 获取商品
function getGoodsInfo() {
  http
    .post(`Small/productPay`, {
      products: [
        {
          id: Number(id.value),
          num: count.value,
        },
      ],
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
    });
}

const name = (userName: string) => {
  const arr = userName.split("");
  return arr[0];
};

// 获取所有地址
const addressList = ref<IAddressData[]>([]);

function getAddressListData() {
  const userStore = useUserStore();
  http
    .post("Small/shoppingAddressList", {
      openid: userStore.getOpenId,
    })
    .then((res: any) => {
      addressList.value = res.data.map((item: any) => {
        return {
          ...item,
          checked: item.id == addressdata.id ? true : false,
        };
      });
    });
}

// 切换地址
const changeAddress = () => {
  popup.value.open("bottom");
};
const selectItemCheck = ref(0); // 选中地址

// 选中地址
const changeItemCheck = (item: IAddressData) => {
  selectItemCheck.value = item.id;
  addressList.value = addressList.value.map((addressItem: IAddressData) => {
    return {
      ...addressItem,
      checked: addressItem.id == selectItemCheck.value ? true : false,
    };
  });
};

// 找到check 为true的
const onOK = () => {
  const obj = addressList.value.find((item: IAddressData) => {
    return item.checked == true;
  });
  if (obj) {
    addressdata.id = obj.id;
    addressdata.openid = obj.openid;
    addressdata.user_name = obj.user_name;
    addressdata.user_phone = obj.user_phone;
    addressdata.region = obj.region;
    addressdata.detail = obj.detail;
    addressdata.freight = obj.freight;
    showAddressSelect.value = false;
    popup.value.close();
  } else {
    showToast("请选择地址");
  }
};

onLoad((options: any) => {
  id.value = options.id;
});

onShow(() => {
  getGoodsInfo();
});
onMounted(() => {
  getAddressListData();
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
  border-radius: 12rpx;
}

.payprice {
  margin-left: 220rpx;
}

.popup-content {
  padding: 15px;
  background-color: #fff;
}

.homeImg {
  background-color: #095b2b;
  border-radius: 50%;
  color: white;
}
.btn {
  width: 90%;
}
:deep(.uni-popup .uni-popup__wrapper) {
  border-radius: 20rpx 20rpx 0 0;
}
</style>
