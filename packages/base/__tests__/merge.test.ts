import merge, {
    mergeArray,
    defaultMergeOption,
    mergeMap,
    mergeSet,
    mergeObject,
} from '../src/merge';

describe('merge test', () => {
    test('merge array with no unique', () => {
        let arr1 = [1, 2, 3];
        let arr2 = [2, 4, 5];
        let mergedArr = mergeArray(arr1, arr2, {
            ...defaultMergeOption,
            unique: false,
        });
        expect(mergedArr).toEqual([1, 2, 3, 2, 4, 5]);
    });

    test('merge array with unique', () => {
        let arr1 = [1, 2, 3];
        let arr2 = [2, 4, 5];
        let mergedArr = mergeArray(arr1, arr2, {
            ...defaultMergeOption,
            unique: true,
        });
        expect(mergedArr).toEqual([1, 2, 3, 4, 5]);
    });

    test('merge map with cover', () => {
        let map1 = new Map([
            ['1', '1'],
            ['2', '2'],
        ]);

        let map2 = new Map([
            ['2', 'new 2'],
            ['3', '3'],
        ]);

        let mergedMap = mergeMap(map1, map2, {
            ...defaultMergeOption,
            cover: true,
        });

        expect(mergedMap).toEqual(
            new Map([
                ['1', '1'],
                ['2', 'new 2'],
                ['3', '3'],
            ]),
        );
    });

    test('merge map with no cover', () => {
        let map1 = new Map([
            ['1', '1'],
            ['2', '2'],
        ]);

        let map2 = new Map([
            ['2', 'new 2'],
            ['3', '3'],
        ]);

        let mergedMap = mergeMap(map1, map2, {
            ...defaultMergeOption,
            cover: false,
        });

        expect(mergedMap).toEqual(
            new Map([
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
            ]),
        );
    });

    test('merge Set', () => {
        let set1 = new Set([1, 2, 3]);
        let set2 = new Set([2, 3, 4, 5]);
        let mergedSet = mergeSet(set1, set2);
        expect(mergedSet).toEqual(new Set([1, 2, 3, 4, 5]));
    });

    test('merge object', () => {
        let obj1 = {
            a: '1',
            b: '2',
            c: '3',
        };
        let obj2 = {
            a: '1-1',
            d: '4',
        };
        let mergedObj = mergeObject(obj1, obj2, {
            ...defaultMergeOption,
            cover: true,
        });
        expect(mergedObj).toEqual({
            a: '1-1',
            b: '2',
            c: '3',
            d: '4',
        });
    });

    test('merge object with no cover', () => {
        let obj1 = {
            a: '1',
            b: '2',
            c: '3',
        };
        let obj2 = {
            a: '1-1',
            d: '4',
        };
        let mergedObj = mergeObject(obj1, obj2, {
            ...defaultMergeOption,
            cover: false,
        });
        expect(mergedObj).toEqual({
            a: '1',
            b: '2',
            c: '3',
            d: '4',
        });
    });

    test('merge complate', () => {
        let obj1 = {
            a: '1',
            b: [1, 2, 3],
            c: new Set([1, 2]),
            d: new Map([
                [1, 1],
                [2, 2],
            ]),
        };

        let obj2 = {
            a: '3',
            b: [2, 5, 6],
            c: new Set([3, 4, 2]),
            d: new Map([
                [3, 3],
                [2, 4],
            ]),
        };

        let merged = merge(obj1, obj2, defaultMergeOption);
        expect(merged).toEqual({
            a: '3',
            b: [1, 2, 3, 2, 5, 6],
            c: new Set([1, 2, 3, 4]),
            d: new Map([
                [1, 1],
                [2, 4],
                [3, 3],
            ]),
        });
    });
});
