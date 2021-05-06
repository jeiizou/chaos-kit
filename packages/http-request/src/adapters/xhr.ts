import * as Default from '../default';
import * as Url from '../util/url';
import * as utils from '@jeiizou/tools';
import parseHeaders from '../util/parseHeader';
import settle from '../util/settle';

/**
 *
 * @param config
 * @param params
 * @returns
 */
export default function xhrAdapter(params: Default.SendOption) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        if (!window.XMLHttpRequest) {
            reject(
                'your browser is not sopport XMLHttpRequest ! please change browser and try again',
            );
            return;
        }

        const {
            data = {},
            headers = {},
            method = 'GET',
            responseType,
            requestHeaders = {},
            url,
        } = params;

        if (headers && utils.isFormData(data)) {
            delete headers['Content-Type'];
        }

        let request: XMLHttpRequest | null = new XMLHttpRequest();
        if (params.auth) {
            let username = params.auth.username || '';
            let password = params.auth.password
                ? unescape(encodeURIComponent(params.auth.password))
                : '';
            headers.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        request.open(
            method.toUpperCase(),
            Url.buildURL(url, data, params.paramsSerializer),
            true,
        );

        // 设置默认的请求超时时间
        request.timeout = params.timeout || 0;

        function onloadend() {
            if (!request) {
                return;
            }

            // 解析响应头节点信息
            const responseHeaders =
                'getAllResponseHeaders' in request
                    ? parseHeaders(request.getAllResponseHeaders())
                    : null;
            // 解析相应数据
            const responseData =
                !responseType ||
                responseType === 'text' ||
                responseType === 'json'
                    ? request.responseText
                    : request.response;
            // 构建响应返回结构
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config: params,
                request: request,
            };

            settle(resolve, reject, response);
            request = null;
        }

        if ('onloadend' in request) {
            request.onloadend = onloadend;
        } else {
            // @ts-ignore
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }
                if (
                    request.status === 0 &&
                    !(
                        request.responseURL &&
                        request.responseURL.indexOf('file:') === 0
                    )
                ) {
                    return;
                }
                setTimeout(onloadend);
            };
        }

        request.onabort = function handleAbort() {
            if (!request) {
                return;
            }
            reject('Request aborted');
            request = null;
        };

        request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject('Network Error');

            // Clean up request
            request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
            var timeoutErrorMessage =
                'timeout of ' + params.timeout + 'ms exceeded';
            if (params.timeoutErrorMessage) {
                timeoutErrorMessage = params.timeoutErrorMessage;
            }
            reject('ETIMEDOUT');
            // Clean up request
            request = null;
        };

        if ('setRequestHeader' in request) {
            utils.forEach(
                requestHeaders,
                function setRequestHeader(val: string, key: string) {
                    if (
                        typeof data === 'undefined' &&
                        key.toLowerCase() === 'content-type'
                    ) {
                        // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                    } else {
                        // Otherwise add header to the request
                        request?.setRequestHeader(key, val);
                    }
                },
            );
        }

        if (!utils.isUndefined(params.withCredentials)) {
            request.withCredentials = !!params.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
            request.responseType = params.responseType;
        }

        // Handle progress if needed
        if (typeof params.onDownloadProgress === 'function') {
            request.addEventListener('progress', params.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof params.onUploadProgress === 'function' && request.upload) {
            request.upload.addEventListener(
                'progress',
                params.onUploadProgress,
            );
        }

        if (params.cancelToken) {
            // Handle cancellation
            params.cancelToken.promise.then(function onCanceled(
                cancel: string,
            ) {
                if (!request) {
                    return;
                }

                request.abort();
                reject(cancel);
                // Clean up request
                request = null;
            });
        }

        if (!data) {
            request.send(null);
        } else {
            request.send(data);
        }
    });
}
