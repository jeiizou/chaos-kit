/**
 * @jeiizou/http-request 网络请求库
 */
import Request from './request';
import * as Config from './default';

// 创建一个实例对象
export function create(config?: Config.RequestConstructorParams) {
    let instance = new Request(config);
    let req: typeof instance.request = instance.request.bind(instance);
    return req;
}

// 全局实例对象
export const request = create();

// function HttpRequest(params: Config.defaultRequestOption) {
//     return request(params);
// }

// HttpRequest.prototype.create = create;

// ['get','']

class httpRequest extends Request {
    static instance = request;
    static get(url: string, data?: any) {
        return this.instance({
            url: url,
            method: 'GET',
            data: data,
        });
    }
    static post(url: string, data?: any) {
        return this.instance({
            url: url,
            method: 'POST',
            data: data,
        });
    }
    static head(url: string, data?: any) {
        return this.instance({
            url: url,
            method: 'HEAD',
            data: data,
        });
    }
    static put(url: string, data?: any) {
        return this.instance({
            url: url,
            method: 'PUT',
            data: data,
        });
    }
}

export default httpRequest;
