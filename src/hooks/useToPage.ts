import { useUserStore } from "@/store/modules/user";
import { showToast } from "@/utils/toast";
/**
 * 
 * @param path 页面路径
 */
export const useToPage = (path: string = '') => {
    const userStore = useUserStore();

    const isAuth = userStore.getIsAuth;
    const token = userStore.getToken;
    if (isAuth && token) {
        uni.navigateTo({
            url: path,
        });
    } else {
        showToast("请先登录")
    }
    return
}