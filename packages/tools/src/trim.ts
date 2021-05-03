/**
 * 去除字符串首尾的空格
 * @param str
 * @param config
 */
export function trim(str: string) {
    if (typeof str.trim === 'function') {
        return str.trim();
    } else {
        return _trim(str);
    }
}

function _trim(str: string) {
    let whitespace =
        ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0, len = str.length; i < len; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
