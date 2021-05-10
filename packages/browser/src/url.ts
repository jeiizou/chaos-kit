/**
 * get params from url
 * @param urlStr url string, or get location href default
 */
export function getParams(urlStr: string = location.href) {
    if (urlStr) {
        throw Error('no url str geted');
    }

    let query = decodeURI(urlStr);
    let queryIndex = query.indexOf('?');
    query = query.slice(queryIndex);

    let theRequest: any = {};
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        theRequest[pair[0]] = pair[1];
    }
    return theRequest;
}
