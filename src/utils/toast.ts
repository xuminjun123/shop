/*
 * @Author: xmj
 * @Date: 2022-06-13 10:39:00
 */

/**
 * 显示成功提示框
 */
export const showSuccess = (msg : string, callback ?: Function) => {
	uni.showToast({
		title: msg,
		icon: 'success',
		mask: true,
		duration: 1500,
		success() {
			callback && callback()
		}
	})
}

/**
 * 显示错误提示框
 */
export const showErrorToast = (msg : string, callback ?: Function) => {
	uni.showToast({
		title: msg,
		icon: 'error',
		mask: true,
		duration: 1500,
		success() {
			callback && callback()
		}
	})
}

/**
 * 显示失败模态框
 */
export const showError = (msg : string, callback ?: Function) => {
	uni.showModal({
		title: '友情提示',
		content: msg,
		showCancel: false,
		success(res) {
			callback && callback()
		}
	})
}

/**
 * 显示提示框
 */
export const showModal = (content : string, callback ?: Function) => {
	uni.showModal({
		title: '提示',
		content: content,
		success: function (res) {
			if (res.confirm) {
				callback && callback()
			}
		}
	});
}
/**
 * 显示纯文字提示框
 */
export const showToast = (msg : string) => {
	uni.showToast({
		title: msg,
		icon: 'none'
	})
}

/**
 * 显示loading提示框
 */
export const loading = () => {
	uni.showLoading({
		title: '加载中...'
	});
}
/**
 * 关闭 loading提示框
 */
export const hideLoading = () => {
	uni.hideLoading();
}