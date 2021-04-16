export default class HttpRequest {
    baseUrl: string;
    fetchConfig: {};
    constructor(config: { baseUrl: string; fetchConfig: {} }) {
        this.baseUrl = config.baseUrl;
        this.fetchConfig = config.fetchConfig;
    }

    async request(url = '', data: any = {}, type = 'GET', method = 'fetch') {
        type = type.toUpperCase();
        url = this.baseUrl + url;

        if (type === 'GET') {
            let dataStr = ''; // 数据拼接字符串
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
                credentials: 'include', //为了在当前域名内自动发送 cookie, 必须提供这个选项
                method: type,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors', //请求的模式, 默认是允许跨域的
                cache: 'force-cache',
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
                        } else {
                            reject(requestObj);
                        }
                    }
                };
            });
        }
    }
}
