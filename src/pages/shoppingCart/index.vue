<template>
  <view>
    <view class="w-full bg-white header">
      <view class="flex justify-between w-11/12 py-2 mx-auto">
        <view>
          <tm-checkbox
            :round="10"
            color="white"
            label="全选"
            v-model="checked"
            @change="changeCheck"
          >
          </tm-checkbox>
        </view>
        <view class="text-sm" v-if="showDelIcons" @click="complete">
          完成
        </view>
        <view class="self-center text-sm" v-else @click="showDelIcons = true">
          编辑全部
        </view>
      </view>
    </view>
    <template v-if="list.length && list.length > 0" class="">
      <!-- 购物车 -->
      <view class="shoppingCart-container">
        <view
          class="w-11/12 mx-auto shopping-cart bor"
          style="border: 1px solid #095b2b; border-radius: 8rpx"
          v-for="item in list"
          :key="item.id"
        >
          <view class="goods-item">
            <view class="flex-center" @click="selectItem(item.inventory)">
              <tm-checkbox
                :disabled="item.inventory == 0 ? true : false"
                :round="10"
                color="white"
                label=""
                v-model="item.checked"
                @change="changeItemCheck"
              >
              </tm-checkbox>
            </view>

            <image :src="item.productimg" @click="navGoodsDetail(item.id)" />
            <view class="flex sell-out flex-center" v-if="item.inventory == 0">
              售罄
            </view>

            <view class="info">
              <view class="title">
                <view class="w-fullname" @click="navGoodsDetail(item.id)">{{
                  item.producttitle
                }}</view>

                <uni-icons
                  type="trash"
                  @click.stop="delGoods(item.id)"
                  v-if="showDelIcons"
                ></uni-icons>
              </view>
              <view
                class="pt-2 text-sm text-gray-500 name"
                @click="navGoodsDetail(item.id)"
                >库存: {{ item.inventory }}</view
              >
              <text style="flex: 1" @click="navGoodsDetail(item.id)"></text>
              <view class="info-footer">
                <view class="price">￥{{ item.preferentialprice }}</view>
                <view>
                  <uni-number-box
                    v-model="item.number"
                    :min="1"
                    :max="item.inventory"
                    @change="changeItemNumber($event, item.num)"
                  >
                  </uni-number-box>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 结算 -->
      <view class="placeholder">
        <view class="action-bar">
          <view class="price">总计：￥{{ count }}</view>
          <button type="warn" size="mini" @click="navPay" class="">确认</button>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="w-full no_car_data">
        <text> 购物车中没有商品 </text>
        <text class="text-red-500" @click="navIndex"> 立即订购 </text>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import tmCheckbox from "@/tmui/components/tm-checkbox/tm-checkbox.vue";
import { http } from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import { showToast } from "@/utils/toast";
import { useUserStore } from "@/store/modules/user";

interface Carts {
  id: number;
  producttitle: string; // 商品名称
  productimg: string; // 商品图像
  preferentialprice: number; // 单价
  inventory: number; // 库存数量
  num: number; // 购物车里本商品数量
  number: number;
  checked: boolean;
}

const showDelIcons = ref(false); //显示icon 图标
const list = ref<Carts[]>([]);

const checked = ref(false);
const changeCheck = (e: boolean) => {
  const _list = list.value.filter((item: any) => {
    return item.inventory !== 0;
  });
  console.log("_list", _list);

  _list.forEach((item: any) => {
    item.checked = e;
  });
};

const changeItemNumber = (value: number, basketCount: number) => {
  if (value == 1) {
    showToast("宝贝数量不能在减少了");
  }

  if (value == basketCount) {
    showToast("超出库存");
    return;
  }
};

const changeItemCheck = (e: boolean) => {
  const _list = list.value.filter((item: any) => {
    return item.inventory !== 0;
  });
  checked.value = _list.every((item: any) => item.checked);
  // checked.value = list.value.every((item: any) => item.checked);
};

// function toPage(id: number): void {
//   uni.navigateTo({
//     url: `/pagesUser/userGoodsDetail/index?id=${id}`,
//   });
// }

// 删除
const delGoods = async (id: number): Promise<void> => {
  list.value = list.value.filter((item: Carts) => {
    return item.id !== id;
  });
};

const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});

