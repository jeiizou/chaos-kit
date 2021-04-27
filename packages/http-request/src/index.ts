/**
 * @jeiizou/http-request 网络请求库
 */
import Request, { Methods, RequestConstructor } from './request';

// 创建一个实例对象
export function createRequest(config?: RequestConstructor) {
    let instance = new Request(config);
    let req: typeof instance.request = instance.request.bind(instance);
    return req;
}

// 全局实例对象
export const request = createRequest();

class httpRequest extends Request {
    static instance = request;
    static get(url: string, data?: any) {
        return this.instance({
            url: url,
            type: Methods.GET,
            method: 'fetch',
            data: data,
        });
    }
    static post(url: string, data?: any) {
        return this.instance({
            url: url,
            type: Methods.POST,
            method: 'fetch',
            data: data,
        });
    }
    static head(url: string, data?: any) {
        return this.instance({
            url: url,
            type: Methods.HEAD,
            method: 'fetch',
            data: data,
        });
    }
    static put(url: string, data?: any) {
        return this.instance({
            url: url,
            type: Methods.PUT,
            method: 'fetch',
            data: data,
        });
    }
}

export default httpRequest;
