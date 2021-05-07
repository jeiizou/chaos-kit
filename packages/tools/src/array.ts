import { isArray } from './type';

export function forEach(obj: any, fn: Function) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
    }

    if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        // Iterate over object keys
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组压平
 * @param deepLevel 压平的深度
 */
export function flap(array: any, deepLevel: number) {
    if (!Array.isArray(array)) {
        throw 'target is not a array';
    }

    function flatOnce(arr: any[]) {
        let res: any[] = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] instanceof Array) {
                res = res.concat(arr[i]);
            } else {
                res.push(arr[i]);
            }
        }
        return res;
    }

    function checkData(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el instanceof Array) {
                return false;
            }
        }
        return true;
    }

    var i = 0;
    var ret = array;
    while (i < deepLevel) {
        ret = flatOnce(ret);
        i++;
        if (checkData(ret)) {
            return ret;
        }
    }

    return ret;
}
