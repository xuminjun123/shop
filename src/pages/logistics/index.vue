<template>
  <view class="wrapper">
    <tm-input
      :border="2"
      :padding="[20, 10]"
      @search="search"
      prefix="tmicon-search"
      searchLabel="查询"
      focus
      :inputPadding="[40, 40]"
      :followTheme="false"
      focusColor="white"
      color="white"
      fontColor="black"
      placeholder="请输入快递单号"
    ></tm-input>
  </view>
</template>
<script lang="ts" setup>
const search = (e) => {
  console.log("e-", e);
  if (!e) {
    return;
  } else {
    uni.navigateTo({
      url: `plugin://kdPlugin/index?num=${e}&appName=快递跟踪`,
    });
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
