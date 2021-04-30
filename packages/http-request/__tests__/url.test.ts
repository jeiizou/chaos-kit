import { buildURL } from '../src/util/url';

describe('url function test', () => {
    test('decode test', () => {
        const url = 'http://www.abc.test';
        const params = {
            a: '1',
            b: 2,
        };
        const urlString = buildURL(url, params);
        expect(urlString).toBe('http://www.abc.test?a=%221%22&b=2');
    });
});
