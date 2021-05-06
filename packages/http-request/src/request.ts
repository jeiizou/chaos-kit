import LRU from '@jeiizou/lru';
import * as Default from './default';
import * as util from '@jeiizou/tools';
import * as Url from './util/url';

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

    requestContext: Default.RequestContext;

    requestTransformer: any[] = [];
    responseTransformer: any[] = [];

    constructor(config?: Partial<Default.RequestContext>) {
        // merge requestContext
        this.requestContext = Object.assign(
            Default.defaultRequestContext,
            config,
        );

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
    async request(option: Partial<Default.SendOption>) {
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

    async send(option: Partial<Default.SendOption>) {
        let mergedOption = Object.assign(Default.defaultSendOption, option);

        let fullPath = Url.buildFullPath(
            this.requestContext.baseUrl || '',
            mergedOption.url || '',
        );

        const sendOption = {
            ...mergedOption,
            url: fullPath,
            timeout:
                mergedOption.timeout === undefined
                    ? mergedOption.timeout
                    : this.requestContext.timeout,
        };

        try {
            if (this.requestContext.adapter) {
                await this.requestContext.adapter(sendOption);
            }
        } catch (error) {
            // TODO
        }
    }
}
