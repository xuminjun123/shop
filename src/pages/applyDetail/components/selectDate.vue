<!--
 * @Description: 
 * @Author: xmj
 * @Date: 2023-04-14 16:22:49
-->
<template>
	<view>
		<view class="w-11/12 pb-4 mx-auto bg-white">
			<uni-section title="选择入馆日期1" type="line">
				<template v-slot:right>
					<text style="color: #095b2b"> {{ months }}月 </text>
				</template>
			</uni-section>
			<view class="flex justify-between w-full pb-1 bg-white">
				<tm-grid :width="690" :col="7">
					<tm-grid-item :key="item" v-for="item in weeks" class="text-center">
						<tm-text :label="item"></tm-text>
					</tm-grid-item>

					<tm-grid-item v-for="(item, index) in emptyDiv" :key="index" :height="130">
						<tm-text label=""></tm-text>
					</tm-grid-item>

					<tm-grid-item v-for="(item, index) in days" :key="index" :height="130"
						@click="selectApplyDate(item, index)">
						<view class="py-2 my-1 text-center" :class="[
                select - emptyDiv === index ? 'select' : '',
                item.day ? 'label-bor' : '',
              ]">
							<text class="inline-block px-2 pt-1 text-xs"
								:class="label(item.day) == '今' ? 'todayClass' : ''">
								{{ label(item.day) }}
							</text>
							<text class="inline-block pb-1 text-xs"
								:class="labelDateHas(item.has, item) === '有票' ? 'has' : 'no'">
								{{ labelDateHas(item.has, item) }}
							</text>
						</view>
					</tm-grid-item>
				</tm-grid>
			</view>

			<!-- 如果有下月份 -->
			<view v-if="days.length">
				<uni-section title="选择入馆日期2" type="line">
					<template v-slot:right>
						<text style="color: #095b2b"> {{ nextMonths }}月 </text>
					</template>
				</uni-section>
				<view class="flex justify-between w-full pb-1 bg-white">
					<tm-grid :width="690" :col="7">
						<!-- <tm-grid-item :key="item" v-for="item in weeks" class="text-center">
              <tm-text :label="item"></tm-text>
            </tm-grid-item> -->

						<tm-grid-item v-for="(item, index) in nextEmptyDiv" :key="index" :height="130">
							<tm-text label=""></tm-text>
						</tm-grid-item>

						<tm-grid-item v-for="(item, index) in nextDays" :key="index" :height="130"
							@click="nextSelectApplyDate(item, index)">
							<view class="py-2 my-1 text-center" :class="[
                  nextSelect - nextEmptyDiv === index ? 'select' : '',
                  item.day ? 'label-bor' : '',
                ]">
								<text class="inline-block px-2 pt-1 text-xs"
									:class="label(item.day) == '今' ? 'todayClass' : ''">
									{{ label(item.day) }}
								</text>
								<text class="inline-block pb-1 text-xs" :class="
                    labelDateHas(item.has, item) === '有票' ? 'has' : 'no'
                  ">
									{{ labelDateHas(item.has, item) }}
								</text>
							</view>
						</tm-grid-item>
					</tm-grid>
				</view>
			</view>
		</view>

		<!-- 时间段 -->
		<view class="w-11/12 mx-auto mt-3 bg-white">
			<uni-section title="选择入馆时间" type="line" />
			<view class="flex justify-between w-full pb-3 bg-white" v-if="isCurrernt">
				<template v-for="item in days" :key="item.day">
					<view v-if="item.day == selectId">
						<tm-grid :width="690" :col="3">
							<tm-grid-item v-for="(dataItem, index) in item.data" :key="index" :height="160"
								@click="selectTimeQuantum(dataItem, index)"
								:class="dataItem.countNum>=showPeoplenum?'':'disabled'">
								<view class="my-1 text-center px-7 label-bor has"
									:class="selectDate === index ? 'select' : ''">
									<view class="py-3 text-xs text-center">
										{{ `${dataItem.hour}点场` }}
									</view>

									<view class="pb-3 text-xs" v-if="dataItem.countNum>=showPeoplenum">
										{{ `${dataItem.num}` }}
									</view>
									<view class="pb-3 text-xs" v-else>
										无票
									</view>
								</view>
							</tm-grid-item>
						</tm-grid>
					</view>
				</template>
			</view>

			<view>
				<template v-for="item in nextDays" :key="item.day">
					<view v-if="item.day == selectId">
						<tm-grid :width="690" :col="3">
							<tm-grid-item v-for="(dataItem, index) in item.data" :key="index" :height="160"
								:class="dataItem.countNum>=showPeoplenum?'':'disabled'"
								@click="nextSelectTimeQuantum(dataItem, index)">
								<view class="my-1 text-center px-7 label-bor has"
									:class="selectDate === index ? 'select' : ''">
									<view class="py-3 text-xs text-center">
										{{ `${dataItem.hour}点场` }}
									</view>

									<view class="pb-3 text-xs">
										{{ `${dataItem.num}` }}
									</view>
								</view>
							</tm-grid-item>
						</tm-grid>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { onMounted, ref } from "vue";
	import { http } from "@/utils/http";
	import { formatDate } from "@/utils/formatDate";
	// import { mockData } from "./mockData";
	import { showToast } from "@/utils/toast";
	const props = defineProps({
		activeId: {
			type: String,
		},
		// 收费预定人数
		showPeoplenum: {
			type: Number,
			default: 0
		},
		// 收费预定类型
		applyShowType: {
			type: String,
			default: ""
		}
	});

	const emits = defineEmits(["sendSelectDate", "sendSelectTime"]);

	const isCurrernt = ref(true);

	const emptyDiv = ref(0);
	const nextEmptyDiv = ref(0); // 下个月空div

	const select = ref(1);
	const nextSelect = ref(1);
	const selectId = ref(""); // 选中的id

	const selectDate = ref<number | null>(null);
	const selectDateId = ref(""); // 选中的id

	// 确定时间
	const weeks = ["一", "二", "三", "四", "五", "六", "日"];
	// 当月
	const days = ref<
		{
			day : string;
			week : string;
			has : string;
			data : { hour : number; num : string }[];
		}[]
	>([]);
	// 下月
	const nextDays = ref<
		{
			day : string;
			week : string;
			has : string;
			data : { hour : number; num : string }[];
		}[]
	>([]);

	const label = (day : string) => {
		const data = day.split("-");
		if (!day) return "";
		if (days.value[0].day === day) {
			return "今";
		}
		return `${data[2]}` ? ` ${data[2]} ` : "";
	};

	const labelDateHas = (has : string, item : any) => {
		if (item.week == "一") {
			return "闭馆";
		}
		return has ? has : "";
	};

	// 选择日期
	const selectApplyDate = (item : any, index : number) => {
		isCurrernt.value = true;
		if (selectId.value == item.day) return;
		if (item.week == "一") {
			showToast("周一闭馆");
			return;
		}
		console.log(item, "item");
		selectId.value = item.day;
		nextSelect.value = 0;
		select.value = index + emptyDiv.value;

		selectDate.value = null;
		selectDateId.value = "";

		emits("sendSelectDate", selectId.value);
		emits("sendSelectTime", selectDateId.value);
	};

	const nextSelectApplyDate = (item : any, index : number) => {
		console.log("nextSelectApplyDate-->", item, index);

		isCurrernt.value = false;

		if (item.week == "一") {
			showToast("周一闭馆");
			return;
		}
		console.log(item, "itema");
		selectId.value = item.day;
		// select.value = index + nextEmptyDiv.value;
		select.value = 0;
		nextSelect.value = index + nextEmptyDiv.value;;
		selectDate.value = null;
		selectDateId.value = "";

		emits("sendSelectDate", selectId.value);
		emits("sendSelectTime", selectDateId.value);
	};

	const selectTimeQuantum = (item : any, index : number) => {
		selectDate.value = index;
		selectDateId.value = item.hour;
		emits("sendSelectTime", selectDateId.value);
		console.log(item, "itemitem")
		emits("sendSelectCount", item.countNum);
	};

	const nextSelectTimeQuantum = (item : any, index : number) => {
		selectDate.value = index;
		selectDateId.value = item.hour;

		emits("sendSelectTime", selectDateId.value);
	};

	const weeksTypes = {
		0: "日",
		1: "一",
		2: "二",
		3: "三",
		4: "四",
		5: "五",
		6: "六",
	} as { [key : number] : string };

	const months = ref(0);
	const nextMonths = ref(0);

	async function getAppointmentDay() {
		const date = new Date();

		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		months.value = month; // 月份
		nextMonths.value = ((date.getMonth() + 1) % 12) + 1;

		// 创建一个 Date 对象来表示当前日期
		let currentDate = new Date();

		// 获取当前月份的下一个月的第一天
		let nextMonthFirstDay = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			1
		);

		// 使用下一个月的第一天的前一天作为当前月份的最后一天
		let lastDay = new Date(
			nextMonthFirstDay.getFullYear(),
			nextMonthFirstDay.getMonth(),
			0
		);

		// 获取最后一天的日期和星期几
		let monthLastDay = lastDay.getDate();

		// 最后一天的年月日
		const monthOfDay = `${year}-${month > 10 ? `${month}` : `0${month}`
			}-${monthLastDay}`;

		http
			.post("Appointment/userAppointmentDay", {
				id: props.activeId,
			})
			.then((res : any) => {
				// console.log("res->>", res);

				const daysRes = Object.keys(res);
				// 包含最后一天， 最一天分割数组
				if (daysRes.includes(monthOfDay)) {
					const splitIndex = daysRes.indexOf(monthOfDay) + 1;
					const firstPart = daysRes.slice(0, splitIndex);
					const secondPart = daysRes.slice(splitIndex);
					// // 判断那天是否有票
					days.value = firstPart.map((item, index : any) => {
						let week = new Date(item).getTime();
						const resItem = res[item];
						return {
							day: item,
							week: weeksTypes[new Date(week).getDay()],
							has: resItem.msg,
							data: resItem.data,
						};
					});

					nextDays.value = secondPart.map((item, index : any) => {
						let week = new Date(item).getTime();
						const resItem = res[item];

						return {
							day: item,
							week: weeksTypes[new Date(week).getDay()],
							has: resItem.msg,
							data: resItem.data,
						};
					});

					// // // 算第一条数据是周几
					const fistDataWeek = days.value[0].week;
					const index = weeks.findIndex((item) => {
						return item === fistDataWeek;
					});
					emptyDiv.value = index;
					select.value = index;
					selectId.value = days.value[0].day;

					// 下一个月份的第一条数据是周几
					const nextFistDataWeek = nextDays.value[0].week;
					const nextIndex = weeks.findIndex((item) => {
						return item === nextFistDataWeek;
					});
					nextEmptyDiv.value = nextIndex;

					emits("sendSelectDate", selectId.value);
				} else {
					console.log("->>>,不包含");
					// 判断那天是否有票
					days.value = daysRes.map((item, index : any) => {
						let week = new Date(item).getTime();
						const resItem = res[item];

						return {
							day: item,
							week: weeksTypes[new Date(week).getDay()],
							has: resItem.msg,
							data: resItem.data,
						};
					});
					// // 算第一条数据是周几
					const fistDataWeek = days.value[0].week;
					const index = weeks.findIndex((item) => {
						return item === fistDataWeek;
					});
					emptyDiv.value = index;
					select.value = index;
					selectId.value = days.value[0].day;
					emits("sendSelectDate", selectId.value);
				}

				// // 判断那天是否有票
				// days.value = daysRes.map((item, index: any) => {
				//   let week = new Date(item).getTime();
				//   console.log("week-->>>>>", week, new Date(week).getDay());

				//   const resItem = res[item];

				//   return {
				//     day: item ? item : "",
				//     week: item ? weeksTypes[new Date(week).getDay()] : "",
				//     has: item ? resItem.msg : "",
				//     data: item ? resItem.data : [],
				//     // isEmpty:
				//   };
				// });

				// console.log("days-->>", days.value);
				// // // 档月份最后一天是，几号，周几

				// // // 算第一条数据是周几 4-20 周一
				// const fistDataWeek = days.value[0].week;
				// const index = weeks.findIndex((item) => {
				//   return item === fistDataWeek;
				// });
				// emptyDiv.value = index;
				// select.value = index;
				// selectId.value = days.value[0].day;
				// emits("sendSelectDate", selectId.value);
			});
	}
	onMounted(async () => {
		await getAppointmentDay();
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

	.todayClass {
		color: #f77709;
	}

	.disabled {
		pointer-events: none;
		color: gray !important;
	}
</style>