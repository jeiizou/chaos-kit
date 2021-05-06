/**
 * @jeiizou/http-request 网络请求库
 */
import Request from './request';
import * as Config from './default';

// 创建一个实例对象
function create(config?: Config.RequestContext) {
    let instance = new Request(config);
    let req: typeof instance.request = instance.request.bind(instance);
    return req;
}

// 全局实例对象
const request = create();

function HttpRequest(
    params: Config.SendOption | string,
    config?: Config.SendOption,
) {
    // return request(params);
    if (typeof params === 'string') {
        return request({
            method: 'GET',
            url: params,
            ...config,
        });
    } else {
        return request(params);
    }
}

HttpRequest.prototype.create = create;

// 没有data的方法
['delete', 'get', 'head', 'potions'].forEach(method => {
    HttpRequest.prototype[method] = (
        url: string,
        config?: Config.SendOption,
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
        config?: Partial<Config.SendOption>,
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
