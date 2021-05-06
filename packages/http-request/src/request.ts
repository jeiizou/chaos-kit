import LRU from '@jeiizou/lru';
import defaultConfig from './default';
import * as util from '@jeiizou/tools';
import * as Url from './util/url';
import getDefaultAdapter from './util/getDefaultAdapter';

export default class Request {
    lruCache:
        | LRU<
              string,
              {
                  data: any;
                  time: number;
              }
          >
        | undefined;

    requestContext: GlobalRequestContext;

    constructor(config?: Partial<GlobalRequestContext>) {
        // merge requestContext
        this.requestContext = Object.assign(defaultConfig, config);

        // init LRU
        if (
            this.requestContext.cacheTime > 0 &&
            this.requestContext.cacheMaxLength > 0
        ) {
            this.lruCache = new LRU(this.requestContext.cacheMaxLength);
        }
    }

    /**
     * 带缓存控制的请求发送方法
     * @param option
     * @returns
     */
    async request(option: Partial<RequestParams>): Promise<MyResponse> {
        let response: MyResponse;
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
            return await this.send(option);
        }
    }

    async send(option: Partial<RequestParams>): Promise<MyResponse> {
        let mergedOption = Object.assign(this.requestContext.default, option);

        let fullPath = Url.buildFullPath(
            this.requestContext.baseUrl || '',
            mergedOption.url || '',
        );

        let sendOption = {
            ...mergedOption,
            url: fullPath,
        };

        if (sendOption.headers && util.isFormData(sendOption.data)) {
            delete sendOption.headers['Content-Type'];
        }

        if (sendOption.auth) {
            let username = sendOption.auth.username || '';
            let password = sendOption.auth.password
                ? unescape(encodeURIComponent(sendOption.auth.password))
                : '';
            sendOption.headers.Authorization =
                'Basic ' + btoa(username + ':' + password);
        }
        try {
            // requestTransformer
            let requestTransformer = this.requestContext.requestTransformer;
            for await (const requestFunction of requestTransformer || []) {
                sendOption = requestFunction(this.requestContext, sendOption);
            }

            // send request
            let response: MyResponse;
            if (this.requestContext.adapter) {
                response = await this.requestContext.adapter(sendOption);
            } else {
                let adaptor = getDefaultAdapter();
                response = await adaptor(sendOption);
            }

            // requestTransformer
            let responseTransformer = this.requestContext.responseTransformer;
            for await (const requestFunction of responseTransformer || []) {
                response = requestFunction(response);
            }
            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
