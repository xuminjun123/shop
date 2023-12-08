/**
 * 格式化时间戳
 * @param dateNum
 * @param fmt "yyyy-MM-dd hh:mm:ss"
 * @returns {*}
 */
export function formatDate(dateNum: number, fmt = 'yyyy-MM-dd hh:mm:ss') {
    let date = new Date(dateNum);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str: string) {
    return ("00" + str).substr(str.length);
}
