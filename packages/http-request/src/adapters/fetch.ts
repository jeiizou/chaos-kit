import createError from '../util/enhanceError';

export default async function fetchAdapter(
    params: RequestParams,
): Promise<MyResponse> {
    let fetchConfig: RequestInit = {
        method: params.method,
        headers: params.headers as HeadersInit,
        body: params.data,
        mode: 'cors',
        credentials: params.withCredentials ? 'include' : 'same-origin',
        cache: 'default',
        // 覆盖默认的fetchConfig配置
        ...params.fetchConfig,
    };

    try {
        let fetchResponse = await fetch(params.url, fetchConfig);
        let responseData: any = {};

        if (params.responseType === 'text') {
            responseData = await fetchResponse.text();
        } else if (params.responseType === 'blob') {
            responseData = await fetchResponse.blob();
        } else if (params.responseType === 'arraybuffer') {
            responseData = await fetchResponse.arrayBuffer();
        } else {
            responseData = await fetchResponse.json();
        }

        let response: MyResponse = {
            data: responseData,
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            headers: fetchResponse.headers,
            config: params,
            request: fetchConfig,
        };

        if (fetchResponse.ok) {
            return response;
        } else {
            return Promise.reject(
                createError(
                    'Response Error',
                    params,
                    fetchResponse.statusText,
                    fetchConfig,
                    fetchResponse,
                ),
            );
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
