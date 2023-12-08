/*
 * @Description: 获取胶囊按钮信息
 * @Author: xmj
 * @Date: 2022-09-06 10:09:50
 */
import { computed } from "vue";
import { TopInfo, useUserStore } from "@/store/modules/user";
export const useTopInfo = () => {
    const userStore = useUserStore();
    const topInfo: any = computed<TopInfo>((): TopInfo => {
        return userStore.getTopInfo;
    })

    const headerStyle = computed(() => {
        const userStore = useUserStore();
        const topInfo = userStore.getTopInfo;
        return {
            paddingTop: topInfo.top + 'px',
            height: topInfo.bottom + 'px',
            lineHeight: topInfo.height + 'px'
        };
    });

    const contentStyle = computed(() => {
        const userStore = useUserStore();
        const topInfo = userStore.getTopInfo;
        return {
            marginTop: (topInfo.bottom + 5) + 'px',
        };
    });

    return {
        topInfo,
        headerStyle,
        contentStyle
    };
};
