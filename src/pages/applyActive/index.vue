<!--
 * @Description: 参加预约n
   先查看有无预约信息
    有: info 组件
    无: 新增预约
 * @Author: xmj
 * @Date: 2023-04-12 14:57:26
-->
<template>
	<view v-if="code === 0">
		<view class="pb-2">
			<view class="apply-wrapper">
				<view style="padding: 0rpx 60rpx">
					<cover-image :src="logo" />
				</view>
				<view class="profile-text-box">
					<text class="profile-text">
						山塘雕花楼美术馆是一家致力于文化艺术推广的民营美术馆。未来它将秉承创新的理念，推动展览、典藏、学术、公共教育等，力图发掘有创造性的艺术家，通过多样化的形式为大众传播优秀的艺术作品与生活方式
					</text>
				</view>
				<view class="w-full mt-5 text-xl text-center" style="color: #095b2b">
					暂无展示活动
				</view>
			</view>
		</view>
	</view>
	<view v-if="code === 1">
		<view class="w-11/12 p-2 mx-auto mt-2 mb-4 bg-white" style="border: 1px solid #095b2b; border-radius: 8rpx"
			v-for="item in applyDataList" @click="navApplyDetil(item)" :key="item.id">
			<view>
				<view class=""> <img :src="item.img" mode="widthFix" /> </view>
				<view class="py-1 pl-1 text-sm"> {{ item.title }}</view>
				<view class="pb-1 pl-1 text-xs" style="color: #eb6120">
					活动时间: {{ item.starttime }}至{{ item.endtime }}</view>
				<view class="pb-1 pl-1 text-xs" style="color: #eb6120">
					活动地点: {{ item.artdata.address }}</view>
				<view class="flex justify-between items-center  w-full py-1 pl-1 text-sm">
					<view class="w-[150rpx] text-center state hei" :style="item.typecode==0?'':'background:red;'">
						{{item.typecode==0?"免费活动":"付费活动"}}
					</view>
					<!-- @click.stop="nav(item.id)" -->
					<view v-if="item.userdata && item.userdata.qrcode">
						<img :src="qrcodeImg" class="w-[60rpx] h-[60rpx]" alt="" @click.stop="nav(item.id)" />
					</view>
					<view v-else>
						<view v-if="item.state == '预约已满'" class="w-[150rpx] text-center stateno">
							预约已满
						</view>
						<view v-if="item.state == '可预约'" class="w-[150rpx] text-center state">
							可预约
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

	<!-- 管理员扫码 -->
	<view v-if="code === 2" class="sign_box">
		<!-- <tm-button label="扫码" block color="baseColor" @click="scan()"></tm-button> -->
		<view @click="scan()" class="sign">扫码</view>
	</view>
	<!-- 消息提示 -->
	<tm-notification :placement="placement" ref="msg" label="提示" icon="tmicon-info-circle"></tm-notification>
