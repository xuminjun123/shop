<!--
 * @Description: 地址簿
 * @Author: xmj
-->
<template>
  <view class="p-3">
    <template v-if="list.length == 0">
      <view class="w-11/12 mx-auto">
        <img
          mode="widthFix"
          src="https://cdn.uviewui.com/uview/empty/address.png"
        />
      </view>
      <view class="text-sm text-center text-gray-400"> 没有收获地址 </view>
    </template>

    <template v-else>
      <!-- <view
        class="w-11/12 mx-auto my-2 rounded-md box"
        v-for="(item, index) in list"
        :key="item.id"
      >
        <view class="pl-2">
          <view class="pt-3">
            <text> {{ item.user_name }} </text>
            <text class="pl-2"> {{ item.user_phone }} </text>
          </view>
          <view class="pt-3"> {{ item.region }}{{ item.detail }} </view>
          <view class="py-1">
            <input
              :value="address(item)"
              type="text"
              :disabled="disabled"
              :class="disabled ? '' : 'border-1'"
              class="py-1"
            />
          </view>
        </view>
        <view class="flex address">
          <view
            class="flex-1 px-2 py-3 text-center"
            @click="defaultAddress(item.id)"
          >
            默认地址
          </view>
          <view
            class="flex-1 px-2 py-3 text-center box-edit"
            @click="edit(item.id)"
          >
            编辑
          </view>
          <view class="flex-1 px-2 py-3 text-center" @click="del(item.id)">
            X
          </view>
        </view>
      </view> -->
      <!-- class="bg-red-500" -->
      <scroll-view scroll-y style="height: calc(100vh - 200rpx)">
        <view
          class="w-full py-2 mb-2 bg-white rounded-md"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <view class="flex justify-between p-3 mx-auto bg-white order-cell">
            <view class="w-[55rpx] flex justify-center items-center">
              <img :src="addressSrc" mode="widthFix" />
            </view>
            <view class="flex-1">
              <view class="pb-1 pl-2 text-md">
                {{ item.region + item.detail }}
              </view>
              <view class="pl-2">
                <text class="text-sm font-bold text-black">
                  {{ item.user_name }}
                </text>
                <text class="pl-2 text-sm text-gray-600">
                  {{ item.user_phone }}
                </text>
              </view>
            </view>
            <view
              class="w-[30rpx] flex justify-end items-center"
              @click="edit(item.id)"
            >
              <tm-icon name="tmicon-edit" color="#8a8a8a"></tm-icon>
            </view>
          </view>
          <view class="flex justify-between px-3 pt-2">
            <view>
              <!-- <label>
                <checkbox
                  :checked="item.checked"
                  style="transform: scale(0.7)"
                />
                设为默认
              </label> -->
              <tm-checkbox
                :disabled="item.checked"
                color="white"
                label="设为默认"
                :round="20"
                v-model="item.checked"
                @change="changeItemCheck(item)"
              >
              </tm-checkbox>
            </view>
            <view class="pt-2 text-xs text-gray-500" @click="del(item.id)">
              删除
            </view>
          </view>
        </view>
      </scroll-view>
    </template>
    <view class="fixed w-11/12 mx-auto my-4 tmBtn">
      <tm-button
        block
        color="logoutColor"
        @click="add"
        label="新增收货地址"
      ></tm-button>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { http } from "@/utils/http";
import { showModal, showToast } from "@/utils/toast";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import addressSrc from "@/assets/address.png";
import tmButton from "../../tmui/components/tm-button/tm-button.vue";
import { useUserStore } from "@/store/modules/user";

interface IData {
  id: number;
  user_name: string;
  user_phone: string;
  region: string;
  detail: string;
  state: number;
  checked: boolean;
}
const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});

// 地址列表
const list = ref<IData[]>([]);
// 新增收货地址
const add = () => {
  uni.navigateTo({
    url: "/pages/addAddress/index",
  });
};

// 编辑收货地址
const edit = (id: number) => {
  uni.navigateTo({
    url: `/pages/editAddress/index?id=${id}`,
  });
};

const selectItemCheck = ref(0); // 选中地址

// 选中地址
const changeItemCheck = async (item: IData) => {
  http
    .post(`Small/shoppingAddressDefault`, {
      id: item.id,
      openid: openid.value,
    })
    .then((res) => {
      if (res.code == 1) {
        showToast("设置默认地址成功");
        getData();
      }
    });
};

// 删除收货地址
const del = (id: number) => {
  showModal("是否确认删除？", () => {
    http
      .post(`Small/shoppingAddressDel`, {
        id: id,
      })
      .then((res) => {
        if (res.code == 1) {
          getData();
          showToast("删除成功");
        }
      });
  });
};

// 获取地址信息
function getData() {
  const userStore = useUserStore();
  http
    .post("Small/shoppingAddressList", {
      openid: userStore.getOpenId,
    })
    .then((res: any) => {
      list.value = res.data.map((item: any, index: number) => {
        return {
          ...item,
          checked: item.state == 1 ? true : false,
        };
      });
    });
}

// function address(item: any): string {
//   const city = item.city ?? "";
//   const area = item.area ?? "";
//   const addr = item.addr ?? "";
//   return `${city}${area}${addr}` ?? "";
// }

// function defaultAddress(id: string) {
//   showToast("尚未完成");
// }

onShow(() => {
  list.value = [];
  getData();
});
</script>
<style lang="scss" scoped>
.box {
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
}

.address {
  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
}

.box-edit {
  border-left: 2px solid #ccc;

  border-right: 2px solid #ccc;
}

view {
  @apply text-sm;
}
.tmBtn {
  bottom: 0;
}
.order-cell {
  border-bottom: 2rpx solid #ccc;
}
</style>
