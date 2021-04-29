import LRU from '@jeiizou/lru';
import * as defaultConfig from './default';
import * as util from '@jeiizou/tools';
import { buildURL } from './util/url';

export enum Methods {
    CONNECT = 'CONNECT',
    DELETE = 'DELETE',
    GET = 'GET',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    PATCH = 'PATCH',
    POST = 'POST',
    PUT = 'PUT',
    TRACE = 'TRACE',
}

export type RequestOption = {
    // 请求的地址
    url: string;
    data?: any;
    type?: string;
    method?: 'fetch' | 'ajax';
};

export type RequestConstructor = Partial<{
    // 基础URL
    baseUrl: string;
    // fetch配置信息
    fetchConfig: RequestInit;
    // 请求缓存间隔的时间
    cacheTime: number;
    // 请求缓存的最大数量
    cacheMaxLength: number;
}>;

const defualtHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export default class Request {
    // baseUrl: string;
    // fetchConfig: RequestInit;
    // cacheTime: number;
    lruCache:
        | LRU<
              string,
              {
                  data: any;
                  time: number;
              }
          >
        | undefined;

    requestContext: Required<defaultConfig.RequestConstructorParams>;

    constructor(config?: defaultConfig.RequestConstructorParams) {
        // this.baseUrl = config?.baseUrl ?? '';
        // this.fetchConfig = config?.fetchConfig ?? {};
        // this.cacheTime = config?.cacheTime ?? 0;
        // let cacheMaxLength = config?.cacheMaxLength || 100;
        // merge requestContext
        this.requestContext = Object.assign(
            defaultConfig.RequestConstructorParams,
            config,
        );

        // 初始化 lru 内存控制对象
        if (
            this.requestContext.cacheTime > 0 &&
            this.requestContext.cacheMaxLength > 0
        ) {
            this.lruCache = new LRU(this.requestContext.cacheMaxLength);
        }
    }

    async send(option: Partial<defaultConfig.defaultRequestOption>) {
        let { method, url, data, requestType, headers } = Object.assign(
            defaultConfig.defaultRequestOption,
            option,
        ) as defaultConfig.defaultRequestOption;

        if (!url || url === undefined) {
            throw Error('Request: url is required');
        }

        method = method.toUpperCase();
        url = this.requestContext.baseUrl + url;

        // create params string
        if (method === 'GET' && util.isObject(data)) {
            url = buildURL(url, data);
        }

        // @ts-ignore
        if (window.fetch && requestType == 'fetch') {
            let requestConfig: RequestInit = {
                ...this.requestContext.fetchConfig,
                method: method,
            };

            if (method === 'GET' || method === 'HEAD') {
                requestConfig.body = undefined;
            } else if (data) {
                requestConfig.body = data as BodyInit;
            }

            try {
                const response = await fetch(url, requestConfig);
                const responseJson = await response.json();
                return responseJson;
            } catch (error) {
                throw new Error(error);
            }
        } else {
            return new Promise((resolve, reject) => {
                if (!window.XMLHttpRequest) {
                    reject(
                        'your browser is not sopport XMLHttpRequest ! please change browser and try again',
                    );
                    return;
                }

                let requestObj = new XMLHttpRequest();
                let sendData = '';
                if (method === 'POST') {
                    sendData = JSON.stringify(data);
                }

                requestObj.open(method, url, true);
                for (const key in headers) {
                    if (Object.prototype.hasOwnProperty.call(headers, key)) {
                        requestObj.setRequestHeader(
                            key,
                            (headers as KVStringObject)[key],
                        );
                    }
                }
                requestObj.send(sendData);

                requestObj.onreadystatechange = () => {
                    if (requestObj.readyState == 4) {
                        if (requestObj.status == 200) {
                            let obj = requestObj.response;
                            if (typeof obj !== 'object') {
                                obj = JSON.parse(obj);
                            }
                            resolve(obj);
                        }
                    }

                    reject(requestObj);
                };
            });
        }
    }

    async request(option: RequestOption) {
        let response;
        const { cacheTime } = this.requestContext;
        if (cacheTime && cacheTime > 0 && this.lruCache) {
            // 需要进行请求缓存逻辑
            let now = Date.now();
            let mapKey = JSON.stringify(option);
            // 存在对应的缓存内容
            let lastResult = this.lruCache.get(mapKey);
            if (lastResult && now - lastResult.time <= cacheTime) {
                return lastResult.data;
            } else {
                // 更新接口缓存数据
                response = await this.send(option);
                // 缓存数据内容, 如果发生异常则不缓存
                this.lruCache.set(mapKey, {
                    data: response,
                    time: now,
                });
                return response;
            }
        } else {
            // 不需要进行缓存逻辑, 直接发送请求即可
            return this.send(option);
        }
    }
}