</template>
<script lang="ts" setup>
	import {
		onMounted,
		ref
	} from "vue";
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		http
	} from "@/utils/http";
	import tmNotification from "@/tmui/components/tm-notification/tm-notification.vue";
	import {
		useUserStore
	} from "@/store/modules/user";
	import {
		showErrorToast,
		showToast
	} from "@/utils/toast";
	import logo from "@/assets/logo.jpeg";
	import qrcodeImg from "@/assets/qrcode.png";
	// const userStore = useUserStore();
	const msg = ref<InstanceType<typeof tmNotification> | null>(null);
	const placement = ref("top");

	const code = ref(4); // 0: 无预约 1显示预约数据 2:管理员 显示扫码框
	// code == 1; 预约数据
	interface IData {
		id : number;
		title : string;
		img : string;
		state : string;
		starttime : string;
		endtime : string;
		userdata : null | Object;
		artdata : {
			address : string;
			phone : string;
		};
	}
	const applyDataList = ref<IData[]>([]);

	function scan() {
		console.log(122)
		uni.scanCode({
			success: (res) => {
				const {
					result
				} = res; // 二维码内容
				console.log("result");
				http
					.post(`Appointment/userAppointmentCheck`, {
						qrcode: result,
					})
					.then((res) => {
						console.log(res, "reswwss")
						setTimeout(() => {
							uni.showToast({
								title: res?.message ?? "核销成功",
								icon: 'none',
								duration: 3000
							})
						}, 500);
						if (res.code == 1) {
							// showToast(res?.message ?? "核销成功");
							// setTimeout(() => {
							// scan();
							// }, 1000);
						}
					});
			},
			fail: (err) => {
				showErrorToast("扫码失败");
				// setTimeout(() => {
				// scan();
				// }, 1000);
			},
		});
	}

	// 获取预约信息
	async function getApplyData() {
		const userStore = useUserStore();
		const res = await http.post("Appointment/userAppointment", {
			openid: userStore.getOpenId,
		});
		code.value = res.code;
		console.log()
		let list = res?.data || []
		// 显示预约界面 
		//typecode 0 = 免费活动 1 = 付费活动 
		if (list.length > 0) {
			list.forEach((item, indx) => {
				item.typecode = item.price.includes("免费") ? 0 : 1;
			})
		}
		switch (code.value) {
			case 0:
				break;
			case 1:
				// 显示预约列表
				applyDataList.value = res.data;
				break;
			case 2:
				// 管理员 显示扫码框
				// scan();
				break;
		}
	}

	const navApplyDetil = (item : any) => {
		console.log(item, "itemitem")
		// 无预约数据  预约已满  不可点
		if (!item.userdata && item.state == "预约已满") {
			showToast("预约已满");
			return;
		}

		// 无预约数据  可预约 可点
		if (!item.userdata && item.state == "可预约") {
			uni.navigateTo({
				url: `/pages/applyInfo/index?id=${item.id}&start=${item.starttime}&end=${item.endtime}&state=${item.state}`,
			});
			return;
		}

		// 有预约数据  未到进场时间  预约已满  活动右下角显示二维码图标 但是点进去 二维码位置显示  未到预约进场时间
		if (
			item.userdata &&
			item.userdata.qrcodemsg == "未到预约进场时间" &&
			item.state == "预约已满"
		) {
			uni.navigateTo({
				url: `/pages/applyInfo/index?id=${item.id}&start=${item.starttime}&end=${item.endtime}&state=${item.state}`,
			});
			return;
		}

		// 有预约数据  未到进场时间  可预约  活动右下角显示二维码图标 但是点进去 二维码位置显示  未到预约进场时间
		if (
			item.userdata &&
			item.userdata.qrcodemsg == "未到预约进场时间" &&
			item.state == "可预约"
		) {
			uni.navigateTo({
				url: `/pages/applyInfo/index?id=${item.id}&start=${item.starttime}&end=${item.endtime}&state=${item.state}`,
			});
			return;
		}

		// 有预约数据  可预约  活动右下角可显示二维码  显示二维码图标 点进去 二维码位置显示二维码
		if (
			item.userdata &&
			item.userdata.qrcodemsg == "显示二维码" &&
			item.state == "可预约"
		) {
			uni.navigateTo({
				url: `/pages/applyInfo/index?id=${item.id}&start=${item.starttime}&end=${item.endtime}&state=${item.state}`,
			});
			return;
		}
	};

	// 查看预约时间
	const nav = (id) => {
		uni.navigateTo({
			url: `/pages/applyDetail/index?id=${id}`,
		});
	};
	onShow(() => {
		getApplyData();
	});
	onMounted(() => {
		// getApplyData();
	});
</script>
<style lang="scss" scoped>
	.form-item {
		border-bottom: 1rpx #ccc solid;
	}

	.bor {
		border: 1px solid #095b2b;
		background-color: white;
		border-radius: 8rpx;
	}

	.apply-wrapper {
		width: 100vw;
		height: 100vh;
		background-color: white;

		.btn {
			color: #095b2b;
			line-height: 200rpx;
			border: 4rpx solid #095b2b;
		}

		.profile-text-box {
			padding: 10rpx 30rpx;
		}

		.profile-text {
			text-indent: 20rpx;
			font-size: 24rpx;
		}
	}

	.state {
		border: 1px solid #ccc;
		border-radius: 10rpx;
		display: inline-block;
		color: white;
		font-size: 24rpx;
		width: 150rpx;
		background-color: #095b2b;
		@apply text-center;
	}

	.stateno {
		border: 1px solid #ccc;
		border-radius: 10rpx;
		display: inline-block;
		color: white;
		font-size: 24rpx;
		width: 150rpx;
		background-color: #ccc;
		@apply text-center;
	}

	.showqrcode {
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: black;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mar_bottom {
		margin-bottom: 20rpx;
	}

	.hei {
		max-height: 46rpx;
	}

	.sign {
		width: 250rpx;
		height: 250rpx;
		border-radius: 50%;
		background: linear-gradient(#7AA2FF, #3670F5);
		font-size: 34rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sign_box {
		width: 100%;
		height: 50vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>