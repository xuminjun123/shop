<!--
 * @Description: 预约信息  
 * @Author: xmj
 * @Date: 2023-04-12 14:57:26
-->
<template>
	<view>
		<view class="w-11/12 mx-auto mt-2 mb-4"> </view>
		<view v-if="info.code == 0">
			<AddApply :activeId="activeId" :applyCount="applyCount" :applyType="applyType" :pricedata="pricedata"></AddApply>
		</view>

		<view v-if="info.code == 1">
			<view v-if="showEdit">
				<view class="w-11/12 mx-auto bg-white">
					<view class="p-2 form-item">
						<view> 美术馆地址: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.address }}
						</view>
					</view>

					<view class="p-2 form-item">
						<view> 美术馆电话: </view>
						<view class="pt-2 text-sm text-gray-500"> {{ info.phone }} </view>
					</view>

					<view class="p-2 form-item">
						<view> 预约时间: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.applytimeexplain }}
						</view>
					</view>
					<view class="p-2">
						<view> 预约类型: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.applytypeStr }}
						</view>
					</view>
				</view>
				<!-- 二维码 -->
				<view class="flex items-center justify-center w-full mx-auto my-2" v-if="info.qrcodemsg == '显示二维码'">
					<tm-qrcode :option="{ size: 650, str: info.qrcode }" _class="mx-auto"></tm-qrcode>
				</view>
				<view v-else>
					<view class="flex mt-5">
						<view class="px-5 mx-auto btn">{{ info.qrcodemsg }}</view>
					</view>
				</view>

				<view class="flex justify-between w-11/12 mx-auto">
					<view class="flex-1 mr-2">
						<tm-button :shadow="0" text form-type="reset" label="取消预约" block color="baseColor"
							@click="resetApply"></tm-button>
					</view>
					<view class="flex-1">
						<tm-button form-type="submit" label="修改预约" block color="baseColor" @click="submitSaveApply">
						</tm-button>
					</view>
				</view>
			</view>
			<!-- 修改预约 -->
			<view v-else>
				<SelectDate :activeId="activeId" @sendSelectDate="sendSelectDate" @sendSelectTime="sendSelectTime" :showPeoplenum="showPeoplenum" :applyShowType="applyShowType">
				</SelectDate>

				<view class="flex justify-between w-11/12 mx-auto">
					<view class="flex-1 mr-2">
						<tm-button :shadow="0" text label="取消" block color="baseColor" @click="showEdit = true">
						</tm-button>
					</view>
					<view class="flex-1">
						<tm-button form-type="submit" label="修改预约" block color="baseColor" @click="submitApply">
						</tm-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from "vue";
	import AddApply from "./addApply.vue";
	import {
		format
	} from "date-fns";
	import SelectDate from "./selectDate.vue";
	import {
		http
	} from "@/utils/http";
	import {
		showToast
	} from "@/utils/toast";
	const props = defineProps({
		info: {
			type: Object,
			default: () => {},
		},
		// 活动id
		activeId: {
			type: String,
			default: "",
		},
		// 余票数量
		applyCount: {
			type: Number,
			default: 0
		},
		//预约类型 0 免费 1收费
		applyType: {
			type: Number,
			default: 0
		},
		//门票价格
		pricedata:{
			type: Object,
			default: {}
		},
		//订单id
		orderid:{
			type: String,
			default: ""
		},
		// 收费预定人数
		showPeoplenum:{
			type: Number,
			default: 0
		},
		// 收费预定类型
		applyShowType:{
			type: String,
			default: ""
		}
	});
	const showEdit = ref(true); // 显示信息
	const emits = defineEmits(["reset", "reload"]);
	// 取消预约
	const resetApply = async () => {
		//先判断是什么类型的预约，如果要收费，就得先调用退款接口
		if(props.applyType == 1) {
			const Refunded = await http.post(`Order/orderRefunded`, {
				orderid: props.orderid,
				type:1,
				trackingnumber_back:""
			});
		}
		const res = await http.post(`Appointment/userAppointmentDel`, {
			id: props.info.id,
		});
		if (res.code == 1) {
			showToast(res.message);
			setTimeout(() => {
				uni.switchTab({
					url: "/pages/applyActive/index"
				});
			}, 1200);
		}
	};

	// 修改预约
	const submitApply = async () => {
		if (!selectDate2.value) {
			showToast("请选择日期");
			return;
		}
		if (!selectTime2.value) {
			showToast("请选择时间段");
			return;
		}
		const _selectDate = selectDate2.value.replace(/-/g, "/");
		const applytime2 = `${_selectDate} ${selectTime2.value}:00`;

		const dateTime = new Date(applytime2).getTime();
		const res = await http.post(`Appointment/userAppointmentEdit`, {
			id: props.info.id,
			applytime: dateTime / 1000,
		});
		if (res.code == 1) {
			showToast(res.message);
			emits("reload");
			showEdit.value = true;
		} else {
			showToast(res.message);
		}
	};

	// 保存修改
	const submitSaveApply = () => {
		showEdit.value = false;
	};

	const selectDate2 = ref("");
	const selectTime2 = ref("");
	const sendSelectDate = (e: any) => {
		selectDate2.value = e;
	};
	const sendSelectTime = (e: any) => {
		selectTime2.value = e;
	};
	onMounted(() => {});
</script>
<style lang="scss" scoped>
	.form-item {
		border-bottom: 1rpx #ccc solid;
	}

	.label-bor {
		border: 1px solid #ccc;
		border-radius: 8rpx;
	}

	.item-text {
		padding: 5rpx;
	}

	.has {
		color: #88dbd3;
	}

	.no {
		color: #c4c4c2;
	}

	.select {
		border: 1px solid #f77709;
		background-color: #f8eee2;
	}

	.btn {
		color: #095b2b;
		line-height: 200rpx;
		border: 4rpx solid #095b2b;
		border-radius: 10rpx;
	}
</style>
