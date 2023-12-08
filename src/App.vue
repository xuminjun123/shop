<!--
 * @Author: xmj
 * @Date: 2022-09-06 18:49:12
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { checkUpdateVersion } from "@/utils/wxmp/auth";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

onLaunch(async () => {
  console.log("App Launch");
  await userStore.setTopInfo();
  // await userStore.setMobileInfo();
  // await userStore.setSelectCompany(false);
  checkUpdateVersion();
});

onShow(async () => {
  console.log("App Show");
  await userStore.asyncGetSessionKey();
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/utilities";
@import "./easy-ui/icon/iconfont.css";
@import "./easy-ui/styles/common.css";
/* #ifdef APP-NVUE */
@import "./tmui/scss/nvue.css";
/* #endif */
/* #ifndef APP-NVUE */
@import "./tmui/scss/noNvue.css";

/* #endif */

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

page {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
}

.mx {
  @apply w-11/12 mx-auto;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
