import LRU from '@jeiizou/lru';

type Params = {
    [keyname: string]: any;
};

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
    data?: Params;
    type?: Methods;
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
    baseUrl: string;
    fetchConfig: RequestInit;
    cacheTime: number;
    lruCache: LRU | undefined;
    constructor(config?: RequestConstructor) {
        this.baseUrl = config?.baseUrl ?? '';
        this.fetchConfig = config?.fetchConfig ?? {};
        this.cacheTime = config?.cacheTime ?? 0;

        let cacheMaxLength = config?.cacheMaxLength;
        // 初始化 lru 内存控制对象
        if (cacheMaxLength && cacheMaxLength > 0 && this.cacheTime > 0) {
            this.lruCache = new LRU(cacheMaxLength);
        }
    }

    async send(option: RequestOption) {
        let { type, url, data, method } = Object.assign(
            {
                url: '',
                data: {},
                type: Methods.GET as Methods,
                method: 'fetch',
            },
            option,
        );

        type = type.toUpperCase() as Methods;
        url = this.baseUrl + url;

        // create params string
        if (type === 'GET') {
            let dataStr = '';
            Object.keys(data || {}).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            });

            if (dataStr !== '') {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
        }
        // @ts-ignore
        if (window.fetch && method == 'fetch') {
            let requestConfig: RequestInit = {
                method: type,
                headers: defualtHeaders,
                mode: 'cors', // 允许跨域
                cache: 'force-cache',
                credentials: 'include', // 自动发送cookie
                ...this.fetchConfig,
            };

            if (type == 'POST') {
                Object.defineProperty(requestConfig, 'body', {
                    value: JSON.stringify(data),
                });
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
                if (type === 'POST') {
                    sendData = JSON.stringify(data);
                }

                requestObj.open(type, url, true);
                requestObj.setRequestHeader(
                    'Content-type',
                    'application/x-www-form-urlencoded',
                );
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
        if (this.cacheTime && this.cacheTime > 0 && this.lruCache) {
            // 需要进行请求缓存逻辑
            let now = Date.now();
            let mapKey = JSON.stringify(option);
            // 存在对应的缓存内容
            let lastResult = this.lruCache.get(mapKey);
            if (lastResult && lastResult.time - now <= this.cacheTime) {
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
