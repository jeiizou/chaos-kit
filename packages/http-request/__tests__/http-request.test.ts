import httpRequest, { createRequest, request } from '../src/index';
import { injectXHRMock, resumeXHRMock } from './__mock__/xhr-mock';
import { mockResolveFetch, resumeFetchMock } from './__mock__/fetch-mock';

describe('xhr test', () => {
    const response = {
        a: '1',
        b: '2',
    };
    beforeAll(() => {
        injectXHRMock({
            data: response,
        });
    });

    afterAll(() => {
        resumeXHRMock();
    });

    test('base request xhr', async () => {
        let instance = createRequest();
        let resp = await instance({
            url: 'test/abc.com',
        });
        expect(resp).toEqual(response);
    });

    test('should throw Error when no xhr', async () => {
        window.XMLHttpRequest = undefined;
        try {
            let resp = await request({
                url: 'test/abc.com',
            });

            throw Error('not except error');
        } catch (error) {
            expect(error).toBe(
                'your browser is not sopport XMLHttpRequest ! please change browser and try again',
            );
        }
    });
});

describe('fetch test', () => {
    const response = {
        a: '1',
        b: '2',
    };
    beforeAll(() => {
        mockResolveFetch({
            data: response,
        });
    });

    afterAll(() => {
        resumeFetchMock();
    });

    test('return should be equal to response', async () => {
        let instance = createRequest();
        let resp = await instance({
            url: 'test/abc.com',
        });
        expect(resp.data).toEqual(response);
    });

    test('method should be get', async () => {
        let resp = await httpRequest.get('test/abc.com');
        expect(resp.requestConfig.method).toEqual('GET');
        expect(resp.data).toEqual(response);
    });

    test('method should be post', async () => {
        let resp = await httpRequest.post('test/abc.com');
        expect(resp.requestConfig.method).toEqual('POST');
        expect(resp.data).toEqual(response);
    });

    test('method should be head', async () => {
        let resp = await httpRequest.head('test/abc.com');
        expect(resp.requestConfig.method).toEqual('HEAD');
        expect(resp.data).toEqual(response);
    });

    test('method should be put', async () => {
        let resp = await httpRequest.put('test/abc.com');
        expect(resp.requestConfig.method).toEqual('PUT');
        expect(resp.data).toEqual(response);
    });

    test('url should be concat', async () => {
        let resp = await httpRequest.get('test/abc.com', {
            a: '1',
            b: '2',
        });
        expect(resp.url).toEqual('test/abc.com?a=1&b=2');
    });
});
