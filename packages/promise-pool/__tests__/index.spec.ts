import { add } from '../src/index';

describe('global test', () => {
    test('add', () => {
        let sum = add(1, 2);
        expect(sum).toBe(3);
    });
});
