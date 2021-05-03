import xhr from '../adapters/xhr';
import fetch from '../adapters/fetch';
import http from '../adapters/http';

export default function getDefaultAdapter() {
    let adapter;
    // For browsers
    if (typeof fetch !== 'undefined') {
        adapter = fetch;
    } else if (typeof XMLHttpRequest !== 'undefined') {
        adapter = xhr;
    } else if (
        typeof process !== 'undefined' &&
        Object.prototype.toString.call(process) === '[object process]'
    ) {
        // For Node
        adapter = http;
    }
    return adapter;
}
