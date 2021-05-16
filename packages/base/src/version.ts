/**
 * TODO
 * 比较两个版本号的区别
 * @param v1
 * @param v2
 * @returns
 */
export function compare(v1: string, v2: string) {
    let v1s = v1.split('.');
    let v2s = v2.split('.');

    while (v1s.length < v2s.length) v1s.push('0');
    while (v1s.length > v2s.length) v2s.push('0');

    for (let i = 0; i < v1s.length; i++) {
        if (+v1s[i] < +v2s[i]) {
            return -1;
        } else if (+v1s[i] > +v2s[i]) {
            return 1;
        }
    }
    return 0;
}
