/**
 * @jeiizou/http-request 网络请求库
 */
import Request, { Methods } from './request';

export function create() {
    let instance = new Request();
    let req = instance.request.bind(instance);
    return req;
}

// global request
export const request = create();

for (const key in Methods) {
    let lowKey = key.toLowerCase();
    // @ts-ignore
    Request[lowKey] = function (...args) {
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
