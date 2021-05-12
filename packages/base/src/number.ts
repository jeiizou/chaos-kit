/**
 * Divide numbers in thousands
 * @param num
 */
function thousandDivide(num: number) {
    if (num.toLocaleString) {
        return num.toLocaleString();
    }

    let arr = num.toString().split('.');
    let ans = '';
    for (let i = 0; i < arr[0].length; i++) {
        ans = arr[0][arr[0].length - i - 1] + ans;
        if ((i + 1) % 3 == 0) {
            ans = ',' + ans;
        }
    }
    ans += '.' + arr[1];
    return ans;
}

/**
 * numbers close enough to equal
 * @param n1
 * @param n2
 */
export function numbersCloseEnoughToEqual(n1: number, n2: number) {
    return Math.abs(n1 - n2) < Number.EPSILON;
}
