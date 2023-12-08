<!--
 * @Description: 
 * @Author: xmj
 * @Date: 2023-04-25 19:40:45
-->
<template>
	<view class="pb-6">
		<view>
			<view>
				<view class="w-11/12 mx-auto mt-2 bg-white">
					<view class="p-2 form-item">
						<view> 美术馆地址: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.artdata.address }}
						</view>
					</view>

					<view class="p-2 form-item">
						<view> 美术馆电话: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.artdata.phone }}
						</view>
					</view>

					<view class="p-2">
						<view> 预约时间: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.userdata.applytimeexplain }}
						</view>
					</view>
					<view class="p-2 form-item">
						<view> 预约类型: </view>
						<view class="pt-2 text-sm text-gray-500">
							{{ info.userdata.applytypeStr }}
						</view>
					</view>
				</view>
				<!-- 二维码 -->
				<view class="flex items-center justify-center w-full mx-auto my-2"
					v-if="info.userdata.qrcodemsg == '显示二维码'">
					<tm-qrcode :option="{ size: 650, str: info.qrcode }" _class="mx-auto"></tm-qrcode>
				</view>
				<view v-else>
					<view class="flex mt-5">
						<view class="px-5 mx-auto btn">
							{{ info.userdata.qrcodemsg }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { computed, reactive, ref } from "vue";
	import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
	import { http } from "@/utils/http";

	function getAllData() {
		http
			.post("Users/getUserAppointmentDisplay", {
				appointmentid: id.value,
			})
			.then((res : any) => {
				console.log("res--->>", res);
				info.value = res;
				// list.value = res.data;
			});
	}

	const id = ref(0);

	const info = ref();
	onLoad((options : any) => {
		console.log("");
		id.value = Number(options.id);
	});

	onShow(() => {
		getAllData();
	});
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