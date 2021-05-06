/**
 * @jeiizou/http-request 网络请求库
 */
import Request from './request';

// 创建一个实例对象
function create(config?: GlobalRequestContext) {
    let instance = new Request(config);
    let req: typeof instance.request = instance.request.bind(instance);
    return req;
}

// 全局实例对象
const request = create();

function HttpRequest(params: RequestParams) {
    return request(params);
}

HttpRequest.prototype.create = create;

// 没有data的方法
['delete', 'get', 'head', 'potions'].forEach(method => {
    HttpRequest.prototype[method] = (
        url: string,
        config?: Partial<RequestParams>,
    ) => {
        return request({
            url: url,
            method: method.toUpperCase(),
            data: (config || {}).data,
        });
    };
});

// 有data的方法
['post', 'put', 'patch'].forEach(method => {
    HttpRequest.prototype[method] = (
        url: string,
        data: any,
        config?: Partial<RequestParams>,
    ) => {
        return request({
            method: method,
            url: url,
            data: data,
            ...(config || {}),
        });
    };
});

export default HttpRequest;
