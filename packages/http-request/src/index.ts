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

['get', 'post', 'head', 'put'].forEach(method => {
    HttpRequest.prototype[method] = (
        url: string,
        data: any,
        config?: Config.SendOption,
    ) => {
        request({
            url: url,
            method: method.toUpperCase(),
            data: data,
        });
    };
});

export default HttpRequest;
