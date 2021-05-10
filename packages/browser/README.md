# `@chaos-kit/browser`

>  a kit box for browser


# features

## copyClipboard

```ts
import { copyClipboard } from '@chaos-kit/browser';

let flag = copyClipboard('test text');
if(flag){
    console.log('copy clipboard successful')
}else{
    console.log('copy clipboard failed')
}
```

## Fullscreen

```ts
import { FullScreen } from '@chaos-kit/browser';

// create
let demo = document.getElementById('demo');
let fullscreen = new FullScreen(demo, ()=>{
    console.log('dom fullscreen state changed')
});

// enable fullscreen
fullscreen.enable();

// exit fullscreen
fullscreen.exit();

// get state for fullscreen
fullscreen.getIsOnFull(); // => false
```

## scrollTo

```ts
import { scrollTo } from '@chaos-kit/browser';

let demo = document.getElementById('demo', {
    // scroll option
});
scrollTo(demo);
```

## state watcher

```ts
import { StateWatcher } from '@chaos-kit/browser';

let handle = StateWatcher.visibilityWatcher()
handle.onChange = function onVisibilityHandle(pageShow:tybooleanpe) {
    console.log('pageShow')
}

// cancel watcher
handle();
```

- `visibilityWatcher`: page show state watcher
- `netWorkWatcher`: web sit network state watcher
- `longTaskWatcher`: long task state watcher