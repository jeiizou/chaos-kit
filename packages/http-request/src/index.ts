/**
 * @jeiizou/http-request 网络请求库
 * features
 *
 * - 请求实例化
 * - 快速请求方法
 * - 请求取消
 * - 请求拦截器
 * - 请求缓存
 */
import Request, { Methods } from './request';

export function createRequest() {
    let instance = new Request();
    let req: typeof instance.request = instance.request.bind(instance);
    return req;
}

// 全局实例对象
export const request = createRequest();

for (const key in Methods) {
    let lowKey = key.toLowerCase();
    // @ts-ignore
    Request.prototype[lowKey] = function (...args) {
        if (['get', 'delete', 'head', 'options'].includes(lowKey)) {
            return request({
                type: key as Methods,
                url: args[0],
                method: 'fetch',
                data: args[1],
            });
        }
    };
}

export default Request;
