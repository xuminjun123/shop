<!--
 * @Description: 
 * @param : 
 * @return: 
 * @Author: xmj
 * @Date: 2022-06-20 15:50:43
-->
<template>
  <view style="text-align: center">
    <swiper
      :current="currentIndex"
      class="swiper"
      @change="swiperTab"
      :interval="3000"
      :duration="1000"
      :circular="true"
      :previous-margin="previous_next"
      :next-margin="previous_next"
    >
      <swiper-item v-for="(item, index) in imageList" :key="index">
        <view class="swiper-item"
          ><image
            :src="item"
            class="swiper-itemImage"
            :class="currentIndex === index ? 'swiperItemActive' : ''"
          ></image
        ></view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0, // 当前显示图片
      previous_next: "60rpx", // 前后边距
      imageList: [
        // "../../static/1.jpeg",
        // "../../static/2.jpeg",
        // "../../static/3.jpeg",
        // "../../static/4.jpeg",
        // "../../static/5.jpeg",
      ],
    };
  },
  methods: {
    swiperTab(e) {
      this.currentIndex = e.detail.current;
    },
  },
};
</script>

<style>
.swiper {
  width: 100%;
  height: 904rpx;
  position: absolute;
}
.swiper-itemImage {
  position: relative;
  top: 0;
  margin-top: 34rpx;
  width: 606rpx;
  height: 836rpx;
  border-radius: 24rpx;
}
</style>
