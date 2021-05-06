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
export const defaultSendOption: SendOption = {
    url: '',
    data: {},
    method: 'GET',
    responseType: '',
    headers: defaultHeaders,
};

/**
 * 请求的参数类型
 */
export type SendOption = {
    // 请求地址
    url: string;
    // 请求头信息
    headers: HeaderObject;
    // 请求数据
    data?: any;
    // 请求方法
    method: string;
    // 响应类型
    responseType: XMLHttpRequestResponseType;
    // 验证类型
    auth?: {
        username: string;
        password: string;
    };
    // 参数的序列化方法
    paramsSerializer?: Function;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    onDownloadProgress?: (
        this: XMLHttpRequest,
        ev: ProgressEvent<XMLHttpRequestEventTarget>,
    ) => any;
    onUploadProgress?: (
        this: XMLHttpRequestUpload,
        ev: ProgressEvent<XMLHttpRequestEventTarget>,
    ) => any;
    cancelToken?: {
        promise: Promise<any>;
    };
    validateStatus?: Function;
};
/**
 * request 实例的默认配置
 */
export const defaultRequestContext = {
    // 基础URL
    baseUrl: '',
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
    // 默认的请求参数
    default: defaultSendOption,
};

/**
 * 请求的上下文类型
 */
export type RequestContext = typeof defaultRequestContext & {
    // 默认的参数配置函数
    paramsSerializer?: Function;
};

export type MyResponse = {
    data: any;
    status: number;
    statusText: string;
    headers: HeaderObject;
    config: SendOption;
    request: XMLHttpRequest;
};
