<!--
 * @Description: 企业员工登录(作废)
 * @Author: xmj
 * @Date: 2022-09-07 17:07:17
-->
<!-- <template>
  <view class="wrapper">
    <view class="w-11/12 py-4 mx-auto"> 员工登录 </view>
    <tm-form @submit="confirm" ref="form" v-model="user">
      <tm-form-item required label="账号" field="nameuser.name" :rules="userNameRules">
        <tm-input :inputPadding="[0,0]" placeholder="请输入账号" v-model="user.nameuser.name" :transprent="true"
          :showBottomBotder="false" _style="color: black" focusColor="darkBlack">
        </tm-input>
      </tm-form-item>
      <tm-form-item required label="密码" field="nameuser.pwd" :rules="[{required:true,message:'请输入密码'}]">
        <tm-input password :inputPadding="[0,0]" v-model="user.nameuser.pwd" :transprent="true" placeholder="请输入密码"
          :showBottomBotder="false" _style="color: black" focusColor="darkBlack">
        </tm-input>
      </tm-form-item>

      <tm-form-item required label="">
        <view class="my-2">
          <tm-button block color="logoutColor" form-type="submit" label="登录"></tm-button>
        </view>
      </tm-form-item>
    </tm-form>

  </view>
</template>
<script lang="ts" setup>
import tmInput from "@/tmui/components/tm-input/tm-input.vue";
import tmFormItem from "@/tmui/components/tm-form-item/tm-form-item.vue";
import tmForm from "@/tmui/components/tm-form/tm-form.vue";
import { ref, computed } from "vue";

const user = ref({
  nameuser: {
    name: "",
    pwd: ''
  },
});
const confirm = (e: any) => {
  console.log(e);

  if (e.validate) {
    uni.switchTab({
      url: "/pages/index/index"
    });

  }
}

const userNameRules = computed(() => {
  return [
    {
      required: true,
      message: "请输入账号",
      validator: () => {
        return user.value.nameuser.name.length > 0;
      },
    }
  ];
});



</script>
<style lang="scss" scoped >
.wrapper {
  :deep(.pt-12) {
    padding-top: 0px;
  }
}
</style> -->