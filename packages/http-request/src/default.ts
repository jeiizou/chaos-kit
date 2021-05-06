import getDefaultAdapter from './util/getDefaultAdapter';

/**
 * 默认的请求头
 */
export const defaultHeaders: HeaderObject = {
    Accept: 'application/json, text/plain, */*',
};

/**
 * request 请求的默认配置
 */
const defaultSendOption: RequestParams = {
    url: '',
    data: {},
    method: 'GET',
    responseType: '',
    headers: defaultHeaders,
    // 默认的校验状态函数
    validateStatus: function validateStatus(status: number) {
        return status >= 200 && status < 300;
    },
};

/**
 * request 实例的默认配置
 */
const defaultRequestContext: GlobalRequestContext = {
    // 基础URL
    baseUrl: '',
    // 缓存请求的时间
    cacheTime: 0,
    // 请求缓存的最大数量
    cacheMaxLength: 20,
    // 默认的请求方法
    adapter: getDefaultAdapter(),
    // 默认的请求参数
    default: defaultSendOption,
};

export default defaultRequestContext;
