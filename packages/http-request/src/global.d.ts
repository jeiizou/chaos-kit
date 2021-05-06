type KVStringObject = {
    [keyname: string]: string;
};

type HeaderObject = {
    [keyname: string]: string | any[];
};

type paramsSerializerFunction = (params: KVStringObject) => string;

// type CancelToken = () => {
//     promise: Promise<string>;
// };

// 请求参数
type RequestParams = {
    // 必填参数 -----

    // 请求地址
    url: string;
    // 请求头信息
    headers: HeaderObject;
    // 请求类型
    method: string;
    // 数据响应类型
    responseType: XMLHttpRequestResponseType;
    // 状态校验函数
    validateStatus: (status: number) => boolean;

    // 可选参数 -------

    // 请求数据
    data?: any;
    // 验证类型
    auth?: {
        username: string;
        password: string;
    };
    // 请求超时
    timeout?: number;
    // 超时提示文本
    timeoutErrorMessage?: string;
    // 跨域的时候是否携带cookie
    withCredentials?: boolean;
    // 下载进度函数
    onDownloadProgress?: (
        this: XMLHttpRequest,
        ev: ProgressEvent<XMLHttpRequestEventTarget>,
    ) => any;
    // 上传进度函数
    onUploadProgress?: (
        this: XMLHttpRequestUpload,
        ev: ProgressEvent<XMLHttpRequestEventTarget>,
    ) => any;
    // 指令的取消;
    // cancelToken?: CancelToken;
    paramsSerialier?: paramsSerializerFunction;
    fetchConfig?: RequestInit;
};

// 响应类型
type MyResponse = {
    data: any;
    status: number;
    statusText: string;
    headers: Headers;
    config: SendOption;
    request: XMLHttpRequest | RequestInit;
};

// 请求实现函数
type AdapterFunction = (send: RequestParams) => Promise<MyResponse>;

type GlobalRequestContext = {
    // 公共URL前缀
    baseUrl: string;
    // 请求缓存的生存期
    cacheTime: number;
    // 最大请求缓存数量
    cacheMaxLength: number;
    // 请求实现函数
    adapter: AdapterFunction;
    // 默认的请求参数
    default: RequestParams;
    requestTransformer?: Array<
        (config: GlobalRequestContext, param: RequestParams) => RequestParams
    >;
    responseTransformer?: Array<(response: MyResponse) => MyResponse>;
    // 指定发送请求的方式
    fetchConfig?: RequestInit; // fetch 的配置参数, 在显式的指定`fetch`或者调用了`fetch`的时候生效
};
