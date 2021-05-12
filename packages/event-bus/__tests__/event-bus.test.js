import LRU from '../src/index';

describe('@jeiizou/LRU', () => {
    let cache = new LRU(3);

    test('test set', () => {
        cache.set('1', '1-value');
        cache.set('2', '2-value');
        cache.set('3', '3-value');
        let keys = Array.from(cache.getKeys());
        expect(keys).toEqual(['1', '2', '3']);
    });

    test('test get', () => {
        let value = cache.get('1');
        expect(value).toBe('1-value');
    });

    test('max length limit', () => {
        cache.set('4', '4-value');
        let keys = Array.from(cache.getKeys());
        expect(keys).toEqual(['1', '3', '4']);

        cache.set('5', '5-value');
        let keys2 = Array.from(cache.getKeys());
        expect(keys2).toEqual(['1', '4', '5']);
    });
});
