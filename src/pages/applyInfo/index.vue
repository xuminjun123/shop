<template>
	<view class="infoDetail-container">
		<view class="bg-white rounded-md">
			<view class="w-11/12 mx-auto">
				<img :src="appointmentdata.img" mode="widthFix" />
			</view>
			<view class="w-11/12 pb-1 pl-1 mx-auto text-sm">
				{{ appointmentdata.title }}
			</view>
			<view class="w-11/12 pb-1 pl-1 mx-auto text-xs c_o" style="color:#eb6120;">
				活动时间: {{ starttime }}至{{ endtime }}
			</view>
			<view class="prompt_box w-11/12 pb-1 pl-1 mx-auto text-xs" v-if="appointmentdata.typecode == 1">
				<view class="flex_row" v-if="appointmentdata.pricedata.single !== '0'  && appointmentdata.pricedata.single">
					<view class="text-xs c_red">单人票价：</view>
					<view class="text-xs ">{{appointmentdata.pricedata.single}}元</view>
				</view>
				<view class="flex_row" v-if="appointmentdata.pricedata.family !== '0' && appointmentdata.pricedata.family">
					<view class="text-xs c_red">家庭票价：</view>
					<view class="text-xs">{{appointmentdata.pricedata.family}}元（两成人一小孩或两成人两小孩）</view>
				</view>
				<view class="flex_row" v-if="appointmentdata.pricedata.group !== '0' && appointmentdata.pricedata.group">
					<view class="text-xs c_red">团体单人票价：</view>
					<view class="text-xs">{{appointmentdata.pricedata.group}}元*人数（5-10人）</view>
				</view>
			</view>
		</view>

		<view class="p-2 mx-auto mt-2 bg-white rounded-md">
			<mp-html :content="appointmentdata.content" />
		</view>

		<!-- 无预约信息 就没有二维码 活动预约-->
		<view class="w-11/12 mx-auto bg-white rounded-md" v-if="!userdata.qrcode">
			<tm-button label="活动预约" block color="baseColor" @click="nav"></tm-button>
		</view>

		<!-- 有预约信息，但是还未到进场时间 -->
		<view class="w-11/12 p-2 mx-auto bg-white rounded-md"
			v-if="userdata.qrcode && userdata.qrcodemsg == '未到预约进场时间'">
			<view class="flex mt-5">
				<button class="px-5 btn">{{ userdata.qrcodemsg }}</button>
			</view>
			<!-- <tm-button
        :label="userdata.qrcodemsg"
        block
        color="baseColor"
        disabled
      ></tm-button> -->
		</view>

		<!-- 有预约信息，显示二维码 -->
		<view class="flex items-center justify-center w-full pb-10 mx-auto mt-5 mb-10"
			v-if="userdata.qrcode && userdata.qrcodemsg == '显示二维码'">
			<tm-qrcode :option="{ size: 650, str: userdata.qrcode }" _class="mx-auto"></tm-qrcode>
		</view>

		<!-- <view
      v-if="userdata.qrcode"
      class="flex items-center justify-center w-full pb-10 mx-auto mt-5 mb-10"
    >
      <tm-qrcode
        :option="{ size: 650, str: userdata.qrcode }"
        _class="mx-auto"
      ></tm-qrcode>
    </view>

    <view v-else>
      <view
        v-if="state == '可预约'"
        class="w-11/12 p-2 mx-auto bg-white rounded-md"
      >
        <tm-button
          label="活动预约"
          block
          color="baseColor"
          @click="nav"
        ></tm-button>
      </view>

      <view
        v-if="state == '预约已满'"
        class="w-11/12 p-2 mx-auto bg-white rounded-md"
      >
        <tm-button
          label="预约已满"
          block
          fontColor="white"
          color="customBlack"
        ></tm-button>
      </view>
    </view> -->
	</view>
</template>
<script lang="ts" setup>
	import {
		http
	} from "@/utils/http";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		useUserStore
	} from "@/store/modules/user";
	import {
		reactive,
		ref
	} from "vue";
	import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
	// import { mockData } from "./mockData";
	const userStore = useUserStore();

	const starttime = ref("");
	const endtime = ref("");
	const state = ref("");
	const userdata = ref({});
	const applyCount = ref(0);
	const appointmentdata = reactive({
		content: "",
		id: 0,
		img: "",
		title: "",
		price: "",
		typecode: 0,
		pricedata: {}
	});
	const id = ref("");
	// 获取活动详情
	const openid = userStore.openId;

	function getDetail(id: string) {
		http
			.post("Appointment/userAppointmentDisplay", {
				id,
				openid,
			})
			.then((res: any) => {
				appointmentdata.content = res.appointmentdata.content;
				appointmentdata.id = res.appointmentdata.id;
				appointmentdata.img = res.appointmentdata.img;
				appointmentdata.title = res.appointmentdata.title;
				appointmentdata.price = res.appointmentdata.price;
				appointmentdata.typecode = res.appointmentdata.price.includes("免费") ? 0 : 1;
				appointmentdata.pricedata = res.appointmentdata.pricedata;
				userdata.value = res.userdata;
				applyCount.value = res.appointmentdata.applyCount;
			});
	}

	const nav = () => {
		uni.navigateTo({
			url: `/pages/applyDetail/index?id=${id.value}&applyCount=${applyCount.value}`,
		});
	};

	onLoad((options: any) => {
		getDetail(options.id);
		id.value = options.id;
		starttime.value = options.start;
		endtime.value = options.end;
		state.value = options.state;
	});
</script>
<style scoped lang="scss">
	.infoDetail-container {
		padding-bottom: 30rpx;
	}

	.btn {
		color: #095b2b;
		line-height: 200rpx;
		border: 4rpx solid #095b2b;
	}

	.flex_row {
		display: flex;
		align-items: center;
		font-size: 28rpx !important;
	}
	.c_red {
		color: red;
	}
	.c_o{
		olor: #eb6120;
	}
</style>