// 购物车列表跳转到订单详情
const navPay = () => {
  // 找出 checked 为true 的数据
  const checkedList = list.value.filter((item: Carts) => item.checked);
  if (checkedList.length > 0) {
    uni.navigateTo({
      url: `/pages/orderList/index?list=${JSON.stringify(
        checkedList
      )}&totalPrice=${count.value}`,
    });
  } else {
    uni.showToast({
      title: "请选择商品",
      icon: "none",
    });
  }
};
// 价格计算
const count = computed(() => {
  const checkedList = list.value.filter((item: Carts) => item.checked);
  const totalPrice = checkedList.reduce((prev: any, next: any) => {
    return prev + next.preferentialprice * next.number;
  }, 0);
  return Number(totalPrice).toFixed(2) ?? 0;
});

const navIndex = () => {
  uni.switchTab({
    url: `/pages/cate/index`,
  });
};

async function getData() {
  const userStore = useUserStore();
  const res = await http.post(`Small/shoppingCartList`, {
    openid: userStore.getOpenId,
  });
  if (res.code == 1) {
    list.value = res.data.map((item: any) => {
      return {
        ...item,
        number: 1,
        checked: false,
      };
    });
  }
}

const complete = () => {
  const infoData = list.value.map((item) => {
    return { [item.id]: item.num };
  });
  const result = infoData.reduce((obj, item) => {
    const key = Object.keys(item)[0];
    obj[key] = item[key];
    return obj;
  }, {});

  http
    .post(`Small/shoppingCartEdit`, {
      openid: openid.value,
      info: result ?? {},
    })
    .then((res) => {
      checked.value = false;
      showDelIcons.value = false;
      getData();
    });
};

const navGoodsDetail = (id) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

const selectItem = (num: number) => {
  if (num === 0) {
    showToast("商品售罄");
  }
};

onShow(() => {
  checked.value = false;
  showDelIcons.value = false;
  getData();
});
</script>

<style lang="scss" scoped>
page {
  color: #333;
  font-size: 28rpx;
}

radio {
  transform: scale(0.8);
}

.header {
  position: fixed;
  top: 0;
}
.topbar {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  line-height: 1;
}

.shoppingCart-container {
  margin-top: 100rpx;
}

.shopping-cart {
  background-color: #fff;
  padding: 0 32rpx;
  margin-top: 26rpx;

  .goods-item {
    padding: 20rpx 20rpx 20rpx 0;
    display: flex;

    + .goods-item {
      border-top: 2rpx solid #ededed;
    }

    radio {
      align-self: center;
    }

    image {
      width: 192rpx;
      height: 192rpx;
      margin: 0 32rpx 0 10rpx;
      flex-shrink: 0;
    }
    .sell-out {
      position: absolute;
      width: 192rpx;
      height: 192rpx;
      background: rgb(15, 2, 2);
      opacity: 0.8;
      // display: none;
      left: 144rpx;
      color: white;
    }

    .info {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      width: 0;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1;
        margin-bottom: 6rpx;

        .name {
          overflow: hidden;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .other {
        font-size: 28rpx;
        color: #888;
        &.grey {
          color: #888;
        }
      }

      .info-footer {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        .price {
          color: #e94e4b;
          letter-spacing: 2rpx;
          transform: translateX(-4rpx);
          border: none;
        }

        .uni-numbox {
          transform: scale(0.7);
          transform-origin: 100% 50%;
        }
      }
    }
  }
}

.more-goods {
  margin-top: 26rpx;
  padding: 26rpx 32rpx;
  background-color: #fff;

  .more-header {
    text-align: center;
    letter-spacing: 2rpx;
    padding: 10rpx 68rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;

    &::before {
      content: "";
      display: inline-block;
      width: 28%;
      height: 4rpx;
      background-color: #333;
    }

    &::after {
      content: "";
      display: inline-block;
      width: 28%;
      height: 4rpx;
      background-color: #333;
    }
  }

  .goods-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .goods-item {
      width: calc(50% - 12rpx);

      image {
        width: 100%;
        height: 400rpx;
      }

      .title {
        padding: 0 14rpx 14rpx;
        font-weight: 500;
        word-break: break-all;
      }
    }
  }
}

.placeholder {
  height: 112rpx;

  .action-bar {
    padding: 0 48rpx;
    height: 92rpx;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    bottom: var(--window-bottom);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #e94e4b;
    letter-spacing: 2rpx;
    font-weight: 500;

    button {
      margin: 0;
      padding: 0 64rpx;
      border-radius: 64rpx;
      line-height: 64rpx;

      &::after {
        border-radius: 0;
      }
    }
  }
}

.no_car_data {
  text-align: center;
  padding-top: 250rpx;
  color: #333333;
  font-size: 24rpx;

  // text {
  //   color: #E94E4B;
  //   margin-left: 5rpx;
  // }
}

.bor {
  border: 1px solid #095b2b;
  background-color: white;
  border-radius: 8rpx;
}
</style>
