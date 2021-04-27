type Params = {
    [keyname: string]: any;
};

export const Methods = {
    CONNECT: 'CONNECT',
    DELETE: 'DELETE',
    GET: 'GET',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
    PATCH: 'PATCH',
    POST: 'POST',
    PUT: 'PUT',
    TRACE: 'TRACE',
};

export type Methods = keyof typeof Methods;

type RequestOption = {
    url: string;
    data?: Params;
    type?: Methods;
    method?: 'fetch' | 'ajax';
};

const defualtHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export default class Request {
    // domain
    baseUrl: string;
    // fetch Config
    fetchConfig: {};
    constructor(
        config: { baseUrl: string; fetchConfig: {} } = {
            baseUrl: '',
            fetchConfig: {},
        },
    ) {
        this.baseUrl = config.baseUrl;
        this.fetchConfig = config.fetchConfig;
    }

    async request(option: RequestOption) {
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

        // create params string
        if (type === 'GET') {
            let dataStr = '';
            Object.keys(data).forEach(key => {
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
                    console.error(
                        'your browser is not sopport XMLHttpRequest ! please change browser and try again',
                    );
                    reject();
                    return;
                }

                let requestObj = new XMLHttpRequest();
                let sendData = '';
                if (type == 'POST') {
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
}
