<template>
  <view class="flex">
    <scroll-view
      scroll-y="true"
      style="width: 30%"
      :style="{ 'background-color': leftBgColor, 'font-size': leftFs + 'rpx' }"
    >
      <view
        v-for="(item, index) in viewList"
        class="flex py-20 pr-20 text-overflow align-center"
        @click="leftClick(index, item)"
        :class="activeIndex == index ? 'selected' : ''"
      >
        <view
          style="width: 8rpx; height: 50rpx"
          :style="{
            'background-color': activeIndex == index ? leftSelected : '',
          }"
        ></view>
        <view
          class="pl-20"
          :style="{ color: activeIndex == index ? leftSelectedColor : '' }"
        >
          {{ item.title }}
        </view>
      </view>
    </scroll-view>

    <scroll-view
      scroll-y="true"
      :scroll-with-animation="true"
      :scroll-into-view="position"
      style="width: 70%"
      @scroll="scroll_detail"
      :style="{
        height: scrollHeight + 'rpx',
        'background-color': rightBgColor,
        'font-size': rightFs + 'rpx',
      }"
    >
      <view
        v-for="(item, index) in viewList"
        :style="{
          'min-height':
            index == viewList.length - 1 ? scrollHeight + 5 + 'rpx' : '',
        }"
      >
        <view class="" :id="'sv-' + index">
          <view class="flex py-20 align-center" style="color: #999999">
            <view
              style="
                width: 10rpx;
                height: 10rpx;
                border-radius: 50%;
                background-color: #999999;
              "
              class="ml-20"
            ></view>
            <text class="ml-20">{{ item.title }}</text>
          </view>
          <view
            v-for="(it, idx) in item.list"
            @click="rightClick(it)"
            class="py-20 ml-20"
          >
            {{ it }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "gjs-scrollView",
  props: {
    //左右列表
    viewList: {
      type: Array,
      default: [],
    },
    //scroll-view的高度
    scrollHeight: {
      type: Number,
      default: 1200,
    },
    //左边区域的背景色
    leftBgColor: {
      type: String,
      default: "#F6F6F6",
    },
    //右边区域的背景色
    rightBgColor: {
      type: String,
      default: "#FFFFFF",
    },
    //左边区域的字体大小(最好不改)
    leftFs: {
      type: Number,
      default: 32,
    },
    // //右边区域的字体大小(最好不改)
    rightFs: {
      type: Number,
      default: 32,
    },
    //左边选中的颜色
    leftSelected: {
      type: String,
      default: "#FC4646",
    },
    leftSelectedColor: {
      type: String,
      default: "#FC4646",
    },
  },
  data() {
    return {
      activeIndex: 0,
      position: "sv-0",
      // leftFs: 32,
      // rightFs: 32,
      list: [],
    };
  },
  mounted() {
    this.list = [];
    this.list.push(0);
    for (let i = 0; i < this.viewList.length - 1; i++) {
      let vlist = this.viewList[i].list;
      let top = (vlist.length + 1) * 41 + this.list[i];
      this.list.push(top);
    }
    console.log(this.list);
  },
  methods: {
    leftClick(e, item) {
      this.activeIndex = e;
      this.position = "sv-" + e;
      this.$emit("leftClick", item.title);
    },
    rightClick(e) {
      this.$emit("rightClick", e);
    },
    scroll_detail(e) {
      let top = e.detail.scrollTop;
      for (let i = 0; i < this.list.length; i++) {
        if (i == this.list.length - 1 && top >= this.list[i]) {
          this.activeIndex = i;
        } else if (top >= this.list[i] && top < this.list[i + 1]) {
          this.activeIndex = i;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// @import url("./common.scss");
/* 加粗 */
.font-weight-bold {
  font-weight: bold;
}
.font-weight-bolder {
  font-weight: 700;
}

/* 字体大小 */
.font-10{
  font-size: 10rpx;
}
.font-14{
  font-size: 14rpx;
}
.font-15{
  font-size: 15rpx;
}
.font-16{
  font-size: 16rpx;
}
.font-18{
  font-size: 18rpx;
}
.font-20{
  font-size: 20rpx;
}
.font-22{
  font-size: 22rpx;
}
.font-25{
  font-size: 25rpx;
}
.font-28{
  font-size: 28rpx;
}
.font-30{
  font-size: 30rpx;
}

/* 圆角 */
.border-radius-2{
  border-radius: 2rpx;
}
.border-radius-4{
  border-radius: 4rpx;
}
.border-radius-8{
  border-radius: 8rpx;
}
.border-radius-16{
  border-radius: 16rpx;
}
.border-radius-24{
  border-radius: 24rpx;
}

/* 文字对齐 */
.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

/* 垂直居中 */
.align-center {
  align-items: center;
}
.justify-content{
  justify-content: center;
}
.horizontal-center{
  margin: 0 auto;
}
/* 两端对齐 */
.justify-between{
  justify-content:space-between;
}

/* 文字换行溢出处理 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 内容溢出 */
.overflow-hidden {
  overflow: hidden;
}

/* 定位 */
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.position-fixed {
  position: fixed;
}

/* 宽度100% */
.w-100 {
  width: 100%;
}
.w-50 {
  width: 50%;
}
.w-25 {
  width: 25%;
}
.h-100 {
  height: 100%;
}
.h-50 {
  height: 50%;
}

/* flex 布局 */
.flex {
  display: flex;
  flex-direction: row;
}

.display{
  display: flex;
}

.flex-row {
  flex-direction: row !important;
}

.flex-column {
  flex-direction: column !important;
}

.flex-row-reverse {
  flex-direction: row-reverse !important;
}

.flex-column-reverse {
  flex-direction: column-reverse !important;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

/*  -- 内外边距 -- */
.m-0 {
  margin: 0;
}

.m-auto {
  margin: auto;
}

.m-10 {
  margin: 10rpx;
}

.m-15 {
  margin: 15rpx;
}

.m-20 {
  margin: 20rpx;
}

.m-30 {
  margin: 30rpx;
}

.m-40 {
  margin: 40rpx;
}

.m-50 {
  margin: 50rpx;
}

.m-10 {
  margin: 10rpx;
}

.m-20 {
  margin: 20rpx;
}

.m-30 {
  margin: 30rpx;
}

.m-40 {
  margin: 40rpx;
}

.m-50 {
  margin: 50rpx;
}


.mt-0 {
  margin-top: 0;
}

.mt-auto {
  margin-top: auto;
}
.mt-10 {
  margin-top: 10rpx;
}
.mt-15 {
  margin-top: 15rpx;
}

.mt-20 {
  margin-top: 20rpx;
}

.mt-30 {
  margin-top: 30rpx;
}

.mt-40 {
  margin-top: 40rpx;
}

.mt-50 {
  margin-top: 50rpx;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-auto {
  margin-bottom: auto;
}
.mb-10 {
  margin-bottom: 10rpx;
}

.mb-15 {
  margin-bottom: 15rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.mb-30 {
  margin-bottom: 30rpx;
}

.mb-40 {
  margin-bottom: 40rpx;
}

.mb-50 {
  margin-bottom: 50rpx;
}

.ml-0 {
  margin-left: 0;
}

.ml-auto {
  margin-left: auto;
}

.ml-10 {
  margin-left: 10rpx;
}

.ml-15 {
  margin-left: 15rpx;
}
.ml-20 {
  margin-left: 20rpx;
}

.ml-30 {
  margin-left: 30rpx;
}

.ml-40 {
  margin-left: 40rpx;
}

.ml-50 {
  margin-left: 50rpx;
}

.mr-0 {
  margin-right: 0;
}

.mr-auto {
  margin-right: auto;
}

.mr-10 {
  margin-right: 10rpx;
}

.mr-15 {
  margin-right: 15rpx;
}

.mr-20 {
  margin-right: 20rpx;
}

.mr-30 {
  margin-right: 30rpx;
}

.mr-40 {
  margin-right: 40rpx;
}

.mr-50 {
  margin-right: 50rpx;
}

.my-0 {
  margin-top: 0;
  margin-bottom: 0;
}

.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}

.my-10 {
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

.my-15 {
  margin-top: 15rpx;
  margin-bottom: 15rpx;
}

.my-20 {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.my-30 {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.my-40 {
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}

.my-50 {
  margin-top: 50rpx;
  margin-bottom: 50rpx;
}

.mx-0 {
  margin-left: 0;
  margin-right: 0;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mx-10 {
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.mx-15 {
  margin-left: 15rpx;
  margin-right: 15rpx;
}

.mx-20 {
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.mx-30 {
  margin-left: 30rpx;
  margin-right: 30rpx;
}

.mx-40 {
  margin-left: 40rpx;
  margin-right: 40rpx;
}

.mx-50 {
  margin-left: 50rpx;
  margin-right: 50rpx;
}

.p-0 {
  padding: 0;
}

.p {
  padding: 5rpx;
}

.p-10 {
  padding: 10rpx;
}

.p-15 {
  padding: 15rpx;
}

.p-20 {
  padding: 20rpx;
}

.p-30 {
  padding: 30rpx;
}

.p-40 {
  padding: 40rpx;
}

.p-50 {
  padding: 50rpx;
}

.pt-0 {
  padding-top: 0;
}

.pt {
  padding-top: 5rpx;
}

.pt-10 {
  padding-top: 10rpx;
}

.pt-15{
  padding-top: 15rpx;
}

.pt-20 {
  padding-top: 20rpx;
}

.pt-30 {
  padding-top: 30rpx;
}

.pt-40 {
  padding-top: 40rpx;
}

.pt-50 {
  padding-top: 50rpx;
}

.pb-0 {
  padding-bottom: 0;
}

.pb-1 {
  padding-bottom: 10rpx;
}

.pb {
  padding-bottom: 5rpx;
}

.pb-2 {
  padding-bottom: 20rpx;
}

.pb-3 {
  padding-bottom: 30rpx;
}

.pb-4 {
  padding-bottom: 40rpx;
}

.pb-5 {
  padding-bottom: 50rpx;
}

.pb-10 {
  padding-bottom: 10rpx;
}

.pb-15 {
  padding-bottom: 15rpx;
}

.pb-20 {
  padding-bottom: 20rpx;
}

.pb-30 {
  padding-bottom: 30rpx;
}

.pb-40 {
  padding-bottom: 40rpx;
}

.pb-50 {
  padding-bottom: 50rpx;
}

.pl-0 {
  padding-left: 0;
}

.pl {
  padding-left: 5rpx;
}

.pl-10 {
  padding-left: 10rpx;
}

.pl-15 {
  padding-left: 15rpx;
}

.pl-20 {
  padding-left: 20rpx;
}

.pl-30 {
  padding-left: 30rpx;
}

.pl-40 {
  padding-left: 40rpx;
}

.pl-50 {
  padding-left: 50rpx;
}

.pr-0 {
  padding-right: 0;
}

.pr {
  padding-right: 5rpx;
}

.pr-10 {
  padding-right: 10rpx;
}

.pr-15 {
  padding-right: 15rpx;
}

.pr-20 {
  padding-right: 20rpx;
}

.pr-30 {
  padding-right: 30rpx;
}

.pr-40 {
  padding-right: 40rpx;
}

.pr-50 {
  padding-right: 50rpx;
}

.py-0 {
  padding-top: 0;
  padding-bottom: 0;
}

.py {
  padding-top: 5rpx;
  padding-bottom: 5rpx;
}

.py-1 {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
}

.py-2 {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
}

.py-3 {
  padding-top: 30rpx;
  padding-bottom: 30rpx;
}

.py-4 {
  padding-top: 40rpx;
  padding-bottom: 40rpx;
}

.py-5 {
  padding-top: 50rpx;
  padding-bottom: 50rpx;
}

.py-10 {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
}

.py-15 {
  padding-top: 15rpx;
  padding-bottom: 15rpx;
}

.py-20 {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
}

.py-30 {
  padding-top: 30rpx;
  padding-bottom: 30rpx;
}

.py-40 {
  padding-top: 40rpx;
  padding-bottom: 40rpx;
}

.py-50 {
  padding-top: 50rpx;
  padding-bottom: 50rpx;
}

.rpx-0 {
  padding-left: 0;
  padding-right: 0;
}

.rpx-10 {
  padding-left: 10rpx;
  padding-right: 10rpx;
}

.rpx-15 {
  padding-left: 15rpx;
  padding-right: 15rpx;
}

.rpx-20 {
  padding-left: 20rpx;
  padding-right: 20rpx;
}

.rpx-30 {
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.rpx-40 {
  padding-left: 40rpx;
  padding-right: 40rpx;
}

.rpx-50 {
  padding-left: 50rpx;
  padding-right: 50rpx;
}

/* 字体颜色 */
.text-white{
  color: #ffffff;
}
.text-lightWhite{
  color: #c2c4ce;
}
.text-lightWhite1{
  color: #e7e8e9;
}
.text-lightWhite2{
  color: rgba(255, 255, 255, 0.4);
}
.text-lightWhite3{
  color: rgba(255, 255, 255, 0.7);
}
.text-blue{
  color: #8587f2;
}
.text-black{
  color: #000000;
}



/* 定位 - 固定顶部 */
.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}

/* 定位 - 固定底部 */
.fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
}

.top-0 {
  top: 0;
}

.left-0 {
  left: 0;
}

.right-0 {
  right: 0;
}

.bottom-0 {
  bottom: 0;
}

/* 阴影 */
.shadow {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
}

.shadow-lg {
  box-shadow: 0rpx 40rpx 100rpx 0rpx rgba(0, 0, 0, 0.175);
}

.shadow-none {
  box-shadow: none !important;
}

/* 超出部分显示... */
.text-overflow{
  overflow: hidden;/*超出部分隐藏*/
  white-space: nowrap;/*不换行*/
  text-overflow:ellipsis;/*超出部分文字以...显示*/
}

/* 鼠标进入时，显示手型 */
.cursor{
  cursor:pointer;
}

/* 放大 */
.scale-1:hover{
  transform: scale(1.1);
}
.scale-2:hover{
  transform: scale(1.2);
}

// 背景固定
.bg-all {
  background-color: #1a1f32;
  position: fixed;
  width: 100%;
  height: 100%;
}

//去掉横向滚动条
/* 滚动条宽度 */
#noneScrollbar .el-scrollbar__thumb {
  display: none;
}
#noneScrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
}
.flex {
  display: flex;
  flex-direction: row;
}

.selected {
  background-color: #ffffff;
}

/* 超出部分显示... */
.text-overflow {
  overflow: hidden;
  /*超出部分隐藏*/
  white-space: nowrap;
  /*不换行*/
  text-overflow: ellipsis;
  /*超出部分文字以...显示*/
}

.align-center {
  align-items: center;
}
</style> 
