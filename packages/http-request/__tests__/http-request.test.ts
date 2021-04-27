import httpRequest, { createRequest } from '../src/index';
import { injectXHRMock, resumeXHRMock } from './__mock__/xhr-mock';
import { injectFetchMock, resumeFetchMock } from './__mock__/fetch-mock';

describe('base function', () => {
    it('base request xhr', async () => {
        const response = {
            a: '11',
            v: '22',
        };
        injectXHRMock({
            data: response,
        });
        let instance = createRequest();
        let resp = await instance({
            url: 'test/abc.com',
        });
        resumeXHRMock();
        expect(resp).toEqual(response);
    });

    it('base request fetch', async () => {
        const response = {
            a: '1',
            b: '2',
        };
        injectFetchMock({
            data: response,
        });
        let instance = createRequest();
        let resp = await instance({
            url: 'test/abc.com',
        });
        resumeFetchMock();
        expect(resp).toEqual(response);
    });
});
