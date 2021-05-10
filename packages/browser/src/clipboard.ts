/**
 * copy text to clipboard
 * @param text the test to be copied
 * @return
 */
export function copyClipboard(text: string) {
    if (!text) {
        console.log('Clipboard copy false: text is empty');
        return false;
    }

    var aux = document.createElement('input');
    aux.setAttribute('value', text);
    document.body.appendChild(aux);
    aux.select();
    let flag = false;
    if (document.execCommand('copy')) {
        flag = true;
    }
    document.body.removeChild(aux);
    return flag;
}
