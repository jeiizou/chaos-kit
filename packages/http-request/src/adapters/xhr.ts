import * as Default from '../default';
import * as Url from '../util/url';
import * as utils from '@jeiizou/tools';
import parseHeaders from '../util/parseHeader';

/**
 *
 * @param config
 * @param params
 * @returns
 */
export default function xhrAdapter(params: any) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        if (!window.XMLHttpRequest) {
            reject(
                'your browser is not sopport XMLHttpRequest ! please change browser and try again',
            );
            return;
        }

        const { data = {}, headers = {}, method = 'GET', requestType } = params;

        if (headers && utils.isFormData(data)) {
            delete headers['Content-Type'];
        }

        let request = new XMLHttpRequest();
        if (params.auth) {
            let username = params.auth.username || '';
            let password = params.auth.password
                ? unescape(encodeURIComponent(params.auth.password))
                : '';
            headers.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        let fullPath = Url.buildFullPath(
            params.baseUrl || '',
            params.url || '',
        );

        if (!fullPath) {
            reject('Request Url is necessary');
            return;
        }

        params.paramsSerializer;

        request.open(
            method.toUpperCase(),
            Url.buildURL(fullPath, data, params.paramsSerializer),
            true,
        );

        // 设置默认的请求超时时间
        request.timeout = params.timeout;

        function onloadend() {
            if (!request) {
                return;
            }

            // 解析响应头节点信息
            const responseHeaders =
                'getAllResponseHeaders' in request
                    ? parseHeaders(request.getAllResponseHeaders())
                    : null;
        }
    });
}
