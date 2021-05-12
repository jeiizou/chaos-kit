# `@jeiizou/lru`

>  a lite library for lru

## UseAge

```js
import LRU from '@chaos-kit/lru';

let cache = new LRU(3);

cache.set('1', '1-value');
cache.set('2', '2-value');
cache.set('3', '3-value');

let keys = Array.from(cache.getKeys());
// ['1', '2', '3']

let value = cache.get('1');
// '1-value'

cache.set('4', '4-value');
// ['1', '3', '4']

cache.set('5', '5-value');
// ['1', '4', '5']
```

