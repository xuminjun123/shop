/*
 * @Author: xmj
 * @Date: 2022-06-13 10:19:29
 */
export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}


/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color: string) {
    const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/;
    return reg.test(color);
}

/**
 * 判断是否为数字
 * @param {*} array
 */
export function isNumber(val: unknown): val is number {
    return is(val, 'Number');
}


/**
 * 判断是否为数组
 * @param {*} array
 */
export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function isString(val: unknown): val is string {
    return is(val, 'String');
}
export function isObject(val: any): val is Record<any, any> {
    return val !== null && is(val, 'Object');
}

/**
 * 判断是否为空
 * @param {*} object 源对象
 */
export function isEmpty<T = unknown>(val: T): val is T {
    if (isArray(val) || isString(val)) {
        return val.length === 0;
    }

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }

    if (isObject(val)) {
        return Object.keys(val).length === 0;
    }

    return false;
}
/**
 * 判断是否为fn
 * @param {*} val 源对象
 */
export function isFunction(val: unknown): val is Function {
    return typeof val === 'function';
}

/**
 * 手机号码
 * @param {*} s
 */
export function isPhone(s: string): boolean {
    return /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/.test(s);
}
