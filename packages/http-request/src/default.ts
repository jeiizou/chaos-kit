import getDefaultAdapter from './util/getDefaultAdapter';

/**
 * 默认的请求头
 */
export const defaultHeaders: KVStringObject = {
    Accept: 'application/json, text/plain, */*',
};

/**
 * request 请求的默认配置
 */
export const defaultSendOption = {
    url: '',
    data: {},
    method: 'GET',
    requestType: '',
    headers: defaultHeaders,
};

/**
 * fetch 默认配置
 */
export const defaultFetchOption: RequestInit = {
    // 默认的请求方法
    method: 'GET',
    // 默认携带 cookie
    credentials: 'include',
    // 默认允许缓存
    cache: 'force-cache',
    // 默认的请求头
    headers: defaultHeaders,
};

/**
 * request 实例的默认配置
 */
export const defaultRequestContext = {
    // 基础URL
    baseUrl: '',
    // fetch配置信息
    fetchConfig: defaultFetchOption,
    // 缓存请求的时间
    cacheTime: 0,
    // 请求缓存的最大数量
    cacheMaxLength: 20,
    // 默认的超时时间
    timeout: 0,
    // 默认的校验状态函数
    validateStatus: function validateStatus(status: number) {
        return status >= 200 && status < 300;
    },
    // 默认的请求方法
    adapter: getDefaultAdapter(),
};

// -- 类型 --

/**
 * 请求的参数类型
 */
export type SendOption = typeof defaultSendOption & {
    auth: {
        username?: string;
        password?: string;
    };
};

/**
 * 请求的上下文类型
 */
export type RequestContext = typeof defaultRequestContext & {
    // 默认的参数配置函数
    paramsSerializer?: Function;
};
