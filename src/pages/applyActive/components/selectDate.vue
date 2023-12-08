<!--
 * @Description: 
 * @Author: xmj
 * @Date: 2023-04-14 16:22:49
-->
<template>
  <view class="w-11/12 mx-auto bg-white">
    <uni-section title="选择入馆时间" type="line">
      <template v-slot:right>
        <text class="text-blue-500"> 4月 </text>
      </template>
    </uni-section>
    <view class="flex justify-between w-full pb-3 bg-white">
      <tm-grid :width="690" :col="7">
        <tm-grid-item :key="item" v-for="item in weeks" class="text-center">
          <tm-text :label="item"></tm-text>
        </tm-grid-item>

        <tm-grid-item
          v-for="(item, index) in emptyDiv"
          :key="index"
          :height="130"
        >
          <tm-text label=""></tm-text>
        </tm-grid-item>
        <tm-grid-item
          v-for="(item, index) in days"
          :key="index"
          :height="130"
          @click="selectApplyDate(item, index)"
        >
          <view
            class="py-2 my-1 text-center label-bor"
            :class="select - emptyDiv === index ? 'select' : ''"
          >
            <text
              class="p-2 text-xs"
              :class="labelHas(item.has) === '有票' ? 'text-black' : 'no'"
            >
              {{ label(item.day) }}
            </text>
            <text
              class="pb-4 text-xs"
              :class="labelHas(item.has) === '有票' ? 'has' : 'no'"
            >
              {{ labelHas(item.has) }}</text
            >
          </view>
        </tm-grid-item>
      </tm-grid>
    </view>
  </view>

  <!-- 时间段 -->
  <view class="w-11/12 mx-auto mt-3 bg-white">
    <uni-section title="选择入馆时间" type="line" />
    <view class="flex justify-between w-full pb-3 bg-white">
      <tm-grid :width="690" :col="3">
        <tm-grid-item
          v-for="(item, index) in dates"
          :key="index"
          :height="160"
          @click="selectTimeQuantum(item, index)"
        >
          <view
            class="my-1 text-center label-bor"
            :class="selectDate === index ? 'select' : ''"
          >
            <view
              class="p-3 text-xs"
              :class="labelHas(item.has) === '有票' ? 'text-black' : 'no'"
            >
              {{ item.time }}
            </view>
            <view
              class="pb-3 text-xs"
              :class="labelHas(item.has) === '有票' ? 'has' : 'no'"
            >
              {{ labelDateHas(item.has) }}</view
            >
          </view>
        </tm-grid-item>
      </tm-grid>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { format } from "date-fns";
const emptyDiv = ref(0);
const select = ref(1);
const selectId = ref(""); // 选中的id

const selectDate = ref<number | null>(null); // 选中时间段有票的
const selectDateId = ref(""); // 选中的id

// 确定时间
const weeks = ["一", "二", "三", "四", "五", "六", "日"];
const days = ref([
  {
    day: "2023-04-13",
    week: "星期四",
    has: "",
  },
  {
    day: "2023-04-14",
    week: "星期五",
    has: "",
  },
  {
    day: "2023-04-15",
    week: "星期六",
    has: "",
  },
  {
    day: "2023-04-16",
    week: "星期日",
    has: "",
  },
  {
    day: "2023-04-17",
    week: "星期一",
    has: "",
  },
  {
    day: "2023-04-18",
    week: "星期二",
    has: "",
  },
  {
    day: "2023-04-19",
    week: "星期三",
    has: "",
  },
  {
    day: "2023-04-20",
    week: "星期四",
    has: "有票",
  },
  {
    day: "2023-04-21",
    week: "星期五",
    has: "有票",
  },
]);

// 时间段
const dates = ref([
  {
    time: "09:00-10:00",
    has: "",
  },
  {
    time: "09:00-10:00",
    has: "",
  },
  {
    time: "09:00-10:00",
    has: "",
  },
  {
    time: "09:00-10:00",
    has: "有票",
  },
  {
    time: "09:00-10:00",
    has: "有票",
  },
  {
    time: "09:00-10:00",
    has: "有票",
  },
]);

const label = (day: string) => {
  const data = day.split("-");
  return data[2];
};

const labelHas = (has: string) => {
  const data = has ? "有票" : "无票";
  return data;
};

// 选择日期
const selectApplyDate = (item: any, index: number) => {
  if (!item.has) {
    return;
  }
  console.log("index");
  select.value = index + emptyDiv.value;
  selectId.value = item.day;
};

const labelDateHas = (has: string) => {
  const data = has ? "有票" : "预约已满";
  return data;
};

const selectTimeQuantum = (item: any, index: number) => {
  if (!item.has) {
    return;
  }

  selectDate.value = index;
  selectDateId.value = item.time;
};

const weeksTypes = {
  0: "日",
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
} as { [key: number]: string };
function getDayInfo() {
  const date = new Date();
  const week = date.getDay(); // 周几 0-6 0: 周日
  const weekInfo = weeksTypes[week];
  const index = weeks.findIndex((item) => {
    return item === weekInfo;
  });
  emptyDiv.value = index;
  emptyDiv.value = index;
  // 找到第一个有票的数据的下标
  const hasData = days.value.findIndex((item) => {
    return item.has === "有票";
  });
  // 找到第一个有票的数据
  const hasDataObj = days.value.find((item) => {
    return item.has === "有票";
  });

  select.value = hasData + emptyDiv.value;
  selectId.value = hasDataObj ? hasDataObj.day : "";

  // 找到第一个有票的时间段数据的下标
  const hasDate = dates.value.findIndex((item) => {
    return item.has === "有票";
  });
  const hasDateObj = dates.value.find((item) => {
    return item.has === "有票";
  });
  selectDate.value = hasDate;
  selectDateId.value = hasDateObj ? hasDateObj.time : "";
}

onMounted(() => {
  // 获取
  getDayInfo();
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
</style>
