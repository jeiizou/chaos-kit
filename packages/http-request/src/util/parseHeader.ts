import { forEach, trim } from '@jeiizou/tools';

// 重复内容会被忽略的Header字段
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = [
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent',
];

/**
 * 解析Header信息
 * @param headers
 * @returns
 */
export default function parseHeaders(headers: string) {
    let parsed: any = {};
    let key;
    let val;
    let i;

    if (!headers) {
        return parsed;
    }

    forEach(headers.split('\n'), function parse(line: string) {
        i = line.indexOf(':');
        key = trim(line.substr(0, i)).toLowerCase();
        val = trim(line.substr(i + 1));

        if (key) {
            // 跳过重复header的解析
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                return;
            }
            // set-cookie 是可以设置多个的, 特殊处理为数组
            if (key === 'set-cookie') {
                parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            } else {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }
    });

    return parsed;
}
