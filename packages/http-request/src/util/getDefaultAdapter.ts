import xhr from '../adapters/xhr';
import fetch from '../adapters/fetch';

export default function getDefaultAdapter(): AdapterFunction {
    let adapter: AdapterFunction;
    // For browsers
    if (typeof fetch !== 'undefined') {
        adapter = fetch;
    } else if (typeof XMLHttpRequest !== 'undefined') {
        adapter = xhr;
    } else {
        throw Error('no adaptor for use ! check the environment');
    }

    return adapter;
}
