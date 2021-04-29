const toString = Object.prototype.toString;

/**
 * 判断是否为数组
 * @param val
 * @returns
 */
export function isArray(val: any) {
    return toString.call(val) === '[object Array]';
}

/**
 * 判断是否为 undefined
 * @param val
 * @returns
 */
export function isUndefined(val: any) {
    return typeof val === 'undefined';
}

/**
 * 判断是否为 Buffer
 * @param val
 * @returns
 */
export function isBuffer(val: any) {
    return (
        val !== null &&
        !isUndefined(val) &&
        val.constructor !== null &&
        !isUndefined(val.constructor) &&
        typeof val.constructor.isBuffer === 'function' &&
        val.constructor.isBuffer(val)
    );
}

/**
 * 判断是否为 ArrayBuffer
 * @param val
 * @returns
 */
export function isArrayBuffer(val: any) {
    return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * 判断是否为 Buffer View
 * @param val
 * @returns
 */
export function isArrayBufferView(val: any) {
    var result;
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
    } else {
        result = val && val.buffer && val.buffer instanceof ArrayBuffer;
    }
    return result;
}

/**
 * 判断是否为 字符串
 * @param val
 * @returns
 */
export function isString(val: any) {
    return typeof val === 'string';
}

/**
 * 判断是否为 数字
 * @param val
 * @returns
 */
export function isNumber(val: any) {
    return typeof val === 'number';
}

/**
 * 判断是否为 FormData
 * @param val
 * @returns
 */
export function isFormData(val: any) {
    return typeof FormData !== 'undefined' && val instanceof FormData;
}

/**
 * 判断是否为日期
 * @param val
 * @returns
 */
export function isDate(val: any) {
    return toString.call(val) === '[object Date]';
}

/**
 * 判断是否为对象
 * @param val
 * @returns
 */
export function isObject(val: any) {
    return val !== null && typeof val === 'object';
}

/**
 * 判断是否为 文件
 * @param val
 * @returns
 */
export function isFile(val: any) {
    return toString.call(val) === '[object File]';
}

/**
 * 判断是否为 blob
 * @param val
 * @returns
 */
export function isBlob(val: any) {
    return toString.call(val) === '[object Blob]';
}

/**
 * 判断是否为 函数
 * @param val
 * @returns
 */
export function isFunction(val: any) {
    return toString.call(val) === '[object Function]';
}

/**
 * 判断是否为 流
 * @param val
 * @returns
 */
export function isStream(val: any) {
    return isObject(val) && isFunction(val.pipe);
}
