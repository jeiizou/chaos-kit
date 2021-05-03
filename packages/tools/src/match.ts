/**
 * 常用正则表达式匹配
 * @param reg
 */
function matchBase(reg: RegExp) {
    return function (str: string) {
        if (str.match(reg)) {
            return true;
        } else {
            return false;
        }
    };
}
// 匹配手机号
export const matchPhone = matchBase(/^1[3456789]\d{9}$/);
// 匹配纯数字
export const matchPureNumber = matchBase(/^[0-9]*$/);
// 匹配纯汉字
export const matchPureChinese = matchBase(/^[\u4e00-\u9fa5]{0,}$/);
//匹配邮箱
export const matchEmail = matchBase(
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
);
//匹配IP
export const matchIP = matchBase(
    /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/,
);
//匹配邮政编码
export const matchChinaPost = matchBase(/[1-9]\d{5}(?!\d)/);
