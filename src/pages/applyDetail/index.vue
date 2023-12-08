<!--
 * @Description: 参加预约
   先查看有无预约信息
    code 判断  1是有预约（显示 出示二维码 按钮 和修改预约取消预约三个按钮），0是无预约（显示  添加预约 按钮）
 * @Author: xmj
 * @Date: 2023-04-12 14:57:26
-->
<template>
	<view>
		<Detail :info="appointmentdata" :activeId="id" :applyCount="applyCount" :applyType="applyType" :pricedata="pricedata" @reset="reset"
			@reload="getDetail(id)" :orderid="orderid" :showPeoplenum="showPeoplenum" :applyShowType="applyShowType"/>
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
		reactive,
		ref
	} from "vue";
	import Detail from "./components/detail.vue";
	import {
		useUserStore
	} from "@/store/modules/user";
	const userStore = useUserStore();
	const appointmentdata = reactive({
		id: 0,
		openid: "",
		user_name: "",
		user_phone: "",
		qrcode: "",
		applytime: "",
		code: 0, // 判断是否有预约
		address: "", // 美术馆地址
		phone: "", // 美术馆电话
		applytimeexplain: "",
		applytypeStr:"",//预约类型
		qrcodemsg: "",
	});
	const reset = () => {
		console.log("log->>");
	};
	const code = ref(0);
	const id = ref("");
	const applyCount = ref(0);
	const applyType = ref(0);
	const orderid = ref("");
	const showPeoplenum = ref('');
	const applyShowType = ref(0);
	const pricedata = reactive({
		family: "",
		group: "",
		single: ""
	});
	const openid = userStore.openId;
	// 获取活动详情
	function getDetail(id: string) {
		http
			.post("Appointment/userAppointmentDisplay", {
				id,
				openid,
			})
			.then((res: any) => {
				code.value = res.code;
				appointmentdata.id = res.userdata?.id ?? 0;
				appointmentdata.openid = res.userdata?.openid ?? "";
				appointmentdata.user_name = res.userdata?.user_name ?? "";
				appointmentdata.user_phone = res.userdata?.user_phone ?? "";
				appointmentdata.qrcode = res.userdata.qrcode;
				appointmentdata.applytime = res.userdata?.applytime ?? "";
				appointmentdata.code = res.userdata.code;
				appointmentdata.applytypeStr = res.userdata.applytypeStr;
				appointmentdata.applytimeexplain = res.userdata.applytimeexplain;
				appointmentdata.qrcodemsg = res.userdata?.qrcodemsg ?? "";
				applyCount.value = res.appointmentdata.applyCount;
				applyType.value = res.appointmentdata.price.includes("免费") ? 0 : 1;
				pricedata.value = res.appointmentdata.pricedata;
				appointmentdata.address = res.artdata.address;
				appointmentdata.phone = res.artdata.phone;
				orderid.value = res.userdata.orderid;
				applyShowType.value = res.userdata.applytype;
				showPeoplenum.value = res.userdata.peoplenum;
			});
	}
	onLoad((options: any) => {
		getDetail(options.id);
		id.value = options.id;
	});
</script>
<style lang="scss" scoped></style>
