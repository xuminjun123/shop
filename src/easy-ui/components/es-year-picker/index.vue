<!-- 年份选择器 -->

<template>
  <view class="content">
    <picker
      mode="multiSelector"
      @change="bindPickerChange"
      :value="multiIndex"
      :range="multiArray"
    >
      <view class="time-season">
        <text>季度选择：</text>
        <text>
          <text>{{ multiArray[0][multiIndex[0]] }}年 </text>
          <text>{{ multiArray[1][multiIndex[1]] }}</text>
        </text>
      </view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    const yearArr = this.handleYear();
    return {
      multiArray: [yearArr],
      multiIndex: [this.handleYear(true), 0],
    };
  },
  onLoad() {},
  methods: {
    // 处理年份。
    handleYear(nowYearIndex) {
      let optionsArray = [];
      let years = new Date().getFullYear();
      for (let i = years - 5; i <= years + 5; i++) {
        let option = i;
        optionsArray.push(option);
      }
      if (nowYearIndex) {
        return optionsArray.indexOf(years);
      }
      return optionsArray;
    },
    // 确认选择时间
    bindPickerChange: function (e) {
      this.multiIndex = e.detail.value;
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 200rpx;
}
.time-season {
  color: #000;
  font-size: 36rpx;
}
</style>
