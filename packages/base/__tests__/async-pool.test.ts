import { AsyncPool } from '../src/index';

describe('async-pool', () => {
    test('base usage', async () => {
        const ret = [];

        // test
        const timeout = (time: number) =>
            new Promise(resolve => {
                setTimeout(resolve, time);
            });

        const asyncPool = new AsyncPool(2);
        const addTask = (time: number, order: number) =>
            asyncPool
                .add(() => timeout(time))
                .then(() => {
                    ret.push(order);
                });
        addTask(500, 1);
        addTask(1000, 2);
        addTask(300, 3);
        addTask(400, 4);

        await timeout(1500);
        expect(ret).toEqual([1, 3, 2, 4]);
    });
});
