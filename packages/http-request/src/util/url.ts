import * as typeUtil from './type';
import * as utils from '@jeiizou/tools';

function encode(val: string) {
    return encodeURIComponent(val)
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}

/**
 * 处理url参数
 * @param url
 * @param params 参数对象
 * @returns string
 */
export function buildURL(url: string, params: KVStringObject) {
    if (!params) {
        return url;
    }

    let serializedParams;
    if (typeUtil.isURLSearchParams(params)) {
        serializedParams = params.toString();
    } else {
        let parts: string[] = [];

        utils.forEach(params, function serialize(val: any, key: any) {
            if (val === null || typeof val === 'undefined') {
                return;
            }

            if (utils.isArray(val)) {
                key = key + '[]';
            } else {
                val = [val];
            }

            utils.forEach(val, function parseValue(v: any) {
                if (utils.isDate(v)) {
                    v = (v as Date).toISOString();
                } else if (utils.isObject(val)) {
                    v = JSON.stringify(v);
                }
                parts.push(encode(key) + '=' + encode(v));
            });
        });
        serializedParams = parts.join('&');
    }

    if (serializedParams) {
        let hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
}
