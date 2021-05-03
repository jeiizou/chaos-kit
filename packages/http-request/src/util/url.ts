import * as typeUtil from './type';
import * as utils from '@jeiizou/tools';

/**
 * 对URL进行编码
 * from axios
 * @param val
 * @returns
 */
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
 * from axios
 * @param url
 * @param params 参数对象
 * @returns string
 */
export function buildURL(
    url: string,
    params: KVStringObject,
    paramsSerializer?: Function,
) {
    if (!params) {
        return url;
    }

    let serializedParams;
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (typeUtil.isURLSearchParams(params)) {
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

/**
 * 合并两个url对象
 * from axios
 * @param baseURL
 * @param relativeURL
 * @returns
 */
export function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
}

/**
 * 判断是否是一个绝对路径的URL
 * from axios
 * @param url
 * @returns
 */
export function isAbsoluteURL(url: string) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

/**
 * 合并请求路径
 * @param baseURL
 * @param requestedURL
 */
export function buildFullPath(baseURL: string, requestedURL: string) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}
