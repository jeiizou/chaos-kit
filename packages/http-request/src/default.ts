/**
 * 默认的请求头
 */
export const defualtHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

/**
 * request 请求的默认配置
 */
export const defaultRequestOption = {
    url: '',
    data: {},
    method: 'GET',
    requestType: 'fetch',
    headers: defualtHeaders,
};

export type defaultRequestOption = Partial<typeof defaultRequestOption>;

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
    headers: defualtHeaders,
};

/**
 * request 实例的默认配置
 */
export const RequestConstructorParams = {
    // 基础URL
    baseUrl: '',
    // fetch配置信息
    fetchConfig: defaultFetchOption,
    // 默认不缓存请求结果,
    // 设置值表示缓存请求的时间(单位毫秒)
    cacheTime: 0,
    // 请求缓存的最大数量
    cacheMaxLength: 20,
};

export type RequestConstructorParams = Partial<typeof RequestConstructorParams>;
