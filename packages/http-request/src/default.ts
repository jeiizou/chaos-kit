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
    headers: HeaderObject;
    method: string;
    responseType: XMLHttpRequestResponseType;
    requestHeaders?: HeaderObject;
    data?: any;
    url: string;
    auth?: {
        username: string;
        password: string;
    };
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
};

/**
 * 请求的上下文类型
 */
export type RequestContext = typeof defaultRequestContext & {
    // 默认的参数配置函数
    paramsSerializer?: Function;
};
